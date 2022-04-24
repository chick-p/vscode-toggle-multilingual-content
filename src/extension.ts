import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { getConfig } from "./config";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-quick-toggle-multilingual-content" is now active!');

  const buildLanguageFileNames = (fileName: string) => {
    const contentDir = getConfig("contentDir");
    const languages = getConfig("languages");
    const isManagedByFilename = getConfig("isManagedByFilename");

    // example: foo.en.md
    if (isManagedByFilename) {
      const extname = path.extname(fileName);
      const regexp = new RegExp(`.(${languages.join("|")})(${extname})`);
      return languages.map((language) =>
        fileName.replace(regexp, `.${language}$2`)
      );
    }
    // example: content/en/foo.md
    const regexp = new RegExp(
      `(${contentDir}${path.sep})(${languages.join("|")})`
    );
    return languages.map((language) =>
      fileName.replace(regexp, `$1${language}`)
    );
  };

  const disposable = vscode.commands.registerCommand(
    "com.github.chick-p.vscode-quick-toggle-multilingual-content.toggle",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const openedFileName = editor.document.fileName;
      const languageFileNames = [
        ...new Set(buildLanguageFileNames(openedFileName)),
      ];
      const existingLanguageFileNames = languageFileNames.filter((fileName) =>
        fs.existsSync(fileName)
      );
      const selectedFileName = await vscode.window.showQuickPick(
        existingLanguageFileNames,
        {
          placeHolder: "Please select a file.",
        }
      );
      if (selectedFileName) {
        const document = await vscode.workspace.openTextDocument(
          selectedFileName
        );
        vscode.window.showTextDocument(document, -1);
      }
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
