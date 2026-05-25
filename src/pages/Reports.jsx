import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { getChartDataByCategory, formatCurrency, getBiggestExpenseCategory, calculateTotals } from '../utils/financeUtils';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  useEffect(() => {
    const data = storageService.getTransactions();
    setTransactions(data);
    setTotals(calculateTotals(data));
  }, []);

  const chartData = getChartDataByCategory(transactions);
  const biggestExpense = getBiggestExpenseCategory(transactions);

  // Gráfico de Pizza (Gastos por Categoria)
  const pieData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'],
        borderWidth: 1,
        borderColor: '#fff'
      }
    ]
  };

  // Gráfico de Barras (Receitas vs Despesas)
  const barData = {
    labels: ['Resumo Mensal'],
    datasets: [
      {
        label: 'Receitas',
        data: [totals.receitas],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
      {
        label: 'Despesas',
        data: [totals.despesas],
        backgroundColor: '#ef4444',
        borderRadius: 4,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Relatórios Inteligentes</h1>
        <p className="text-slate-500">Análise detalhada do seu comportamento financeiro.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Gastos por Categoria</h3>
          <div className="h-64 flex items-center justify-center">
            {chartData.labels.length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
            ) : (
              <div className="text-slate-400">Sem dados suficientes.</div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Receitas vs Despesas</h3>
          <div className="h-64">
            {(totals.receitas > 0 || totals.despesas > 0) ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                Sem dados suficientes.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-500" /> Categoria de Maior Gasto
          </h3>
          <div className="mt-4">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Liderando as despesas</p>
            <p className="text-3xl font-bold text-slate-800">{biggestExpense.category}</p>
            <p className="text-red-600 font-medium text-lg">{formatCurrency(biggestExpense.amount)}</p>
          </div>
          <p className="mt-4 text-sm text-slate-600 bg-red-50 p-3 rounded-lg border border-red-100">
            A IA recomenda que você defina metas de redução para esta categoria se quiser aumentar sua capacidade de poupança mensal.
          </p>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-500" /> Resumo e Hábitos Financeiros
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Saúde do Balanço</p>
                <p className="text-slate-600 text-sm">
                  {totals.saldo > 0 
                    ? "Suas finanças estão positivas. Você está ganhando mais do que gastando. Ótimo momento para investir ou criar metas." 
                    : totals.saldo < 0 
                      ? "Atenção: Seu saldo está negativo. Você está gastando mais do que arrecada. É necessário revisar os gastos imediatamente." 
                      : "Seu saldo está zerado. Você gasta exatamente o que ganha, o que impossibilita a criação de uma reserva."}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 items-start">
              <CheckCircle2 size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Análise de Categorias</p>
                <p className="text-slate-600 text-sm">
                  {chartData.labels.length >= 4 
                    ? "Seus gastos estão bem diversificados entre várias categorias, indicando um estilo de vida variado."
                    : chartData.labels.length > 0 
                      ? "Seus gastos estão concentrados em poucas áreas. Verifique se essa concentração reflete suas prioridades."
                      : "Não há dados suficientes para analisar a diversificação de gastos."}
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-2">
              <p className="text-sm font-medium text-blue-900">Mensagem da Inteligência Artificial:</p>
              <p className="text-sm text-blue-700 mt-1">
                "Consistência é a chave. Continue cadastrando suas transações e monitorando a proporção das suas despesas em relação à sua renda principal."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
