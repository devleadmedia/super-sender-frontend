export function moneyFormat(value: number) {
  return value.toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function parseMoneyFormatted(value: string): number {
  if (!value) return 0
  
  const numericString = value
    .replace(/[^\d,-]/g, '')
    .replace('.', '')
    .replace(',', '.')

  const numberValue = parseFloat(numericString)

  return numberValue
}
