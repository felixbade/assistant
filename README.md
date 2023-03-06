# Web UI for ChatGPT

https://assistant.bloat.app

Ask questions from Open AI’s ChatGPT `gpt-3.5-turbo` engine

## 🤔 Why?

### Compared to chat.openai.com
- Token-based cost, instead of flat 20$/mo
- No more logouts - OpenAI API key is stored in `localStorage`
- Can be added to the phone’s home screen or installed on your computer as a Chrome app
- OpenAI’s API policy says your prompts won’t be used for developing, unlike in the playground

### Compared to many other ChatGPT wrappers
- Requests go directly from the browser to OpenAI – no backend server
- PWA support
- Different UI design

## 🚚 In the future
- Customize the assistant’s behind-the-scenes brief
- Search old chats with GPT embeddings (meaning your search words don’t need to be an exact match)
- Speak your messages using the Whisper API

## 👀 Hidden features
You can open the assistant with an initial prompt if you want to make integrations into other apps. Example: [https://assistant.bloat.app/#q=hello%20there](https://assistant.bloat.app/#q=hello%20there)

## 💙 Contributing
The best way to contribute is by adding feature requests and bug reports to the GitHub [issues](https://github.com/felixbade/chatgpt-web-ui/issues) – you don’t need to be a programmer for that. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.