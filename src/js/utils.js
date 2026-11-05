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

const parseModelId = (id) => {
    const match = id.match(/^gpt-(\d+)(?:\.(\d+))?-?(.*)$/)
    if (!match) return null

    return {
        major: parseInt(match[1], 10),
        minor: match[2] ? parseInt(match[2], 10) : 0,
        variant: match[3] || ''
    }
}

const compareModels = (a, b) => {
    const parsedA = parseModelId(a)
    const parsedB = parseModelId(b)

    if (!parsedA || !parsedB) return b.localeCompare(a)

    if (parsedA.major !== parsedB.major) return parsedB.major - parsedA.major
    if (parsedA.minor !== parsedB.minor) return parsedB.minor - parsedA.minor

    return parsedA.variant.localeCompare(parsedB.variant)
}

export const filterAndSortModels = (rawModels) => {
    if (!rawModels || !Array.isArray(rawModels)) return []

    const excludeKeywords = ['image', 'audio', 'transcribe', 'tts', 'realtime', 'live', 'search', 'moderation', 'embedding', 'whisper', 'codex', '-pro']
    const datePattern = /-\d{4}(-\d{2}-\d{2})?$/

    return rawModels
        .map(m => typeof m === 'string' ? m : m?.id)
        .filter(id => id && id.startsWith('gpt-'))
        .filter(id => !excludeKeywords.some(keyword => id.includes(keyword)))
        .filter(id => !datePattern.test(id))
        .sort(compareModels)
}

export const setupPersistentInputs = () => {
    const persistentInputs = document.querySelectorAll('[data-persistent-name]')
    const getName = element => element.getAttribute('data-persistent-name')

    // Load default values from HTML if no saved data
    for (const persistentInput of persistentInputs) {
        const name = getName(persistentInput)
        const savedValue = localStorage.getItem(name)
        if (!savedValue) {
            localStorage.setItem(name, persistentInput.value)
        }
    }

    // Update fields with saved data
    for (const persistentInput of persistentInputs) {
        const name = getName(persistentInput)
        persistentInput.value = localStorage.getItem(name)

        persistentInput.addEventListener('input', () => {
            const value = persistentInput.value
            localStorage.setItem(name, value)
            console.log('saving:', name, value)

            for (const otherInput of persistentInputs) {
                if (getName(otherInput) === name) {
                    otherInput.value = value
                }
            }
        })

        // from other tabs
        window.addEventListener('storage', event => {
            if (event.key === name) {
                persistentInput.value = event.newValue
            }
        })
    }
}