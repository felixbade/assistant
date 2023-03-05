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

export const smoothScroll = (targetPosition, duration) => {
    const currentPosition = window.pageYOffset
    const distance = targetPosition - currentPosition
    const startTime = performance.now()

    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
    }

    const animationCallback = (time) => {
        const elapsedTime = time - startTime
        const scroll = easeInOutQuad(elapsedTime, currentPosition, distance, duration)
        window.scrollTo(0, scroll)
        if (elapsedTime < duration) requestAnimationFrame(animationCallback)
    }

    requestAnimationFrame(animationCallback)
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