const apiKey = 'sk-CHANGEME'

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

window.addEventListener('load', () => {
    const input = `Q: ${prompt('Question to AI:')}\nA:`
    document.body.innerText = input

    const response = completion(apiKey, {
        prompt: input,
        max_tokens: 200,
        stop: '\n'
    })
    response.then(text => {
        document.body.innerText = input + text
    })
})