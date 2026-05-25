import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { analyzeTransaction } from '../services/aiService';
import { formatCurrency, formatDate } from '../utils/financeUtils';
import { Bot, Plus, Trash2, Loader2, Info } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observation, setObservation] = useState('');

  // AI Result state
  const [aiResult, setAiResult] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    setTransactions(storageService.getTransactions().reverse());
  };

  const handleDelete = (id) => {
    storageService.deleteTransaction(id);
    loadTransactions();
  };

  const handleAnalyzeAndSave = async (e) => {
    e.preventDefault();
    if (!description || !value) return;

    setLoading(true);
    setAiResult(null);
    
    const numericValue = parseFloat(value);
    const apiKey = storageService.getApiKey();

    // Chama o serviço de IA
    const result = await analyzeTransaction(description, numericValue, apiKey);
    
    setAiResult(result);
    setLoading(false);
  };

  const confirmSave = () => {
    if (!aiResult) return;

    const newTransaction = {
      description,
      value: parseFloat(value),
      date,
      observation,
      type: aiResult.tipo.toLowerCase(),
      category: aiResult.categoria,
      aiAnalysis: aiResult.analise,
      aiRecommendation: aiResult.recomendacao
    };

    storageService.saveTransaction(newTransaction);
    loadTransactions();
    
    // Reset form
    setDescription('');
    setValue('');
    setObservation('');
    setAiResult(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500">Gerencie e classifique suas movimentações com IA.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary whitespace-nowrap"
        >
          <Plus size={20} />
          Nova Transação
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          {transactions.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-semibold">Descrição</th>
                  <th className="pb-3 font-semibold">Data</th>
                  <th className="pb-3 font-semibold">Categoria / IA</th>
                  <th className="pb-3 font-semibold text-right">Valor</th>
                  <th className="pb-3 font-semibold text-center w-16">Ação</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <p className="font-medium text-slate-800">{t.description}</p>
                      {t.observation && (
                        <p className="text-xs text-slate-500 mt-1 italic">Obs: {t.observation}</p>
                      )}
                      {t.aiAnalysis && (
                        <div className="flex items-start gap-1 mt-1 text-xs text-blue-600 bg-blue-50 p-1.5 rounded inline-flex">
                          <Bot size={14} className="shrink-0 mt-0.5" />
                          <span>{t.aiAnalysis}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 text-slate-500 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className={`py-4 text-right font-medium whitespace-nowrap ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.value)}
                    </td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt size={24} className="text-slate-400" />
              </div>
              <p className="font-medium text-slate-700">Nenhuma transação encontrada</p>
              <p className="text-sm mt-1">Clique em "Nova Transação" para começar.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Nova Transação */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Bot className="text-blue-600" />
                Análise Inteligente
              </h2>
            </div>
            
            <div className="p-6">
              {!aiResult ? (
                <form onSubmit={handleAnalyzeAndSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">O que foi gasto ou recebido?</label>
                    <input 
                      type="text" 
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Ex: Almoço no shopping, Uber, Salário"
                      className="input-field"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                      <input 
                        type="number" 
                        required
                        step="0.01"
                        min="0.01"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="0.00"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                      <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Observação (Opcional)</label>
                    <input 
                      type="text" 
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Ex: Compra feita no cartão nubank"
                      className="input-field"
                    />
                  </div>
                  
                  <div className="pt-4 flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="btn-secondary flex-1"
                      disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="btn-primary flex-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 size={20} className="animate-spin" /> Analisando...</>
                      ) : (
                        'Analisar com IA'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Bot size={100} />
                    </div>
                    <div className="relative z-10">
                      <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        Resultado da Análise JSON
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-blue-50">
                          <span className="text-xs text-slate-500 uppercase font-semibold">Tipo Identificado</span>
                          <p className={`font-bold capitalize ${aiResult.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {aiResult.tipo}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-blue-50">
                          <span className="text-xs text-slate-500 uppercase font-semibold">Categoria</span>
                          <p className="font-bold text-slate-800">{aiResult.categoria}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg border border-blue-50">
                          <span className="text-xs text-slate-500 uppercase font-semibold mb-1 block">Análise da IA</span>
                          <p className="text-sm text-slate-700">{aiResult.analise}</p>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 flex gap-3 items-start">
                          <Info size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs text-emerald-800 uppercase font-semibold block mb-1">Dica Inteligente</span>
                            <p className="text-sm text-emerald-700">{aiResult.recomendacao}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => setAiResult(null)}
                      className="btn-secondary flex-1"
                    >
                      Refazer
                    </button>
                    <button 
                      onClick={confirmSave}
                      className="btn-primary flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Confirmar e Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
