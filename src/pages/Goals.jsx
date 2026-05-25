import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { formatCurrency } from '../utils/financeUtils';
import { Target, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    setGoals(storageService.getGoals());
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    storageService.saveGoal({
      title,
      targetAmount: parseFloat(targetAmount)
    });
    
    setTitle('');
    setTargetAmount('');
    setIsModalOpen(false);
    loadGoals();
  };

  const handleDelete = (id) => {
    storageService.deleteGoal(id);
    loadGoals();
  };

  const handleAddProgress = (id) => {
    const amount = prompt("Quanto deseja adicionar ao progresso dessa meta?");
    if (amount && !isNaN(amount)) {
      storageService.updateGoalAmount(id, parseFloat(amount));
      loadGoals();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Metas Financeiras</h1>
          <p className="text-slate-500">Defina objetivos e acompanhe seu progresso.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={20} />
          Nova Meta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCompleted = progress >= 100;

          return (
            <div key={goal.id} className="card relative overflow-hidden group">
              {isCompleted && (
                <div className="absolute top-0 right-0 p-4">
                  <CheckCircle2 size={24} className="text-emerald-500" />
                </div>
              )}
              
              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-800 truncate pr-8">{goal.title}</h3>
                <p className="text-sm text-slate-500">
                  {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
                </p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-3 mb-6 relative overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: \`\${progress}%\` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-auto border-t border-slate-100 pt-4">
                <span className="font-medium text-slate-700">{progress}% concluído</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAddProgress(goal.id)}
                    disabled={isCompleted}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Adicionar saldo"
                  >
                    <Plus size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="col-span-full card text-center py-12">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
              <Target size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Nenhuma meta definida</h3>
            <p className="text-slate-500 mt-2">Crie sua primeira meta para começar a poupar.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Nova Meta Financeira</h2>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Meta</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Comprar Notebook, Viagem"
                  className="input-field"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Valor Alvo (R$)</label>
                <input 
                  type="number" 
                  required
                  step="0.01"
                  min="1"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="Ex: 5000.00"
                  className="input-field"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Salvar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
