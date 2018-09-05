export const copyTable = (table, callback) => {
  // browsers have different functions for creating text ranges and selections
  if (document.createRange && window.getSelection) {
    const range = document.createRange()
    const selection = window.getSelection()
    selection.removeAllRanges()
    try {
      range.selectNodeContents(table)
      selection.addRange(range)
    } catch (e) {
      range.selectNode(table)
      selection.addRange(range)
    }
    document.execCommand('copy')
  } else if (document.body.createTextRange) {
    const range = document.body.createTextRange()
    range.moveToElementText(table)
    range.select()
    range.execCommand('copy')
  }
  callback()
}
