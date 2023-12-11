"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ini_1 = require("ini");
const shell = require("shelljs");
var TerraformError;
(function (TerraformError) {
    TerraformError[TerraformError["None"] = 0] = "None";
    TerraformError[TerraformError["NoTerraformInstalled"] = 1] = "NoTerraformInstalled";
    TerraformError[TerraformError["NotAuthorized"] = 2] = "NotAuthorized";
    TerraformError[TerraformError["FailedToLoadBackend"] = 3] = "FailedToLoadBackend";
    TerraformError[TerraformError["EmptyResponse"] = 4] = "EmptyResponse";
})(TerraformError = exports.TerraformError || (exports.TerraformError = {}));
function executeTerraformInit(workingDirectory, awsProfile = "default") {
    if (!shell.which('terraform')) {
        return TerraformError.NoTerraformInstalled;
    }
    shell.cd(workingDirectory);
    shell.env["AWS_PROFILE"] = awsProfile;
    return new Promise((resolve, reject) => {
        shell.exec(`terraform init`, (code, stdout, stderr) => {
            if (code !== 0) {
                resolve(TerraformError.NotAuthorized);
            }
            else {
                resolve(null);
            }
        });
    });
}
exports.executeTerraformInit = executeTerraformInit;
function showResource(resourceName, workingDirectory, awsProfile = "default") {
    const resourceProperties = new Map();
    if (!shell.which('terraform')) {
        return { Properties: resourceProperties, Error: TerraformError.NoTerraformInstalled };
    }
    shell.cd(workingDirectory);
    // shell.env["TF_LOG"] = "TRACE";
    shell.env["AWS_PROFILE"] = awsProfile;
    return new Promise((resolve, reject) => {
        shell.exec(`terraform state show ${resourceName}`, (code, stdout, stderr) => {
            if (code === 0) {
                if (!stdout) {
                    resolve({ Properties: resourceProperties, Error: TerraformError.EmptyResponse });
                }
                const iniProperties = ini_1.parse(stdout);
                Object.keys(iniProperties)
                    .forEach(key => resourceProperties.set(key, iniProperties[key]));
                resolve({ Properties: resourceProperties });
            }
            else {
                if (stderr.toString().indexOf("Failed to load backend") > -1) {
                    resolve({ Properties: resourceProperties, Error: TerraformError.FailedToLoadBackend });
                }
                else if (stderr.toString().indexOf("Failed to load state: AccessDenied") > -1) {
                    resolve({ Properties: resourceProperties, Error: TerraformError.NotAuthorized });
                }
            }
        });
    });
}
exports.showResource = showResource;
//# sourceMappingURL=tf_state_api.js.map