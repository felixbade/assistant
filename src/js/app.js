import { chatCompletionStream } from './api'
import {
    parseHashParams,
    smoothScroll,
    isScrolledToBottom,
    updateTextareaSize
} from './utils'
import { markdownToDocumentFragment } from './markdown'

const setupAPIKeyInput = () => {
    const startView = document.querySelector('#start-view')

    const element = document.querySelector('#api-key')
    const savedAPIKey = localStorage.getItem('api-key') || ''
    element.value = savedAPIKey

    element.addEventListener('input', () => {
        const key = element.value
        console.log('saving:', key)
        localStorage.setItem('api-key', key)
        if (key) {
            startView.classList.add('hidden')
        } else {
            startView.classList.remove('hidden')
        }
    })

    if (savedAPIKey) {
        startView.classList.add('hidden')
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
    messageBubble.appendChild(markdownToDocumentFragment(message))
    messageContainer.appendChild(messageBubble)

    const copiedIndicator = document.createElement('span')
    copiedIndicator.classList.add('copied-indicator')
    messageContainer.appendChild(copiedIndicator)

    messageBubble.addEventListener('click', () => {
        navigator.clipboard.writeText(message)
        .then(() => {
            copiedIndicator.innerText = 'Copied!'
        })
        .catch((error) => {
            alert('Error copying text to clipboard:', error)
        })
    })

    window.addEventListener('click', () => {
        const oldCopiedIndicators = document.querySelectorAll('.copied-indicator')
        for (const indicator of oldCopiedIndicators) {
            indicator.innerText = ''
        }
    })

    return messageContainer
}

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
    setupAPIKeyInput()

    let messages = [
        {
            'role': 'system',
            'content': 'Response format is ALWAYS markdown, especially for code.'
        }
    ]

    const sendMessage = (message) => {
        removeErrorMessages()
        addSentMessage(message)
        // scroll down always after sending message, even if wasn't before
        smoothScroll(document.body.scrollHeight, 500)

        const typingIndicatorElement = addReceivedMessage('● ● ●')

        messages.push({
            'role': 'user',
            'content': message
        })

        const apiKey = localStorage.getItem('api-key')

        const response = chatCompletionStream(apiKey, {
            messages
        },
        (response) => {
            typingIndicatorElement.remove()
            const wasScrolledToBottom = isScrolledToBottom()

            if ('error' in response) {
                addErrorMessage(response.error.message, 'assistant')

            } else if ('choices' in response) {
                const delta = response.choices[0].delta
                if ('content' in delta) {
                    messages.push(delta)
                    addReceivedMessage(delta.content)
                }
            }

            if (wasScrolledToBottom) smoothScroll(document.body.scrollHeight, 500)
        })
    }

    const hashParams = parseHashParams()
    if ('q' in hashParams && hashParams.q) {
        sendMessage(hashParams.q)
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

    textbox.addEventListener('input', () => {
        updateTextareaSize(textbox)
    })
    updateTextareaSize(textbox)
})