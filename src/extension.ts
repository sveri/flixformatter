import * as vscode from 'vscode';

import {FlixDocumentFormatter} from './formatter/flix.document.formatter';



export function activate(context: vscode.ExtensionContext) {
	const formatter = new FlixDocumentFormatter();
	context.subscriptions.push(
		vscode.languages.registerDocumentFormattingEditProvider(
			'flix', formatter
		)
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
