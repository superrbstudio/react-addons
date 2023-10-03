const extendClass = (className: string, extension: string) =>
  className
    ? className
        .split(' ')
        .map((name) => `${name}__${extension}`)
        .join(' ')
    : ''

export default extendClass
