# vscode-toggle-multilingual-content

A VSCode extension that switch multilingual content files with shortcut key and command pallet.

## Features

Available commands:

```json
"commands": [
  {
    "command": "com.github.chick-p.vscode-toggle-multilingual-content.toggle",
    "title": "Toggle Multilingual Content File"
  }
],
"keybindings": [
  {
    "mac": "cmd+9",
    "key": "ctrl+9",
    "command": "com.github.chick-p.vscode-toggle-multilingual-content.toggle"
  }
]
```

## Extension Settings

Available settings:

```plaintext
// The language list
"vscode-toggle-multilingual-content.languages": [
  "ja",
  "en",
  "zh",
  "zh-tw"
],

// The directory list of content file
"vscode-toggle-multilingual-content.contentPatterns": [
  "content/<lang>/",
  "static/img-<lang>/"
]

```

## Installation

This extension is not available on VSCode Marketplace.  
Install locally:

The extension file can be downloaded from [Assets] in [Releases page](https://github.com/chick-p/vscode-toggle-multilingual-content/releases).  
Install the extension into your VSCode by following command.

```shell
code --install-extension vscode-toggle-multilingual-content-0.2.1.vsix
```

The following command packages the extension directory to generate vsix files.

```shell
pnpm install
pnpm dlx vsce package
```
