<img src="https://i.imgur.com/4ConjzG.png">

# 🦎 Geckotail - simple API wrapper for Geckoterminal API

Geckotail is simple, lightweight (only one dependency!) package for interacting with [GeckoTerminal](https://geckoterminal.com/) API. 

*The project is not yet finished! Some of the methods are still in development. Stay tuned!*

- [View on Github](https://github.com/xooolod/Geckotail)
- [View on NPM](https://www.npmjs.com/package/geckotail)
- [Open a PR](https://github.com/xooolod/Geckotail/pulls)

# Installation

`npm install geckotail`

# Usage

```js
const Geckotail = require("geckotail");
const geckoClient = new Geckotail();

async function tonDexList () {
    const tonDexes = await geckoClient.getDexes("ton"); 
    console.log(tonDexes); 
}

tonDexList(); // List of DEXes on TON network
```

# Docs

- [View docs (Under construction 👷)](https://github.com/xooolod/Geckotail/wiki/Docs)