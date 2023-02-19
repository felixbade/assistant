const endpoint = 'https://api.openai.com/v1/engines/text-davinci-003/completions'

const completion = (apiKey, data) => {
    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => data.choices[0].text)
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
        });
      });
}

const addSentMessage = message => {
    addMessage(message, 'my-message')
}

const addReceivedMessage = message => {
    addMessage(message, 'response')
}

window.addEventListener('load', () => {
    setupAPIKeyInput()

    const separator = '"""""'
    const in_title = 'User'
    const out_title = 'Assistant'
    const brief = 'Assistant is a large language model designed to give the most helpful possible answer to the user. Response format is ALWAYS markdown, especially for code.'

    let promptText = brief

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()

        const input = document.querySelector('#prompt').value
        document.querySelector('#prompt').value = ''

        addSentMessage(input)
        // element.innerHTML = '<br>Loading...'

        promptText = `${promptText}\n\n${in_title}:\n${separator}\n${input}\n${separator}\n\n${out_title}:\n${separator}`

        const apiKey = localStorage.getItem('api-key')
        const response = completion(apiKey, {
            prompt: promptText,
            max_tokens: 200,
            stop: separator
        })
        response.then(completionText => {
            // element.innerText = '' // remove "Loading..."

            completionText = completionText.trim()
            promptText = `${promptText}\n${completionText}\n${separator}`

            addReceivedMessage(completionText)
        })
    })
})