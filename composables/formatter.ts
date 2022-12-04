export const formatter = (number: number) =>
  new Intl.NumberFormat('ko-kr', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(Math.round(number))
