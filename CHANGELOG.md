# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.9.0] – 2024-07-18
- Added GPT-4o mini support.

## [1.8.0] – 2024-05-14
- Added GPT-4o support.
- Changed GPT-4 Turbo from `gpt-4-1106-preview` to `gpt-4-turbo`.

## [1.7.0] – 2023-11-22
- Last selected model is now remembered ([#103](https://github.com/felixbade/assistant/issues/103)).

## [1.6.0] – 2023-11-07

- Added GPT-4 Turbo support.
- Updated GPT-3.5 Turbo version.

## [1.5.2] – 2023-04-22

### Fixed
- Long words no longer make the messages view wider than the window ([#81](https://github.com/felixbade/assistant/issues/81)).

## [1.5.1] – 2023-04-22

### Fixed
- Single linebreaks in user’s message are now rendered in message bubble like in compose box ([#92](https://github.com/felixbade/assistant/issues/92)).

## [1.5.0] – 2023-03-30

### Added

- Support for unlimited length conversations. Settings for number of last messages sent ([#70](https://github.com/felixbade/chatgpt-web-ui/issues/70)).
- Settings for initial system message ([#5](https://github.com/felixbade/chatgpt-web-ui/issues/5)).

### Fixed

- Style for &lt;hr&gt; element (markdown: `---`) ([#76](https://github.com/felixbade/chatgpt-web-ui/issues/76)).

## [1.4.2] – 2023-03-29

### Fixed

- Screenshot function background in dark mode ([#77](https://github.com/felixbade/chatgpt-web-ui/issues/77)).

## [1.4.1] – 2023-03-29

### Added

- Save conversation as markdown ([#78](https://github.com/felixbade/chatgpt-web-ui/issues/78)).

## [1.4.0] – 2023-03-20

### Added

- Intro view on page load if API key is not set ([#9](https://github.com/felixbade/chatgpt-web-ui/issues/9)).
- Settings page ([#6](https://github.com/felixbade/chatgpt-web-ui/issues/6)).
- Save conversation as a screenshot ([#17](https://github.com/felixbade/chatgpt-web-ui/issues/17)).

## [1.3.1] – 2023-03-19

### Fixed

- Compose box background blur is now full width ([#64](https://github.com/felixbade/chatgpt-web-ui/issues/64)).

## [1.3.0] – 2023-03-19

### Added

- Favicon ([#26](https://github.com/felixbade/chatgpt-web-ui/issues/26)).
- Proper styling for tables ([#65](https://github.com/felixbade/chatgpt-web-ui/issues/65), [#71](https://github.com/felixbade/chatgpt-web-ui/issues/71)).
- Model changing (GPT-3.5 / GPT-4) with ctrl+M.

### Changed

- Copy with click now copies code blocks, not whole messages ([#29](https://github.com/felixbade/chatgpt-web-ui/issues/29)).

## [1.2.0] – 2023-03-16

### Added

- Support for GPT-4 via dropdown. GPT-3.5 is also supported. ([#67](https://github.com/felixbade/chatgpt-web-ui/issues/67))


## [1.1.5] – 2023-03-12

### Fixed

- Scrolling to the bottom of the page on new message ([#61](https://github.com/felixbade/chatgpt-web-ui/issues/61)).

## [1.1.4] – 2023-03-12

### Changed

- Improved PWA caching with Workbox – all files come from cache by default, but update in the background ([#63](https://github.com/felixbade/chatgpt-web-ui/issues/63)).

### Fixed

- ”Start by getting an API key” no longer flashes on page refresh ([#63](https://github.com/felixbade/chatgpt-web-ui/issues/63)).

## [1.1.3] – 2023-03-12

### Fixed

- iOS Safari: text is no longer incorrectly zooming when the phone is in landscape orientation ([#59](https://github.com/felixbade/chatgpt-web-ui/issues/59)).

## [1.1.2] – 2023-03-12

### Fixed

- Images no longer expand outside the message bubble ([#62](https://github.com/felixbade/chatgpt-web-ui/issues/62)).

## [1.1.1] – 2023-03-12

### Fixed

- Layout with devices that have a notch ([#58](https://github.com/felixbade/chatgpt-web-ui/issues/58)).

## [1.1.0] – 2023-03-12

### Added

- Streaming responses ([#45](https://github.com/felixbade/chatgpt-web-ui/issues/45)).

### Changed

- Scrolling is now instant after new data in assistant’s message. User’s messages still use smooth scrolling.

### Fixed

- Ordering of responses when multiple questions are sent before a response is received ([#47](https://github.com/felixbade/chatgpt-web-ui/issues/47)).

## [1.0.4] – 2023-03-09

### Added

- Link to API usage page ([#8](https://github.com/felixbade/chatgpt-web-ui/issues/8)).

## [1.0.3] – 2023-03-09

### Added

- Background for code blocks and inline code to increase contrast.
- Spacing between paragraphs.

### Fixed

- Code blocks with long lines on narrow screens causing horizontal scroll.

## [1.0.2] – 2023-03-07

### Fixed

- Multi-line code block rendering ([#55](https://github.com/felixbade/chatgpt-web-ui/issues/55)).

## [1.0.1] – 2023-03-07

### Fixed

- PWA error due to incorrect cacheable files list ([#56](https://github.com/felixbade/chatgpt-web-ui/issues/56)).

## [1.0.0] – 2023-03-07

- See commits for all the stuff that was added.
