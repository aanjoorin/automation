"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path_1 = require("path");
const tf_state_api_1 = require("../api/tf_state_api");
function createTerraformInitCmd(context) {
    return vscode.commands.registerCommand('extension.executeTerraformInit', () => __awaiter(this, void 0, void 0, function* () {
        const AWSProfile = context.globalState.get("AWSProfile");
        const workingDirectory = path_1.dirname(vscode.window.activeTextEditor.document.fileName);
        vscode.window.showInformationMessage(`Running terraform init in current document directory: ${workingDirectory}`);
        const result = yield tf_state_api_1.executeTerraformInit(workingDirectory, AWSProfile);
        if (result) {
            vscode.window.showErrorMessage("Failed to run `terraform init`. Either an authorization issue or failed to load one of the providers");
            return;
        }
        vscode.window.showInformationMessage(`Completed \`terraform init\` execution successfully: ${workingDirectory}`);
    }));
}
exports.default = createTerraformInitCmd;
//# sourceMappingURL=execute_terraform_init.js.map