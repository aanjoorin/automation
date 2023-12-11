"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ini_1 = require("ini");
const shell = require("shelljs");
let showResourcePromises = {};
var TerraformError;
(function (TerraformError) {
    TerraformError[TerraformError["None"] = 0] = "None";
    TerraformError[TerraformError["NoTerraformInstalled"] = 1] = "NoTerraformInstalled";
    TerraformError[TerraformError["NotAuthorized"] = 2] = "NotAuthorized";
    TerraformError[TerraformError["FailedToLoadBackend"] = 3] = "FailedToLoadBackend";
    TerraformError[TerraformError["UnsupportedResourceType"] = 4] = "UnsupportedResourceType";
    TerraformError[TerraformError["EmptyResponse"] = 5] = "EmptyResponse";
})(TerraformError = exports.TerraformError || (exports.TerraformError = {}));
function shellType(programName) {
    return new Promise((resolve, reject) => {
        shell.exec(`type ${programName}`, (code, stdout, stderr) => {
            if (code === 0) {
                resolve();
            }
            else {
                reject();
            }
        });
    });
}
function executeTerraformInit(workingDirectory, awsProfile = "default") {
    shell.cd(workingDirectory);
    shell.env["AWS_PROFILE"] = awsProfile;
    return new Promise((resolve, reject) => {
        shellType('terraform').then(() => {
            shell.exec(`terraform init`, (code, stdout, stderr) => {
                if (code !== 0) {
                    resolve(TerraformError.NotAuthorized);
                }
                else {
                    resolve(null);
                }
            });
        }).catch(() => {
            resolve(TerraformError.NoTerraformInstalled);
        });
    });
}
exports.executeTerraformInit = executeTerraformInit;
function showResource(resource, cache, workingDirectory, awsProfile = "default") {
    let showResourcePromise = showResourcePromises[resource.ResourceName];
    if (showResourcePromise) {
        return showResourcePromise;
    }
    return showResourcePromises[resource.ResourceName] = new Promise((resolve, reject) => {
        const cachedResourceProperties = cache.get(resource.getKeyForCache(awsProfile));
        if (cachedResourceProperties && Object.keys(cachedResourceProperties).length > 0) {
            return resolve({
                Properties: cachedResourceProperties, Resource: resource
            });
        }
        const resourceProperties = {};
        shellType('terraform').then(() => {
            if (resource.ResourceType !== 'data') {
                return resolve({
                    Properties: resourceProperties, Error: TerraformError.UnsupportedResourceType,
                    Resource: resource
                });
            }
            shell.cd(workingDirectory);
            // shell.env["TF_LOG"] = "TRACE";
            shell.env["AWS_PROFILE"] = awsProfile;
            return new Promise((resolve, reject) => {
                shell.exec(`terraform state show ${resource.ResourceName}`, (code, stdout, stderr) => {
                    if (code === 0) {
                        if (!stdout) {
                            delete showResourcePromises[resource.ResourceName];
                            return resolve({
                                Properties: resourceProperties, Error: TerraformError.EmptyResponse,
                                Resource: resource
                            });
                        }
                        const iniProperties = ini_1.parse(stdout);
                        Object.keys(iniProperties)
                            .forEach(key => resourceProperties[key] = iniProperties[key]);
                        cache.set(resource.getKeyForCache(awsProfile), resourceProperties);
                        delete showResourcePromises[resource.ResourceName];
                        resolve({ Properties: resourceProperties, Resource: resource });
                    }
                    else {
                        if (stderr.toString().indexOf("Failed to load backend") > -1) {
                            delete showResourcePromises[resource.ResourceName];
                            resolve({
                                Properties: resourceProperties, Error: TerraformError.FailedToLoadBackend,
                                Resource: resource
                            });
                        }
                        else if (stderr.toString().indexOf("Failed to load state: AccessDenied") > -1) {
                            delete showResourcePromises[resource.ResourceName];
                            resolve({
                                Properties: resourceProperties, Error: TerraformError.NotAuthorized,
                                Resource: resource
                            });
                        }
                    }
                });
            }).then((result) => resolve(result));
        }).catch(() => {
            return resolve({
                Properties: resourceProperties, Error: TerraformError.NoTerraformInstalled, Resource: resource
            });
        });
    });
}
exports.showResource = showResource;
//# sourceMappingURL=tf_state_api.js.map