export const parseHashParams = () => {
    const hashParams = {}
    const hash = window.location.hash.substring(1) // remove the #
    const params = hash.split('&')
    params.forEach(param => {
        const [key, value] = param.split('=')
        hashParams[decodeURIComponent(key)] = decodeURIComponent(value)
    })
    return hashParams
}

export const isScrolledToBottom = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    return scrollTop + clientHeight >= scrollHeight
}

export const updateTextareaSize = (element) => {
    element.style.height = 0

    const style = window.getComputedStyle(element)
    const paddingTop = parseFloat(style.getPropertyValue('padding-top'))
    const paddingBottom = parseFloat(style.getPropertyValue('padding-bottom'))

    const height = element.scrollHeight - paddingTop - paddingBottom

    element.style.height = `${height}px`
}