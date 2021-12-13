// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {FlixDocumentFormatter} from './formatter/formatter';




// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const formatter = new FlixDocumentFormatter();
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			'flix', formatter
		)
	);

	// vscode.languages.registerDocumentFormattingEditProvider('foo-lang', {
	// 	provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
	// 	  const firstLine = document.lineAt(0);
	// 	  if (firstLine.text !== '42') {
	// 		return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
	// 	  }
	// 	}
	//   });

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "flixformatter" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('flixformatter.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hi there  World from FlixFormatter!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
