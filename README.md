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
// A list of languages
"vscode-toggle-multilingual-content.languages": [
  "ja",
  "en",
  "zh",
  "zh-tw"
],

// The directory of content files.
"vscode-toggle-multilingual-content.contentDir": "content",

// Manage content files by filename as `about.fr.md
"vscode-toggle-multilingual-content.isManagedByFilename": false
```

## Installation

This extension is not available on VSCode Marketplace.  
Install locally:

```shell
npx vsce package
code --install-extension vscode-toggle-multilingual-content-0.0.1.vsix
```
