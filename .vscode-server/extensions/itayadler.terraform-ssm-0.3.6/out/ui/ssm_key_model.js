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
const bluebird = require("bluebird");
const tf_resource_model_1 = require("./tf_resource_model");
const tf_state_api_1 = require("../api/tf_state_api");
const path_1 = require("path");
class SSMKey {
    constructor(filePath, path, line, column, offset) {
        this.RawPath = path;
        this.Line = line;
        this.Column = column;
        this.Offset = offset;
        this.FilePath = filePath;
        this.Resources = this.getResources(this.RawPath);
    }
    getResources(path) {
        return path.split("/")
            .filter(this.isPathPartResource)
            .map(this.getResource);
    }
    isPathPartResource(pathPart) {
        return pathPart.indexOf("$") > -1;
    }
    getResource(pathPart) {
        const leftBracketIndex = pathPart.indexOf("{");
        const rightBracketIndex = pathPart.indexOf("}");
        const resourceString = pathPart.slice(leftBracketIndex + 1, rightBracketIndex);
        return tf_resource_model_1.default.createResourceFromString(resourceString);
    }
    getPath(cache, awsProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const showResourceResults = yield bluebird
                .map(this.Resources, (resource) => __awaiter(this, void 0, void 0, function* () {
                return yield tf_state_api_1.showResource(resource, cache, path_1.dirname(this.FilePath), awsProfile);
            }), { concurrency: 1 });
            const resourceWithError = showResourceResults.find((showResource) => !!showResource.Error);
            if (resourceWithError) {
                return { Path: null, Error: resourceWithError.Error, Resource: resourceWithError.Resource };
            }
            const resourceKeyParts = this.RawPath.split("/").map((pathPart, index) => {
                if (this.isPathPartResource(pathPart)) {
                    const resource = this.getResource(pathPart);
                    const showResourceResult = showResourceResults.find((showResourceResult) => showResourceResult.Resource.ResourceName === resource.ResourceName);
                    return showResourceResult.Properties[resource.KeyName];
                }
                else {
                    return pathPart;
                }
            });
            return { Path: resourceKeyParts.join("/") };
        });
    }
}
exports.default = SSMKey;
//# sourceMappingURL=ssm_key_model.js.map