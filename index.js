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
        const promptText = `Q: ${input}\nA:`
        const element = document.querySelector('#output')
        element.innerText = 'Loading...'

        const apiKey = localStorage.getItem('api-key')
        const response = completion(apiKey, {
            prompt: promptText,
            max_tokens: 200,
            stop: '\n'
        })
        response.then(completionText => {
            element.innerText = completionText
        })
    })
})