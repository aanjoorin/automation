"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TFLocalResourceCache {
    constructor(memento) {
        this.memento = memento;
    }
    get(key) {
        return this.memento.get(key);
    }
    set(key, value) {
        this.memento.update(key, value);
    }
}
exports.default = TFLocalResourceCache;
//# sourceMappingURL=tf_local_resource_cache.js.map