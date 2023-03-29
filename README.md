# Web UI for ChatGPT

https://assistant.bloat.app

Ask questions from Open AI’s ChatGPT `gpt-3.5-turbo` and `gpt-4` engines (GPT-4 requires early access).

See [`CHANGELOG.md`](CHANGELOG.md) for what’s new.

## 🤔 Why?

### Compared to chat.openai.com
- GPT-3.5: Cheap token-based cost, instead of flat 20$/mo
- GPT-4: Unlimited messages
- No more logouts - OpenAI API key is stored in `localStorage`
- Can be added to the phone’s home screen or installed on your computer as a Chrome app
- OpenAI’s API policy says your prompts won’t be used for developing, unlike in the playground

### Compared to many other ChatGPT wrappers
- No backend server – requests go directly from the browser to OpenAI
- [Very polished UI](https://github.com/felixbade/chatgpt-web-ui/issues?q=label%3AUI+is%3Aclosed), especially for mobile.
- PWA support

## 🚚 In the future
- Customize the assistant’s behind-the-scenes brief
- Search old chats with GPT embeddings (meaning your search words don’t need to be an exact match)
- Speak your messages using the Whisper API

## 👀 Hidden features
- You can open the assistant with an initial prompt if you want to make integrations into other apps. Example: [https://assistant.bloat.app/#q=hello%20there](https://assistant.bloat.app/#q=hello%20there).
- You can change the model with ctrl+M.

## 💙 Contributing
The best way to contribute is by adding feature requests and bug reports to the GitHub [issues](https://github.com/felixbade/chatgpt-web-ui/issues) – you don’t need to be a programmer for that. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.
