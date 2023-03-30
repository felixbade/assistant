# Web UI for ChatGPT

https://assistant.bloat.app

Use OpenAI’s chat API as a human.

See [`CHANGELOG.md`](CHANGELOG.md) for what’s new.

## 🤔 Why API instead of ChatGPT Plus?
- `gpt-3.5-turbo`: Cheap token-based cost, instead of flat 20$/mo
- `gpt-4`: Unlimited requests (requires early access)
- No logouts – if OpenAI started revoking API keys weekly, a lot of big SaaS products would get very angry
- OpenAI’s API policy says your prompts won’t be used for developing, unlike in the playground

## 🔩 Features
- Very polished, mobile-friendly UI
- PWA support: can be added to the phone’s home screen or installed on your computer as a Chrome app
- Requests go directly from the browser to OpenAI – no backend server
- Settings and API key are stored in `localStorage`
- Unlimited conversation length by sending only x latest messages to the API (configurable)
- Markdown rendering
    - Bold, italic
    - Embedded links
    - Code keywords
    - Code blocks
    - Tables
    - Images
    - Horizontal lines
- Automatic dark/light theme
- Export the conversation as markdown
- Screenshot the whole conversation even if it doesn't fit the window
- Customize the assistant’s behind-the-scenes system message prompt
- Send follow-up messages even before the previous answer is complete (processed in parallel)
- Change the model with ctrl+M
- Open Assistant with an initial prompt if you want to make integrations into other apps. Example: [https://assistant.bloat.app/#q=hello%20there](https://assistant.bloat.app/#q=hello%20there)

## 🚚 In the future
- Search old chats with GPT embeddings (meaning your search words don’t need to be an exact match)
- Speak your messages using the Whisper API

## 💙 Contributing
The best way to contribute is by adding feature requests and bug reports to the GitHub [issues](https://github.com/felixbade/chatgpt-web-ui/issues) – you don’t need to be a programmer for that. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for details.
