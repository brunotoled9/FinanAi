export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  // ajustando timezone caso necessário, mas para simpleza:
  return new Intl.DateTimeFormat('pt-BR').format(date);
};
