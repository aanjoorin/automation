"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = require("aws-sdk");
const ini_1 = require("ini");
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
function getAWSCredentialsAsObject() {
    return ini_1.parse(fs_1.readFileSync(path_1.resolve(os_1.homedir(), '.aws/credentials'), 'utf-8'));
}
function readAWSRegionFromConfig(profile) {
    const iniFile = getAWSCredentialsAsObject();
    return iniFile[profile].region;
}
exports.readAWSRegionFromConfig = readAWSRegionFromConfig;
function getAWSProfiles() {
    const iniFile = getAWSCredentialsAsObject();
    return Object.keys(iniFile);
}
exports.getAWSProfiles = getAWSProfiles;
function getSSMParameter(profile, params) {
    setProfile(profile);
    return new aws_sdk_1.SSM().getParameter(params).promise();
}
exports.getSSMParameter = getSSMParameter;
function putSSMParameter(profile, params) {
    setProfile(profile);
    return new aws_sdk_1.SSM().putParameter(params).promise();
}
exports.putSSMParameter = putSSMParameter;
function setProfile(profile) {
    const credentials = new aws_sdk_1.SharedIniFileCredentials({ profile });
    //note(itay): node aws-sdk doesn't load the region
    //from the ini profile, so we have to update it manually.
    const region = readAWSRegionFromConfig(profile);
    aws_sdk_1.config.update({ credentials, region });
}
//# sourceMappingURL=aws_api.js.map