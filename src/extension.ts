import * as vscode from 'vscode';

export type LibsConfiguration = {
	lib: string;
	endPath: string;
	includeIndexFile: boolean;
	customFilesEndPaths?: {
		[path: string]: {
			forceEndPath: string;
		};
	}
};

const jsFiles = ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs', 'json', 'json5', 'jsonc', 'jsonc5', 'jsonc'];

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('fix-imports.fix', () => {

		if (vscode.window.activeTextEditor) {
			const editor = vscode.window.activeTextEditor;
			const document = editor.document;
			let newText = document.getText();

			// Default imports (import x from 'y')
			const regexDefaultImports = /import\s+(\w+)\s+from\s+['"](.+)['"]/g;

			// Imports in destructuring (import { x, y } from 'z')
			const regexDestructuring = /import\s+{(.+)}\s+from\s+['"](.+)['"]/g;

			newText = newTextFormatter(newText, regexDefaultImports);
			newText = newTextFormatter(newText, regexDestructuring, true);

			editor.edit(editBuilder => {
				const start = new vscode.Position(0, 0);
				const end = new vscode.Position(document.lineCount + 1, 0);
				editBuilder.replace(new vscode.Range(start, end), newText);
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function newTextFormatter(text: string, regex: RegExp, keepDestructuring: boolean = false, libsForTest: LibsConfiguration[] = []) {
	const configuration = vscode.workspace.getConfiguration('fix-imports');
	const libs = libsForTest.length > 0 ? libsForTest : configuration.get<LibsConfiguration[]>('libs', []);

	let replacedText = text.replace(regex, (match, identifier, path) => {
		const lib = libs.find(lib => path.includes(lib.lib));
		const customFilesEndPaths = lib?.customFilesEndPaths;
		let newPath = path;

		if (match.includes('type')) {
			return match;
		}

		if (path.startsWith('.')) {
			return match;
		}

		const pathIncludesLib = libs.some(lib => path.includes(lib.lib));

		if (!path.endsWith('index.js') && pathIncludesLib) {

			if (lib?.endPath && !path.includes(lib.endPath)) {
				newPath = newPath.concat(`/${lib.endPath}`);
			}

			if (lib?.includeIndexFile && !jsFiles.some(ext => path.endsWith(ext))) {
				newPath = newPath.concat('/index.js');
			}

			if (customFilesEndPaths) {
				Object.keys(customFilesEndPaths).forEach(customPath => {
					if (identifier === customPath) {
						newPath = lib.lib.concat(`/${customFilesEndPaths[customPath].forceEndPath}`);

						return `import ${identifier} from '${newPath}'`;
					}
				});
			}

			const destructuring = match.includes('{');

			if (destructuring) {
				const newIdentifier = identifier.split(',').map((i: string) => i.trim()).map((i: { includes: (arg0: string) => any; split: (arg0: string) => [any, any]; }) => {
					if (i.includes(' as ')) {
						const [original, alias] = i.split(' as ');
						return `${alias.trim()} as ${original.trim()}`;
					}
					return i;
				}).join(', ');
				if (keepDestructuring) {
					return `import { ${newIdentifier} } from '${newPath}'`;
				}
				return `import ${newIdentifier} from '${newPath}'`;
			}


			return `import ${identifier} from '${newPath}'`;
		}

		return match;
	});

	return replacedText
}

export function deactivate() { }