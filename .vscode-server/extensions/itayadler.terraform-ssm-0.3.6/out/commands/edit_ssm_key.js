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
const aws_api_1 = require("../api/aws_api");
function createEditSSMKeyCmd(context) {
    return vscode.commands.registerCommand('extension.editSSMKey', (ssmKeyPath) => __awaiter(this, void 0, void 0, function* () {
        const AWSProfile = context.globalState.get("AWSProfile");
        const placeholder = `Current AWSProfile is \`${AWSProfile}\`. Continue?`;
        const continueInCurrentProfile = yield vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: placeholder });
        if (continueInCurrentProfile === 'No') {
            return;
        }
        vscode.window.showInformationMessage(`AWSProfile: ${AWSProfile}; Loading SSM key: ${ssmKeyPath}`);
        let Parameter = null, parameterValue = null, doesKeyExist = true;
        try {
            const result = yield aws_api_1.getSSMParameter(AWSProfile, { Name: ssmKeyPath, WithDecryption: true });
            Parameter = result.Parameter;
            parameterValue = Parameter.Value;
        }
        catch (ex) {
            if (ex.code === "ParameterNotFound") {
                parameterValue = "";
                doesKeyExist = false;
            }
            else {
                vscode.window.showErrorMessage(`Failed to get SSM Parameter in path ${ssmKeyPath}. Make sure you've selected the correct AWSProfile.`);
                return;
            }
        }
        const editParamPlaceholder = `Enter a value for SSM path ${ssmKeyPath}`;
        if (doesKeyExist) {
            const newValue = yield vscode.window.showInputBox({ value: parameterValue, placeHolder: editParamPlaceholder });
            editKey(parameterValue, newValue, AWSProfile, ssmKeyPath, Parameter.Type);
        }
        else {
            const placeholder = `Choose an SSM key type for the key path: ${ssmKeyPath}`;
            const userPickedSSMKeyType = yield vscode.window.showQuickPick(['SecureString', 'String', 'StringList'], { placeHolder: placeholder });
            const newValue = yield vscode.window.showInputBox({ value: parameterValue, placeHolder: editParamPlaceholder });
            editKey(parameterValue, newValue, AWSProfile, ssmKeyPath, userPickedSSMKeyType);
        }
    }));
}
exports.default = createEditSSMKeyCmd;
function editKey(oldValue, newValue, AWSProfile, ssmKeyPath, ssmKeyType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newValue && newValue !== oldValue) {
            const confirmPlaceholder = `Are you sure you want to change \`${oldValue}\` to \`${newValue}\`?`;
            const confirmResult = yield vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: confirmPlaceholder });
            if (confirmResult === "Yes") {
                yield aws_api_1.putSSMParameter(AWSProfile, {
                    Name: ssmKeyPath,
                    Overwrite: true,
                    Value: newValue,
                    Type: ssmKeyType
                });
                vscode.window.showInformationMessage(`Saved SSM key: ${ssmKeyPath} successfully`);
            }
        }
    });
}
//# sourceMappingURL=edit_ssm_key.js.map