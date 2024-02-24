import assert from 'assert';
import * as vscode from 'vscode';
import * as myExtension from '../extension';
import { firstSuite, secondSuite, emptySuite } from './constants';


const suites = [firstSuite, secondSuite, emptySuite];

suite('Extension Test Suite', () => {

	vscode.window.showInformationMessage('Start all tests.');

	suites.forEach((suite) => {
		test(`${suite.name} test`, async () => {
			const { wrongfile, correctFile, libs } = suite;
			// Default imports (import x from 'y')
			const regexDefaultImports = /import\s+(\w+)\s+from\s+['"](.+)['"]/g;

			// Imports in destructuring (import { x, y } from 'z')
			const regexDestructuring = /import\s+{(.+)}\s+from\s+['"](.+)['"]/g;

			let newText = wrongfile;

			newText = myExtension.newTextFormatter(newText, regexDefaultImports, false, libs);
			newText = myExtension.newTextFormatter(newText, regexDestructuring, true, libs);

			assert.equal(newText, correctFile);
		});
	});


});
