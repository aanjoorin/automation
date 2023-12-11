"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TFResource {
    constructor(ResourceName, KeyName) {
        this.ResourceName = ResourceName;
        this.KeyName = KeyName;
        [this.ResourceType] = ResourceName.split(".");
    }
    getResourceNameAndKey() {
        return `${this.ResourceName}.${this.KeyName}`;
    }
    getKeyForCache(awsProfile) {
        return `${awsProfile}-${this.ResourceName}.${this.KeyName}`;
    }
    getResourceType() {
        return this.ResourceType;
    }
    static createResourceFromString(resourceString) {
        let resourceParts = resourceString.split(".");
        //note(itay): We don't need the last part as it's a key from the resource
        const key = resourceParts.pop();
        return new TFResource(resourceParts.join("."), key);
    }
}
exports.default = TFResource;
//# sourceMappingURL=tf_resource_model.js.map