export const storageService = {
  // Transações
  getTransactions: () => {
    const data = localStorage.getItem('finanai_transactions');
    if (data) {
      return JSON.parse(data);
    }
    
    // Dados iniciais para demonstração
    const initialData = [
      { id: crypto.randomUUID(), description: "Salário", value: 1800, date: "2026-05-01", type: "receita", category: "Salário", aiAnalysis: "Entrada principal de renda do usuário.", aiRecommendation: "Separe uma parte da receita para reserva financeira." },
      { id: crypto.randomUUID(), description: "Uber", value: 32, date: "2026-05-03", type: "despesa", category: "Transporte", aiAnalysis: "Gasto relacionado ao deslocamento.", aiRecommendation: "Acompanhe a frequência desse tipo de gasto durante o mês." },
      { id: crypto.randomUUID(), description: "Mercado", value: 145.9, date: "2026-05-04", type: "despesa", category: "Alimentação", aiAnalysis: "Despesa essencial relacionada à alimentação.", aiRecommendation: "Planeje compras semanais para evitar gastos extras." },
      { id: crypto.randomUUID(), description: "Netflix", value: 39.9, date: "2026-05-05", type: "despesa", category: "Lazer", aiAnalysis: "Gasto recorrente com entretenimento.", aiRecommendation: "Revise assinaturas mensais para verificar se todas ainda são necessárias." },
      { id: crypto.randomUUID(), description: "Farmácia", value: 67.5, date: "2026-05-06", type: "despesa", category: "Saúde", aiAnalysis: "Despesa relacionada a cuidados com saúde.", aiRecommendation: "Mantenha esse tipo de gasto separado por ser uma despesa importante." }
    ];
    localStorage.setItem('finanai_transactions', JSON.stringify(initialData));
    return initialData;
  },
  saveTransaction: (transaction) => {
    const transactions = storageService.getTransactions();
    transactions.push({ ...transaction, id: crypto.randomUUID() });
    localStorage.setItem('finanai_transactions', JSON.stringify(transactions));
  },
  deleteTransaction: (id) => {
    const transactions = storageService.getTransactions();
    const updated = transactions.filter(t => t.id !== id);
    localStorage.setItem('finanai_transactions', JSON.stringify(updated));
  },

  // Metas
  getGoals: () => {
    const data = localStorage.getItem('finanai_goals');
    return data ? JSON.parse(data) : [];
  },
  saveGoal: (goal) => {
    const goals = storageService.getGoals();
    goals.push({ ...goal, id: crypto.randomUUID(), currentAmount: 0 });
    localStorage.setItem('finanai_goals', JSON.stringify(goals));
  },
  updateGoalAmount: (id, amountToAdd) => {
    const goals = storageService.getGoals();
    const updated = goals.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amountToAdd } : g);
    localStorage.setItem('finanai_goals', JSON.stringify(updated));
  },
  deleteGoal: (id) => {
    const goals = storageService.getGoals();
    const updated = goals.filter(g => g.id !== id);
    localStorage.setItem('finanai_goals', JSON.stringify(updated));
  },
  
  // Configurações (API Key)
  getApiKey: () => {
    return localStorage.getItem('finanai_openai_key') || '';
  },
  saveApiKey: (key) => {
    localStorage.setItem('finanai_openai_key', key);
  }
};
