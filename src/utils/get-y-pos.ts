export default function getYPos(element: HTMLElement) {
  let y = 0
  while (element) {
    y += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent as HTMLElement
  }
  return y
}
