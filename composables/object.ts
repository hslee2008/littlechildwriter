export const Keys = (value: object): Array<any> => {
  if (value === null || value === undefined) return []

  return Object.keys(value)
}

export const Values = (value: object): Array<any> => {
  if (value === null || value === undefined) return []

  return Object.values(value)
}
