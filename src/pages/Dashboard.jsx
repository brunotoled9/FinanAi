import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { calculateTotals, formatCurrency, formatDate, getBiggestExpenseCategory } from '../utils/financeUtils';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, TrendingUp, AlertTriangle, Info, Target } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getChartDataByCategory } from '../utils/financeUtils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [totals, setTotals] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  useEffect(() => {
    const data = storageService.getTransactions();
    const goalsData = storageService.getGoals();
    setTransactions(data);
    setGoals(goalsData);
    setTotals(calculateTotals(data));
  }, []);

  const chartData = getChartDataByCategory(transactions);
  const biggestExpense = getBiggestExpenseCategory(transactions);
  
  const doughnutData = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: [
          '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#0ea5e9', '#d946ef'
        ],
        borderWidth: 0,
      },
    ],
  };

  // Gerador de Alertas Inteligentes
  const getAlerts = () => {
    const alerts = [];
    
    // Saldo negativo
    if (totals.saldo < 0) {
      alerts.push({
        type: 'danger',
        icon: <AlertTriangle size={20} />,
        message: 'Atenção: Suas despesas ultrapassaram suas receitas. Revise seus gastos imediatamente.'
      });
    }

    // Concentração na maior categoria
    if (biggestExpense.amount > 0 && biggestExpense.amount > (totals.despesas * 0.4)) {
      alerts.push({
        type: 'warning',
        icon: <Info size={20} />,
        message: \`Sua maior despesa é com \${biggestExpense.category}, representando mais de 40% dos gastos.\`
      });
    }

    // Muitos gastos em lazer ou alimentação
    const foodLazerExpenses = transactions.filter(t => t.type === 'despesa' && (t.category === 'Alimentação' || t.category === 'Lazer'));
    const totalFoodLazer = foodLazerExpenses.reduce((acc, curr) => acc + curr.value, 0);
    if (totalFoodLazer > (totals.despesas * 0.3) && totals.despesas > 0) {
      alerts.push({
        type: 'info',
        icon: <Info size={20} />,
        message: 'Você tem um volume alto de gastos em Alimentação e Lazer. Sugerimos revisar para economizar mais.'
      });
    }

    // Sem metas cadastradas
    if (goals.length === 0) {
      alerts.push({
        type: 'success',
        icon: <Target size={20} />,
        message: 'Você ainda não possui metas financeiras. Defina uma meta para começar a poupar!'
      });
    }

    return alerts;
  };

  const alerts = getAlerts();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Financeiro</h1>
          <p className="text-slate-500">Visão geral das suas finanças analisadas por IA.</p>
        </div>
        <div className="text-right hidden sm:block text-sm text-slate-500">
          <p>Total de registros: <strong>{transactions.length} transações</strong></p>
        </div>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="flex flex-col gap-3">
          {alerts.map((alert, index) => {
            const colors = {
              danger: 'bg-red-50 text-red-700 border-red-200',
              warning: 'bg-amber-50 text-amber-700 border-amber-200',
              info: 'bg-blue-50 text-blue-700 border-blue-200',
              success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            };
            return (
              <div key={index} className={\`flex items-start gap-3 p-4 rounded-xl border \${colors[alert.type]}\`}>
                <div className="shrink-0 mt-0.5">{alert.icon}</div>
                <p className="font-medium text-sm">{alert.message}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-600 to-blue-800 text-white border-none shadow-blue-500/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-100">Saldo Atual</h3>
            <DollarSign size={20} className="text-blue-200" />
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totals.saldo)}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-slate-500">Receitas</h3>
            <ArrowUpCircle size={20} className="text-emerald-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(totals.receitas)}</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-slate-500">Despesas</h3>
            <ArrowDownCircle size={20} className="text-red-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(totals.despesas)}</p>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-slate-500">Maior Gasto</h3>
            <TrendingUp size={20} className="text-purple-500" />
          </div>
          <p className="text-lg font-bold text-slate-800 truncate" title={biggestExpense.category}>
            {biggestExpense.category}
          </p>
          <p className="text-sm font-medium text-slate-500">{formatCurrency(biggestExpense.amount)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico */}
        <div className="card lg:col-span-1">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            Despesas por Categoria
          </h3>
          <div className="h-64 flex items-center justify-center relative">
            {chartData.labels.length > 0 ? (
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-slate-400">Nenhum dado para exibir.</p>
            )}
          </div>
        </div>

        {/* Últimas Transações */}
        <div className="card lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Últimas Transações</h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            {transactions.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm font-medium text-slate-500">
                    <th className="pb-3 font-semibold">Descrição</th>
                    <th className="pb-3 font-semibold">Categoria</th>
                    <th className="pb-3 font-semibold text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {transactions.slice(-5).reverse().map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-medium text-slate-800">
                        {t.description}
                        <div className="text-xs text-slate-400 mt-0.5">{formatDate(t.date)}</div>
                      </td>
                      <td className="py-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium">
                          {t.category}
                        </span>
                      </td>
                      <td className={`py-3 text-right font-medium ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                <p>Nenhuma transação registrada.</p>
                <p className="text-sm">Cadastre transações para ver o resumo aqui.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
