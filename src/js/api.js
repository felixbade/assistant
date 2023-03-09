export const chatCompletion = (apiKey, data) => {
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    data.model = 'gpt-3.5-turbo'

    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error)
        })
}

export const chatCompletionStream = (apiKey, data, callback) => {
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    data.model = 'gpt-3.5-turbo'
    data.stream = true

    return fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            const reader = response.body.getReader()

            let received = ''

            const inputHandler = ({ done, value }) => {
                if (done) {
                    return
                }
                received += String.fromCharCode.apply(null, value)

                while (received.indexOf('\n') !== -1) {
                    const index = received.indexOf('\n')
                    const line = received.substring(0, index)
                    received = received.substring(index+1)

                    const content = line.replace('data: ', '')
                    if (!content) continue
                    if (content === '[DONE]') return
                    let json
                    try {
                        json = JSON.parse(content)
                    } catch (e) {
                        // multi-line json?
                        received = line + received
                        continue
                    }

                    callback(json)
                }

                reader.read().then(inputHandler)
            }

            reader.read().then(inputHandler)
            .catch(error => {
                console.error('Error reading stream:', error)
                reader.cancel()
            })
        })
        .catch(error => {
            console.error('Error:', error)
        })
}