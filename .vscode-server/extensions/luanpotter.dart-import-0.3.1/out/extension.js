'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const path = require("path");
const main_1 = require("./main");
const configResolver_1 = require("./configResolver");
let configResolver = new configResolver_1.ConfigResolver();
const showErrorMessage = (message) => {
    if (configResolver.showErrorMessages) {
        vscode.window.showErrorMessage(message);
    }
};
const showInfoMessage = (message) => {
    if (configResolver.showInfoMessages) {
        vscode.window.showInformationMessage(message);
    }
};
/**
 * Returns the set of `pubspec.yaml` files that sit above `activeFileUri` in its
 * directory ancestry.
 */
const findPubspec = (activeFileUri) => __awaiter(void 0, void 0, void 0, function* () {
    const allPubspecUris = yield vscode.workspace.findFiles('**/pubspec.yaml');
    return allPubspecUris.filter((pubspecUri) => {
        const packageRootUri = pubspecUri.with({
            path: path.dirname(pubspecUri.path),
        }) + '/';
        // Containment check
        return activeFileUri.toString().startsWith(packageRootUri.toString());
    });
});
const fetchPackageInfoFor = (activeDocumentUri) => __awaiter(void 0, void 0, void 0, function* () {
    const pubspecUris = yield findPubspec(activeDocumentUri);
    if (pubspecUris.length !== 1) {
        showErrorMessage(`Expected to find a single pubspec.yaml file above ${activeDocumentUri}, ${pubspecUris.length} found.`);
        return null;
    }
    const pubspec = yield vscode.workspace.openTextDocument(pubspecUris[0]);
    const projectRoot = path.dirname(pubspec.fileName);
    const possibleNameLines = pubspec.getText().split('\n').filter((line) => line.match(/^name:/));
    if (possibleNameLines.length !== 1) {
        showErrorMessage(`Expected to find a single line starting with 'name:' on pubspec.yaml file, ${possibleNameLines.length} found.`);
        return null;
    }
    const nameLine = possibleNameLines[0];
    const packageNameMatch = /^name:\s*(.*)$/mg.exec(nameLine);
    if (!packageNameMatch) {
        showErrorMessage(`Expected line 'name:' on pubspec.yaml to match regex, but it didn't (line: ${nameLine}).`);
        return null;
    }
    return {
        projectRoot: projectRoot,
        projectName: packageNameMatch[1].trim(),
    };
});
const runFixImportTask = (rawEditor) => __awaiter(void 0, void 0, void 0, function* () {
    const packageInfo = yield fetchPackageInfoFor(rawEditor.document.uri);
    if (!packageInfo) {
        showErrorMessage('Failed to initialize extension. Is this a valid Dart/Flutter project?');
        return;
    }
    const editor = new VSCodeEditorAccess(rawEditor);
    try {
        const count = yield main_1.fixImports(editor, packageInfo, path.sep);
        vscode.commands.executeCommand('editor.action.organizeImports');
        showInfoMessage((count === 0 ? 'No lines changed.' : `${count} imports fixed.`) +
            ' All imports sorted.');
    }
    catch (ex) {
        if (ex instanceof Error) {
            showErrorMessage(ex.message);
        }
        else {
            throw ex;
        }
    }
});
class VSCodeEditorAccess {
    constructor(editor) {
        this.editor = editor;
    }
    getFileName() {
        return this.editor.document.fileName;
    }
    getLineAt(idx) {
        return this.editor.document.lineAt(idx).text;
    }
    getLineCount() {
        return this.editor.document.lineCount;
    }
    replaceLineAt(idx, newLine) {
        return this.editor.edit((builder) => {
            const line = this.getLineAt(idx);
            const start = new vscode.Position(idx, 0);
            const end = new vscode.Position(idx, line.length);
            builder.replace(new vscode.Range(start, end), newLine);
        });
    }
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const configChanges = vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('dartImport')) {
                configResolver = new configResolver_1.ConfigResolver();
            }
        });
        const documentSave = vscode.workspace.onDidSaveTextDocument((e) => __awaiter(this, void 0, void 0, function* () {
            if (!configResolver.fixOnSave) {
                return;
            }
            const rawEditor = yield vscode.window.showTextDocument(e);
            runFixImportTask(rawEditor);
        }));
        const cmd = vscode.commands.registerCommand('dart-import.fix', () => __awaiter(this, void 0, void 0, function* () {
            const rawEditor = vscode.window.activeTextEditor;
            if (!rawEditor) {
                return; // No open text editor
            }
            runFixImportTask(rawEditor);
        }));
        const cmdAll = vscode.commands.registerCommand('dart-import.fix-all', () => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const excludeExt = configResolver.excludeGeneratedFiles;
            const excludeFiles = excludeExt ? `lib/**/*.{${excludeExt}}` : null;
            const filesUris = yield vscode.workspace.findFiles('lib/**/**.dart', excludeFiles);
            if (filesUris.length === 0) {
                showInfoMessage('No dart files were found');
                return;
            }
            const packageInfo = yield fetchPackageInfoFor(filesUris[0]);
            if (!packageInfo) {
                showErrorMessage('Failed to initialize extension. Is this a valid Dart/Flutter project?');
                return;
            }
            let totalCount = 0;
            try {
                for (var filesUris_1 = __asyncValues(filesUris), filesUris_1_1; filesUris_1_1 = yield filesUris_1.next(), !filesUris_1_1.done;) {
                    const uri = filesUris_1_1.value;
                    const document = yield vscode.workspace.openTextDocument(uri);
                    const rawEditor = yield vscode.window.showTextDocument(document);
                    const editor = new VSCodeEditorAccess(rawEditor);
                    try {
                        const count = yield main_1.fixImports(editor, packageInfo, path.sep);
                        vscode.commands.executeCommand('editor.action.organizeImports');
                        totalCount += count;
                    }
                    catch (ex) {
                        if (ex instanceof Error) {
                            showErrorMessage(ex.message);
                        }
                        else {
                            throw ex;
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (filesUris_1_1 && !filesUris_1_1.done && (_a = filesUris_1.return)) yield _a.call(filesUris_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            showInfoMessage(totalCount === 0
                ? 'Done. No lines changed'
                : `All done. ${totalCount} lines changed.`);
        }));
        context.subscriptions.push(cmd, cmdAll, configChanges, documentSave);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map