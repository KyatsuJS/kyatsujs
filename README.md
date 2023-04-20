# KyatsuJS

KyatsuJS is a wrapper for the [Discord.js](https://discord.js.org) library. It is designed to be simple and easy to use.
It's built on a CommonJS module system.

Our objectives making this library are:
- Allow users to create bots with ease, without having to worry about the underlying library.
- Propose few additional features, likes logs, panels, etc.
- Give an ultra-flexible package for the users who want to go further and use some partials of the library.

## Installation

```bash
npm install kyatsujs@latest
```
It's important to use the latest version to avoid bugs and prevents misunderstandings with the Discord.js library.

## Usage

Per default, the library avoids you to pass some parameters to the Discord.js library.
It's the case for the intents, for example.
```js
const { KyaClient } = require('kyatsujs');

const bot = KyaClient.init("your token goes here");

void bot.login();
```

## Go further

[Documentation](Documentation/classes/Command.md) • [Guide](Guide/Getting-Started.md)