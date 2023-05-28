const ToHTML = (text: string) => {
  return text.replaceAll('\n', '<br />')
}

const ToDisplay = (text: string) => {
  return text.replaceAll('<br />', '\n').replaceAll('<br>', '\n')
}

export { ToHTML, ToDisplay }
