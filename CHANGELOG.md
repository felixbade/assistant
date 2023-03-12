# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2023-03-12

### Added

- Streaming responses ([#45](https://github.com/felixbade/chatgpt-web-ui/issues/45)).

### Changed

- Scrolling is now instant after new data in assistant’s message. User’s messages still use smooth scrolling.

### Fixed

- Ordering of responses when multiple questions are sent before a response is received ([#47](https://github.com/felixbade/chatgpt-web-ui/issues/47)).

## [1.0.4] - 2023-03-09

### Added

- Link to API usage page ([#8](https://github.com/felixbade/chatgpt-web-ui/issues/8)).

## [1.0.3] - 2023-03-09

### Added

- Background for code blocks and inline code to increase contrast.
- Spacing between paragraphs.

### Fixed

- Code blocks with long lines on narrow screens causing horizontal scroll.

## [1.0.2] - 2023-03-07

### Fixed

- Multi-line code block rendering ([#55](https://github.com/felixbade/chatgpt-web-ui/issues/55)).

## [1.0.1] - 2023-03-07

### Fixed

- PWA error due to incorrect cacheable files list ([#56](https://github.com/felixbade/chatgpt-web-ui/issues/56)).

## [1.0.0] - 2023-03-07

- See commits for all the stuff that was added.