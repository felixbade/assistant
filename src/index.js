const chatCompletion = (apiKey, data) => {
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    data.model = "gpt-3.5-turbo"

    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => data.choices[0].message)
        .catch(error => {
            console.error('Error:', error)
        })
}

const setupAPIKeyInput = () => {
    const element = document.querySelector('#api-key')
    const savedAPIKey = localStorage.getItem('api-key') || ''
    element.value = savedAPIKey
    element.addEventListener('input', () => {
        console.log('saving:', element.value)
        localStorage.setItem('api-key', element.value)
    })
}

const renderMarkdown = md => {
    console.log(md)

    return DOMPurify.sanitize(marked.parse(md, {
        gfm: true
    }))
}

const addMessage = (message, type) => {
    const element = document.querySelector('#output')

    const messageContainer = document.createElement('div')
    messageContainer.classList.add(`${type}-container`)
    element.appendChild(messageContainer)

    const messageBubble = document.createElement('div')
    messageBubble.classList.add(`${type}-bubble`)
    messageBubble.innerHTML = renderMarkdown(message)
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
}

const addSentMessage = message => {
    addMessage(message, 'my-message')
}

const addReceivedMessage = message => {
    addMessage(message, 'response')
}

window.addEventListener('load', () => {
    setupAPIKeyInput()

    let messages = [
        {
            "role": "system",
            "content": "Response format is ALWAYS markdown, especially for code."
        }
    ]

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()

        const input = document.querySelector('#prompt').value
        document.querySelector('#prompt').value = ''

        addSentMessage(input)
        // element.innerHTML = '<br>Loading...'

        messages.push({
            'role': 'user',
            'content': input
        })

        const apiKey = localStorage.getItem('api-key')

        const response = chatCompletion(apiKey, {
            messages
        })

        response.then(message => {
            // element.innerText = '' // remove "Loading..."

            messages.push(message)

            addReceivedMessage(message.content)
        })
    })
})