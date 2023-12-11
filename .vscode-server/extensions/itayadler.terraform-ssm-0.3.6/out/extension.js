'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const ssm_key_codelens_provider_1 = require("./ui/ssm_key_codelens_provider");
const edit_ssm_key_1 = require("./commands/edit_ssm_key");
const switch_aws_profile_1 = require("./commands/switch_aws_profile");
const execute_terraform_init_1 = require("./commands/execute_terraform_init");
const documentSelector = [
    { language: "terraform", scheme: "file" },
    { language: "terraform", scheme: "untitled" }
];
function activate(context) {
    const editSSMKeyCmd = edit_ssm_key_1.default(context);
    const switchAWSProfileCmd = switch_aws_profile_1.default(context);
    const executeTerraformInitCmd = execute_terraform_init_1.default(context);
    const ssmCodeLensProvider = vscode.languages.registerCodeLensProvider(documentSelector, new ssm_key_codelens_provider_1.default(context));
    context.subscriptions.push(ssmCodeLensProvider, switchAWSProfileCmd, editSSMKeyCmd, executeTerraformInitCmd);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map