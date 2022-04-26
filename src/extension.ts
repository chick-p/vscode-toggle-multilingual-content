import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { getConfig } from "./config";
import { QuickPickItem } from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-quick-toggle-multilingual-content" is now active!');

  const buildLanguageFileNames = (
    fileName: string
  ): [string, Record<string, string>] => {
    const contentDir = getConfig("contentDir");
    const languages = getConfig("languages");
    const isManagedByFilename = getConfig("isManagedByFilename");

    // example: foo.en.md
    if (isManagedByFilename) {
      const extname = path.extname(fileName);
      const regexp = new RegExp(`.(${languages.join("|")})(${extname})`);
      const matcher = fileName.match(regexp);
      if (!matcher || matcher.length < 3) {
        return ["", {}];
      }
      const currentLanguage = matcher[1];
      const otherLanguageFiles = languages.reduce<Record<string, string>>(
        (prev, language) => {
          const otherFileName = fileName.replace(regexp, `.${language}$2`);
          return {
            ...prev,
            ...(fs.existsSync(otherFileName)
              ? {
                  [language]: otherFileName,
                }
              : {}),
          };
        },
        {}
      );
      return [currentLanguage, otherLanguageFiles];
    }
    // example: content/en/foo.md
    const regexp = new RegExp(
      `(${contentDir}${path.sep})(${languages.join("|")})`
    );
    const matcher = fileName.match(regexp);
    if (!matcher || matcher.length < 3) {
      return ["", {}];
    }
    const currentLanguage = matcher[2];
    const otherLanguageFiles = languages.reduce<Record<string, string>>(
      (prev, language) => {
        const otherFileName = fileName.replace(regexp, `$1${language}`);
        return {
          ...prev,
          ...(fs.existsSync(otherFileName)
            ? {
                [language]: otherFileName,
              }
            : {}),
        };
      },
      {}
    );
    return [currentLanguage, otherLanguageFiles];
  };

  const filterExistedFile = (fileNames: Record<string, string>) =>
    Object.fromEntries(
      Object.entries(fileNames).filter(([_language, fileName]) =>
        fs.existsSync(fileName)
      )
    );

  const disposable = vscode.commands.registerCommand(
    "com.github.chick-p.vscode-quick-toggle-multilingual-content.toggle",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }
      const openedFileName = editor.document.fileName;
      const [currentLanguage, languageFileNames] =
        buildLanguageFileNames(openedFileName);
      const existedLanguageFileNames = filterExistedFile(languageFileNames);
      const currentFileMark = "*";
      const quickPickItems = Object.entries(existedLanguageFileNames).reduce<
        Array<QuickPickItem>
      >((prev, [language, filename]) => {
        return [
          ...prev,
          {
            label: `${language}${
              language === currentLanguage ? ` ${currentFileMark}` : ""
            }`,
            detail: filename,
          },
        ];
      }, []);
      if (quickPickItems.length === 0) {
        vscode.window.showInformationMessage("Not found other file.");
        return;
      }
      const pickedItem = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: "Please select a file.",
      });
      if (pickedItem && pickedItem.detail) {
        const document = await vscode.workspace.openTextDocument(
          pickedItem.detail
        );
        vscode.window.showTextDocument(document, -1);
      }
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
