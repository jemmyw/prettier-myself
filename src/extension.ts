// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as child_process from "child_process";
import * as fs from "fs";

function handleChangeEditor(editor: vscode.TextEditor | undefined) {
  if (!editor) return;

  const doc = editor.document;
  if (doc.languageId === "javascript") {
    const configPath: string | undefined = vscode.workspace
      .getConfiguration("prettier-myself")
      .get("config-path");
    if (!configPath) return;
    if (!fs.existsSync(configPath)) return;

    const execPath =
      vscode.workspace
        .getConfiguration("prettier-myself")
        .get("prettier-path") || "prettier";

    const newText = child_process
      .execSync(`${execPath} --config ${configPath} ${doc.uri.fsPath}`)
      .toString();

    editor.edit((builder) => {
      builder.delete(new vscode.Range(0, 0, doc.lineCount, 0));
      builder.insert(new vscode.Position(0, 0), newText);
    });
  }
}

function handleSaveDocument(doc: vscode.TextDocument) {
  const editor = vscode.window.visibleTextEditors.find(
    (e) => e.document === doc
  );
  if (!editor) return;
  handleChangeEditor(editor);
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "prettier-myself" is now active!'
  );

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(handleChangeEditor)
  );
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(handleSaveDocument)
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
