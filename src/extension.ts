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

	const replacedText = text.replace(regex, (match, identifier, path) => {
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

	// TODO: MOVE TO CONFIGURATION
	const sortImport = ["error", {
		ignoreCas: false,
		ignoreDeclarationSort: false,
		ignoreMemberSort: false,
		memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
		allowSeparatedGroups: false
	}];

	const sortedImports = sortImports(replacedText, sortImport);

	return sortedImports;
}


function sortImports(imports: string, config: any) {
	const { memberSyntaxSortOrder, ignoreCas, ignoreDeclarationSort, ignoreMemberSort, allowSeparatedGroups } = config;

	// Função auxiliar para comparar duas importações
	function compareImports(a: string, b: string) {
		if (ignoreCas) {
			a = a.toLowerCase();
			b = b.toLowerCase();
		}
		if (ignoreDeclarationSort) {
			return 0; // Mantém a ordem original
		}
		if (ignoreMemberSort) {
			return 0; // Mantém a ordem original
		}
		// Se estiver ordenando membros, verifique o índice de cada membro na matriz memberSyntaxSortOrder
		if (memberSyntaxSortOrder && memberSyntaxSortOrder.length > 0) {
			const indexA = memberSyntaxSortOrder.indexOf(a);
			const indexB = memberSyntaxSortOrder.indexOf(b);
			// Ordena de acordo com a ordem especificada em memberSyntaxSortOrder
			return indexA - indexB;
		}
		// Ordem padrão: ordenação alfabética
		return a.localeCompare(b);
	}

	// Dividir a string de imports em linhas e remover qualquer espaço em branco extra
	const importLines = imports.split('\n').map(line => line.trim());

	// Filtrar qualquer linha em branco
	const filteredLines = importLines.filter(line => line.length > 0);

	// Separar os imports agrupados por linha
	const groupedImports = allowSeparatedGroups ? filteredLines.reduce((acc: string[], line) => {
		const lastLine = acc.length > 0 ? acc[acc.length - 1] : '';
		if (lastLine.endsWith(',') || lastLine.endsWith('{')) {
			acc[acc.length - 1] = `${lastLine} ${line}`;
		} else {
			acc.push(line);
		}
		return acc;
	}, []) : filteredLines;

	// Dividir as importações em externas e relativas
	const externalImports = [] as string[];
	const relativeImports = [] as string[];
	const typeImports = [] as string[];

	groupedImports.forEach(importLine => {
		if (importLine.includes('from ') && importLine.includes("'") && importLine.includes("'")) {
			const fromIndex = importLine.indexOf('from ') + 'from '.length;
			const libraryPath = importLine.substring(fromIndex, importLine.indexOf("'", fromIndex + 1) + 1);
			if (importLine.includes('type')) {
				typeImports.push(importLine);
			} else if (libraryPath.startsWith("'..")) {
				relativeImports.push(importLine);
			} else if (libraryPath.startsWith("'.")) {

				relativeImports.push(importLine);
			} else {
				externalImports.push(importLine);
			}
		} else {
			externalImports.push(importLine);
		}
	});

	// Ordenar importações externas e relativas
	const sortedExternalImports = externalImports.sort((a, b) => compareImports(a, b));
	const sortedRelativeImports = relativeImports.sort((a, b) => {
		const levelA = (a.match(/\.\./g) ?? []).length;
		const levelB = (b.match(/\.\./g) ?? []).length;
		return levelA - levelB;
	});

	// Reconstruir a string de imports
	const sortedImports = [...sortedExternalImports, ...sortedRelativeImports, ...typeImports];
	const sortedImportsString = sortedImports.join('\n');

	return sortedImportsString;
}


export function deactivate() { }