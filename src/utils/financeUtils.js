export const calculateTotals = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const value = parseFloat(transaction.value);
    if (transaction.type === 'receita') {
      acc.receitas += value;
    } else {
      acc.despesas += value;
    }
    acc.saldo = acc.receitas - acc.despesas;
    return acc;
  }, { receitas: 0, despesas: 0, saldo: 0 });
};

export const getBiggestExpenseCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'despesa');
  if (expenses.length === 0) return { category: 'Nenhuma', amount: 0 };

  const grouped = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.value);
    return acc;
  }, {});

  let maxCategory = 'Nenhuma';
  let maxAmount = 0;

  for (const [category, amount] of Object.entries(grouped)) {
    if (amount > maxAmount) {
      maxAmount = amount;
      maxCategory = category;
    }
  }

  return { category: maxCategory, amount: maxAmount };
};

export const getChartDataByCategory = (transactions) => {
  const expenses = transactions.filter(t => t.type === 'despesa');
  
  const grouped = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + parseFloat(transaction.value);
    return acc;
  }, {});

  return {
    labels: Object.keys(grouped),
    data: Object.values(grouped)
  };
};
