const ToHTML = (text: string) => {
  return text.replaceAll('\n', '<br />')
}

const ToDisplay = (text: string) => {
  return text.replaceAll('<br />', '\n').replaceAll('<br>', '\n')
}

const ToSplit = (text: string) => {
  return text.split('\n')
}

const ReduceTitle = (text: string) => {
  let ModifiedText = text

  const colon = /.*?:/
  ModifiedText = text.replace(colon, '')

  const paranthesis = /\(([^)]+)\)/g
  ModifiedText = ModifiedText.replace(paranthesis, '')

  return ModifiedText
}

export { ToHTML, ToDisplay, ToSplit, ReduceTitle }
