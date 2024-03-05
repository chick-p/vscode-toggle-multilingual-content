import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { getConfig } from "./config";
import { QuickPickItem } from "vscode";

type Candidate = {
  path: string;
  lang: string;
};

type Uriable = {
  uri: vscode.Uri;
};

export function activate(context: vscode.ExtensionContext) {
  console.log('"vscode-toggle-multilingual-content" is now active!');

  const getCandidatesFromCurrentFileName = (
    fileName: string,
    contentPatterns: Array<string>,
    languages: Array<string>,
  ): Array<Candidate> => {
    for (const contentPattern of contentPatterns) {
      // content/ja/, content/en/
      const candidatePrefixes = languages.map((language) =>
        contentPattern.replace("<lang>", language),
      );

      // content/ja/
      const matchedPrefix = candidatePrefixes.find((prefix) =>
        fileName.startsWith(prefix),
      );

      if (matchedPrefix) {
        // foo.md
        const restPath = fileName.replace(matchedPrefix, "");
        const candidates = languages.map((language) => {
          return {
            lang: language,
            path: contentPattern.replace("<lang>", language) + restPath,
          };
        });
        return candidates;
      }
    }
    return [];
  };

  const filterExistingFile = (
    workspacePath: string,
    candidates: Array<Candidate>,
  ): Array<Candidate> =>
    candidates.filter((candidate) =>
      fs.existsSync(path.join(workspacePath, candidate.path)),
    );

  const getWorkspacePath = (uri: vscode.Uri): string => {
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    return folder?.uri.fsPath.replace(/\\/g, "/") || "";
  };

  const getRelativeFilePath = (uri: vscode.Uri): string => {
    const workspacePath = getWorkspacePath(uri);
    const currentFileName = uri.fsPath;
    return currentFileName.replace(`${workspacePath}/`, "");
  };

  const disposable = vscode.commands.registerCommand(
    "com.github.chick-p.vscode-toggle-multilingual-content.toggle",
    async () => {
      const { uri } = vscode.window.tabGroups.activeTabGroup.activeTab
        ?.input as Uriable;
      if (!uri) {
        return;
      }

      const workspacePath = getWorkspacePath(uri);
      const relativeFileName = getRelativeFilePath(uri);

      const contentPatterns = getConfig("contentPatterns");
      const languages = getConfig("languages");

      const candidates = getCandidatesFromCurrentFileName(
        relativeFileName,
        contentPatterns,
        languages,
      );

      const existingCandidates = filterExistingFile(workspacePath, candidates);

      const quickPickItems = existingCandidates.map((candidate) => {
        return {
          label: `${candidate.lang}${
            candidate.path === relativeFileName ? ` *` : ""
          }`,
          detail: candidate.path,
        };
      });

      if (quickPickItems.length === 0) {
        vscode.window.showInformationMessage("Not found file.");
        return;
      }
      const pickedItem = await vscode.window.showQuickPick(quickPickItems, {
        placeHolder: "Please select a file.",
      });
      if (pickedItem && pickedItem.detail) {
        const filePath = path.join(workspacePath, pickedItem.detail);
        vscode.commands.executeCommand(
          "vscode.open",
          vscode.Uri.file(filePath),
        );
      }
    },
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
