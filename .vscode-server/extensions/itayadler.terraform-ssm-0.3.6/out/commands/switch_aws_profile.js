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
function createSwitchAWSProfileCmd(context) {
    return vscode.commands.registerCommand('extension.switchAWSProfile', () => __awaiter(this, void 0, void 0, function* () {
        const placeHolder = `Showing AWS profiles found in ~/.aws/credentials. Select current profile:`;
        const selectedAWSProfile = yield vscode.window.showQuickPick(aws_api_1.getAWSProfiles(), { placeHolder });
        const awsRegion = aws_api_1.readAWSRegionFromConfig(selectedAWSProfile);
        if (!awsRegion) {
            return vscode.window.showErrorMessage(`Selected AWSProfile '${selectedAWSProfile}' is missing an AWS region. Add a region to the profile!`);
        }
        context.globalState.update("AWSProfile", selectedAWSProfile || "default");
        vscode.window.showInformationMessage(`AWSProfile changed to '${selectedAWSProfile}'`);
    }));
}
exports.default = createSwitchAWSProfileCmd;
//# sourceMappingURL=switch_aws_profile.js.map