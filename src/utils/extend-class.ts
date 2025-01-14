export default function extendClass(className: string, extension: string) {
  return className
    ? className
        .split(' ')
        .map((name) => `${name}__${extension}`)
        .join(' ')
    : ''
}
