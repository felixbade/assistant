import { chatCompletion } from './api'
import {
    parseHashParams,
    smoothScroll,
    isScrolledToBottom,
    updateTextareaSize
} from './utils'
import { renderMarkdownToElement } from './markdown'

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
    messageBubble.appendChild(renderMarkdownToElement(message))
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

window.addEventListener('load', () => {
    setupAPIKeyInput()

    let messages = [
        {
            'role': 'system',
            'content': 'Response format is ALWAYS markdown, especially for code.'
        }
    ]

    const sendMessage = (message) => {
        addSentMessage(message)
        // scroll down always after sending message, even if wasn't before
        smoothScroll(document.body.scrollHeight, 500)

        const dot = '&#x25CF;'
        const typingIndicatorElement = addReceivedMessage(`${dot} ${dot} ${dot}`)

        messages.push({
            'role': 'user',
            'content': message
        })

        const apiKey = localStorage.getItem('api-key')

        const response = chatCompletion(apiKey, {
            messages
        })

        response.then(message => {
            typingIndicatorElement.remove()
            const wasScrolledToBottom = isScrolledToBottom()

            if ('error' in message) {
                addErrorMessage(message.error.message, 'assistant')

            } else if ('choices' in message) {
                message = message.choices[0].message
                messages.push(message)
                addReceivedMessage(message.content)
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
        sendMessage(input)
    }


    const textbox = document.querySelector('#prompt')

    textbox.addEventListener('keydown', (event) => {
        if (event.code === 'Enter' && !event.ctrlKey && !event.altKey && !event.shiftKey) {
            event.preventDefault()
            submitMessageForm()
            updateTextareaSize(textbox)
        }
    })

    document.querySelector('form').addEventListener('submit', (event) => {
        event.preventDefault()
        submitMessageForm()
        updateTextareaSize(textbox)
    })

    textbox.addEventListener('input', () => {
        updateTextareaSize(textbox)
    })
    updateTextareaSize(textbox)
})