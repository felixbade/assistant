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

window.addEventListener('load', () => {
    setupAPIKeyInput()

    document.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()

        const input = document.querySelector('#prompt').value

        const separator = '"""""'
        const in_title = 'User'
        const out_title = 'Assistant'
        const brief = 'Assistant is a large language model designed to give the most helpful possible answer to the user.'
        const promptText = `${brief}\n\n${in_title}:\n${separator}\n${input}\n${separator}\n\n${out_title}:\n${separator}`

        const element = document.querySelector('#output')
        element.innerHTML = '<br>Loading...'

        const apiKey = localStorage.getItem('api-key')
        const response = completion(apiKey, {
            prompt: promptText,
            max_tokens: 200,
            stop: separator
        })
        response.then(completionText => {
            element.innerText = '' // remove "Loading..."

            completionText = completionText.trim()

            const messageBubble = document.createElement('div')
            messageBubble.classList.add('output-bubble')
            messageBubble.innerText = completionText
            element.appendChild(messageBubble)
        })
    })
})