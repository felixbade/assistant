import { chatCompletionStream, getModels } from './api'
import {
    parseHashParams,
    isScrolledToBottom,
    updateTextareaSize,
    setupPersistentInputs,
    filterAndSortModels,
    formatModelName
} from './utils'
import { markdownToDocumentFragment } from './markdown'
import html2canvas from 'html2canvas'

const showModelPlaceholder = (text) => {
    const modelSelect = document.querySelector('#model-select')
    if (!modelSelect) return

    modelSelect.innerHTML = ''
    const option = document.createElement('option')
    option.value = ''
    option.disabled = true
    option.selected = true
    option.innerText = text
    modelSelect.appendChild(option)
}

const showSelectedModel = (isLoading) => {
    const savedModel = localStorage.getItem('last-selected-model')
    const modelSelect = document.querySelector('#model-select')
    if (!savedModel || !modelSelect) return false

    modelSelect.innerHTML = ''

    const selected = document.createElement('option')
    selected.value = savedModel
    selected.innerText = formatModelName(savedModel)
    selected.selected = true
    modelSelect.appendChild(selected)

    if (isLoading) {
        const loading = document.createElement('option')
        loading.disabled = true
        loading.innerText = 'Loading models...'
        modelSelect.appendChild(loading)
    }

    return true
}

const renderModelOptions = (models) => {
    if (!models || models.length === 0) {
        showModelPlaceholder('No models available')
        return
    }

    const modelSelect = document.querySelector('#model-select')
    if (!modelSelect) return

    const currentOptions = Array.from(modelSelect.options).map(o => o.value)
    const isSame = currentOptions.length === models.length && currentOptions.every((v, i) => v === models[i])

    const savedSelected = localStorage.getItem('last-selected-model')
    const preferredSelected = modelSelect.value || savedSelected

    if (!isSame) {
        modelSelect.innerHTML = ''
        for (const model of models) {
            const option = document.createElement('option')
            option.value = model
            option.innerText = formatModelName(model)
            modelSelect.appendChild(option)
        }
    }

    if (preferredSelected && models.includes(preferredSelected)) {
        modelSelect.value = preferredSelected
    } else {
        modelSelect.value = models[0]
    }

    localStorage.setItem('last-selected-model', modelSelect.value)
}

const renderModelsFromData = (data) => {
    const models = filterAndSortModels(data)
    renderModelOptions(models)
    return models
}

const hasModelOptions = () => {
    const modelSelect = document.querySelector('#model-select')
    return !!modelSelect && Array.from(modelSelect.options).some(o => o.value)
}

let latestModelsRequest = 0

const loadModels = (apiKey) => {
    if (!apiKey) return Promise.resolve(null)

    const request = ++latestModelsRequest

    // Show the remembered model immediately; only use placeholder states when
    // there is nothing to display, so a refresh doesn't wipe the dropdown.
    const hadModels = hasModelOptions()
    const showedSaved = !hadModels && showSelectedModel(true)
    const hasFallback = hadModels || showedSaved
    if (!hasFallback) showModelPlaceholder('Loading models...')

    return getModels(apiKey).then(response => {
        if (request !== latestModelsRequest) return { stale: true }

        if (response && response.data) {
            renderModelsFromData(response.data)
        } else if (showedSaved) {
            showSelectedModel(false)
        } else if (!hadModels) {
            showModelPlaceholder('No models available')
        }
        return response
    }).catch(error => {
        console.error('Error fetching models:', error)
        if (request !== latestModelsRequest) return { stale: true }

        if (showedSaved) {
            showSelectedModel(false)
        } else if (!hadModels) {
            showModelPlaceholder('No models available')
        }
        return { error }
    })
}

const setupAPIKeyInput = () => {
    window.addEventListener('storage', event => {
        if (event.key === 'api-key') {
            updateApiKeyStatus()
        }
    })

    // storage event is fired only when other tabs change the storage
    const apiKeyElements = document.querySelectorAll('.api-key-input')
    for (const apiKeyElement of apiKeyElements) {
        apiKeyElement.addEventListener('input', () => {
            updateApiKeyStatus()
        })
    }

    const savedAPIKey = localStorage.getItem('api-key')
    const introView = document.querySelector('#intro-view')
    if (!savedAPIKey) {
        introView.classList.remove('hidden')
    }

    document.querySelector('#intro-continue').addEventListener('click', () => {
        introView.classList.add('hidden')
        document.querySelector('#prompt').focus()
    })
}

const clearApiKeyStatus = () => {
    const statusElements = document.querySelectorAll('.api-key-status')
    statusElements.forEach(x => x.classList.remove('error'))
    statusElements.forEach(x => x.classList.remove('success'))
    statusElements.forEach(x => x.innerText = '')
}

const updateApiKeyStatus = () => {
    const statusElements = document.querySelectorAll('.api-key-status')
    const continueElement = document.querySelector('#intro-continue')

    clearApiKeyStatus()
    continueElement.classList.add('secondary')

    const apiKey = localStorage.getItem('api-key')
    if (!apiKey) {
        return
    }

    statusElements.forEach(x => x.innerText = 'Checking...')

    loadModels(apiKey).then(response => {
        if (response && response.stale) return

        if (!response || response.error) {
            statusElements.forEach(x => x.classList.add('error'))
            if (response && response.error && response.error.code === 'invalid_api_key') {
                statusElements.forEach(x => x.innerText = 'This API key doesn’t work.')
            } else {
                statusElements.forEach(x => x.innerText = 'There was an error when checking the API key.')
            }
        } else {
            statusElements.forEach(x => x.innerText = 'This API key is working!')
            statusElements.forEach(x => x.classList.add('success'))
            continueElement.classList.remove('secondary')
        }
    })
}

const setupSettingsHandlers = () => {
    const settingsView = document.querySelector('#settings-view')

    document.querySelector('#settings-button').addEventListener('click', () => {
        settingsView.classList.remove('hidden')
        clearApiKeyStatus()

        // textarea height is incorrectly calculated when it's hidden from the viewport
        // calculate it again
        // this logic should be generalized but works for now like this
        for (const textarea of document.querySelectorAll('textarea')) {
            updateTextareaSize(textarea)
        }
    })

    document.querySelector('#settings-exit-button').addEventListener('click', () => {
        settingsView.classList.add('hidden')
        // document.querySelector('#prompt').focus() // annoying on mobile
    })

    document.querySelector('#settings-show-intro').addEventListener('click', () => {
        settingsView.classList.add('hidden')
        document.querySelector('#intro-view').classList.remove('hidden')
        updateApiKeyStatus()
    })
}


const getUserSelectedModel = () => {
    const modelSelect = document.querySelector('#model-select')
    return modelSelect ? modelSelect.value : ''
}


const saveScreenshot = () => {
    const elementToSave = document.querySelector('#output')
    const backgroundColor = getComputedStyle(document.body).backgroundColor

    // Use html2canvas to render the element as a canvas
    html2canvas(elementToSave, { backgroundColor }).then(canvas => {
        // Convert the canvas to a downloadable data URL (image/png format)
        const dataURL = canvas.toDataURL('image/png')

        // Create a temporary anchor to download the image
        const tempAnchor = document.createElement('a')
        tempAnchor.href = dataURL
        tempAnchor.download = 'assistant.png'

        // Append the anchor to the document, simulate a click and remove the anchor
        document.body.appendChild(tempAnchor)
        tempAnchor.click()
        document.body.removeChild(tempAnchor)
    })
}


const saveMarkdown = (messages) => {
    // Convert messages array to markdown string
    const markdownContent = messages.map((message) => {
        const capitalized = text => text[0].toUpperCase() + text.slice(1)
        return `## ${capitalized(message.role)}\n${message.content}`
    }).join('\n\n')

    // Create a downloadable data URL (text/markdown format)
    const dataURL = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdownContent)

    // Create a temporary anchor to download the markdown file
    const tempAnchor = document.createElement('a')
    tempAnchor.href = dataURL
    tempAnchor.download = 'assistant.md'

    // Append the anchor to the document, simulate a click and remove the anchor
    document.body.appendChild(tempAnchor)
    tempAnchor.click()
    document.body.removeChild(tempAnchor)
}


let mouseDown = false
let hasSelectedText = false

document.addEventListener('mousedown', () => {
    mouseDown = true
    hasSelectedText = false
})

document.addEventListener('mousemove', () => {
    if (mouseDown && window.getSelection().toString().length > 0) {
        hasSelectedText = true
    }
})

document.addEventListener('mouseup', () => {
    mouseDown = false
})

let timeoutInterval = null
const showNotification = text => {
    let notification = document.querySelector('#notification')
    notification.className = 'notification show'
    notification.innerText = text
    if (timeoutInterval) {
        clearInterval(timeoutInterval)
    }
    timeoutInterval = setTimeout(() => {
        notification.className = "notification"
    }, 4000)
}

const injectCopyEventListeners = fragment => {
    for (const code of fragment.querySelectorAll('code, pre')) {
        code.addEventListener('click', event => {
            if (hasSelectedText) {
                return
            }
            event.stopPropagation()
            navigator.clipboard.writeText(code.innerText)
            .then(() => {
                showNotification('Copied!')
            })
            .catch((error) => {
                showNotification('Error copying text to clipboard:', error)
            })
        })
    }
}

const addMessage = (message, type) => {
    const element = document.querySelector('#output')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add(`${type}-container`)
    element.appendChild(messageContainer)

    const messageBubble = document.createElement('div')
    messageBubble.classList.add(`${type}-bubble`)
    messageBubble.classList.add('message-bubble')
    const fragment = markdownToDocumentFragment(message)
    injectCopyEventListeners(fragment)
    messageBubble.appendChild(fragment)
    messageContainer.appendChild(messageBubble)

    const copiedIndicator = document.createElement('span')
    copiedIndicator.classList.add('copied-indicator')
    messageContainer.appendChild(copiedIndicator)

    return messageContainer
}

window.addEventListener('click', () => {
    const oldCopiedIndicators = document.querySelectorAll('.copied-indicator')
    for (const indicator of oldCopiedIndicators) {
        indicator.innerText = ''
    }
})

const addSentMessage = message => {
    return addMessage(message, 'my-message')
}

const addReceivedMessage = message => {
    return addMessage(message, 'response')
}

const addErrorMessage = (message, type) => {
    const element = document.querySelector('#output')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add(`${type}-container`)
    messageContainer.classList.add('error')
    element.appendChild(messageContainer)

    messageContainer.innerText = message

    return messageContainer
}

const removeErrorMessages = () => {
    for (const errorMessage of document.querySelectorAll('.error')) {
        errorMessage.remove()
    }
}

window.addEventListener('load', () => {
    setupPersistentInputs()
    setupAPIKeyInput()
    setupSettingsHandlers()

    const storedApiKey = localStorage.getItem('api-key')
    let modelsLoaded = null
    if (storedApiKey) {
        modelsLoaded = loadModels(storedApiKey)
    } else {
        showModelPlaceholder('No models available')
    }

    let messages = [
        {
            'role': 'system',
            'content': localStorage.getItem('initial-system-message')
        }
    ]

    document.querySelector('#screenshot-button').addEventListener('click', () => {
        saveScreenshot()
    })

    document.querySelector('#save-md-button').addEventListener('click', () => {
        saveMarkdown(messages)
    })

    const sendMessage = (message) => {
        removeErrorMessages()
        addSentMessage(message)

        const typingIndicatorElement = addReceivedMessage('● ● ●')

        // scroll down always after sending message, even if wasn't before
        document.body.scrollIntoView({ block: 'end', behavior: 'smooth' })

        messages.push({
            'role': 'user',
            'content': message
        })

        const apiKey = localStorage.getItem('api-key')
        const model = getUserSelectedModel() || localStorage.getItem('last-selected-model')

        let newMessage = {}
        let newMessageBubble = null

        // +1 because always include the new message
        const maxMessages = parseInt(localStorage.getItem('maximum-messages')) + 1
        const systemMessage = messages[0]
        // .slice(1) so the systemMessage doesn't appear twice
        const truncatedMessages = [systemMessage, ...messages.slice(1).slice(-maxMessages)]

        chatCompletionStream(apiKey, {
            messages: truncatedMessages,
            model
        },
        (response) => {
            typingIndicatorElement.remove()
            const wasScrolledToBottom = isScrolledToBottom()

            if ('error' in response) {
                addErrorMessage(response.error.message, 'assistant')

            } else if ('choices' in response) {
                const delta = response.choices[0].delta
                if ('role' in delta) {
                    newMessage = {
                        'role': delta.role,
                        'content': ''
                    }
                    messages.push(newMessage)
                    newMessageBubble = addReceivedMessage(newMessage.content)
                }
                if ('content' in delta) {
                    newMessage.content += delta.content
                    newMessageBubble.firstChild.innerHTML = ''

                    const fragment = markdownToDocumentFragment(newMessage.content + '\n')
                    injectCopyEventListeners(fragment)
                    newMessageBubble.firstChild.appendChild(fragment)
                }
            }

            if (wasScrolledToBottom) {
                // Instant, non-smooth scroll
                window.scrollTo(0, document.body.scrollHeight)
            }
        })
    }

    const hashParams = parseHashParams()
    if ('q' in hashParams && hashParams.q) {
        if (modelsLoaded) {
            modelsLoaded.then(() => sendMessage(hashParams.q))
        } else {
            sendMessage(hashParams.q)
        }
    }

    const submitMessageForm = () => {
        const input = document.querySelector('#prompt').value
        document.querySelector('#prompt').value = ''
        updateTextareaSize(textbox)
        sendMessage(input)
    }


    const textbox = document.querySelector('#prompt')

    textbox.addEventListener('keydown', (event) => {
        // We need to use the deprecated event.keyCode here, because Chrome doesn't handle
        // Chinese pinyin keyboard correctly
        if (event.keyCode === 13 && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            event.preventDefault()
            submitMessageForm()
        }
    })

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault()
        submitMessageForm()
    })

    for (const textarea of document.querySelectorAll('textarea')) {
        textarea.addEventListener('input', () => {
            updateTextareaSize(textarea)
        })
        updateTextareaSize(textarea)
    }

    document.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key.toLowerCase() === 'm') {
            rotateSelectValue('model-select')
        }
    })

    const rotateSelectValue = selectId => {
        const select = document.querySelector(`#${selectId}`)
        if (!select || select.options.length === 0) return

        if (select.selectedIndex < select.options.length - 1) {
            select.selectedIndex++
        } else {
            select.selectedIndex = 0
        }

        // Dispatch a synthetic change event
        const event = new Event('change', { bubbles: true })
        select.dispatchEvent(event)
    }

    // Listen to changes in the model select
    // When the model is changed, save the new model in localStorage
    const modelSelect = document.querySelector('#model-select')
    modelSelect.addEventListener('change', () => {
        const selectedModel = getUserSelectedModel()
        if (selectedModel) {
            localStorage.setItem('last-selected-model', selectedModel)
        }
    })

})