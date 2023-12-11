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
const tf_ssm_file_parser_1 = require("./tf_ssm_file_parser");
const tf_local_resource_cache_1 = require("./tf_local_resource_cache");
const tf_state_api_1 = require("../api/tf_state_api");
class SSMKeyCodeLens extends vscode.CodeLens {
    constructor(ssmKey, range, command) {
        super(range, command);
        this.ssmKey = ssmKey;
    }
    createCommand(cache, awsProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const ssmKeyPath = yield this.ssmKey.getPath(cache, awsProfile);
            if (ssmKeyPath.Error) {
                this.handleResourceError(ssmKeyPath.Resource, ssmKeyPath.Error, awsProfile);
                return Promise.reject(ssmKeyPath.Error);
            }
            return Promise.resolve({
                command: 'extension.editSSMKey',
                title: 'Add/Edit SSM Key',
                arguments: [ssmKeyPath.Path]
            });
        });
    }
    handleResourceError(resource, error, awsProfile) {
        if (error === tf_state_api_1.TerraformError.NoTerraformInstalled) {
            vscode.window.showErrorMessage(`The extension vscode-terraform-aws-ssm must have terraform CLI installed to work properly`);
        }
        else if (error === tf_state_api_1.TerraformError.FailedToLoadBackend) {
            vscode.window.showErrorMessage(`You must run terraform init on the directory in order for Edit SSM Key to work`);
        }
        else if (error === tf_state_api_1.TerraformError.EmptyResponse) {
            vscode.window.showErrorMessage(`terraform state show ${resource.ResourceName} returned an empty response`);
        }
        else if (error === tf_state_api_1.TerraformError.UnsupportedResourceType) {
            vscode.window.showErrorMessage(`Unsupported ResourceType '${resource.ResourceType}'. Only 'data' resource is supported.`);
        }
        else {
            vscode.window.showErrorMessage(`Current profile ${awsProfile} has no permissions to load terraform state.`);
        }
    }
}
class SSMKeyCodeLensProvider {
    constructor(_extensionContext) {
        this.extensionContext = _extensionContext;
    }
    provideCodeLenses(document, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            const ssmKeys = tf_ssm_file_parser_1.extractSSMKeysFromFile(document.fileName, document.getText());
            return ssmKeys.map((ssmKey) => {
                const start = new vscode.Position(ssmKey.Line, ssmKey.Column);
                const end = new vscode.Position(ssmKey.Line, ssmKey.Offset);
                return new SSMKeyCodeLens(ssmKey, new vscode.Range(start, end));
            });
        });
    }
    resolveCodeLens(codeLens, token) {
        const awsProfile = this.extensionContext.globalState.get("AWSProfile");
        let ssmKeyCodeLens = codeLens;
        const localResourceCache = new tf_local_resource_cache_1.default(this.extensionContext.globalState);
        return ssmKeyCodeLens.createCommand(localResourceCache, awsProfile)
            .then((command) => {
            ssmKeyCodeLens.command = command;
            return ssmKeyCodeLens;
        });
    }
}
exports.default = SSMKeyCodeLensProvider;
//# sourceMappingURL=ssm_key_codelens_provider.js.map