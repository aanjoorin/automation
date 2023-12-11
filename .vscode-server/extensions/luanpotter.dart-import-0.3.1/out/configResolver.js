"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigResolver = void 0;
const vscode = require("vscode");
class ConfigResolver {
    constructor() {
        const config = vscode.workspace.getConfiguration('dartImport');
        this._showInfoMessages = !!config.get('showInfoMessages');
        this._showErrorMessages = !!config.get('showErrorMessages');
        this._excludeGeneratedFiles = config.get('excludeGeneratedFiles') || [];
        this._fixOnSave = !!config.get('fixOnSave');
    }
    get showErrorMessages() {
        return this._showErrorMessages;
    }
    get showInfoMessages() {
        return this._showInfoMessages;
    }
    get excludeGeneratedFiles() {
        return this._excludeGeneratedFiles;
    }
    get fixOnSave() {
        return this._fixOnSave;
    }
}
exports.ConfigResolver = ConfigResolver;
//# sourceMappingURL=configResolver.js.map