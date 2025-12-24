export function formatCurrency(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      useGrouping: true,
    }).format(number);
  }
  