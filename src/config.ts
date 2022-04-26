import * as vscode from "vscode";

type Config = {
  languages: Array<string>;
  contentDir: string;
  isManagedByFilename: boolean;
};

interface GetConfig {
  (key: undefined): "";
  <K extends keyof Config>(key: K): Config[K];
}

export const getConfig: GetConfig = <K extends keyof Config>(key?: K) => {
  const config = vscode.workspace.getConfiguration(
    "vscode-toggle-multilingual-content"
  );
  return key ? config[key] : config;
};
