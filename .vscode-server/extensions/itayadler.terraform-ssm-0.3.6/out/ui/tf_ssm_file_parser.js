"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hcl_hil_wrapper_1 = require("../vendor/hcl-hil/hcl-hil-wrapper");
const ssm_key_model_1 = require("./ssm_key_model");
function extractSSMKeysFromFile(filePath, document) {
    const [ast] = hcl_hil_wrapper_1.parseHcl(document);
    return ast.Node.Items
        .filter(filterAWSSSMParameterKey)
        .map(mapAWSSSMKey.bind(filePath));
}
exports.extractSSMKeysFromFile = extractSSMKeysFromFile;
function mapAWSSSMKey(item) {
    const list = item.Val.List;
    const [nameItem] = list.Items
        .filter((item) => item.Keys.length === 1 && item.Keys[0].Token.Text === 'name');
    return new ssm_key_model_1.default(this, nameItem.Val.Token.Text.replace(new RegExp('"', 'g'), '').replace(new RegExp("'", 'g'), ''), item.Keys[0].Token.Pos.Line - 1, item.Keys[0].Token.Pos.Column, item.Keys[0].Token.Pos.Offset);
}
function filterAWSSSMParameterKey(item) {
    return item.Keys.length === 3 &&
        item.Keys[0].Token.Type === 4 && item.Keys[0].Token.Text.indexOf('data') > -1 &&
        item.Keys[1].Token.Type === 9 && item.Keys[1].Token.Text.indexOf('aws_ssm_parameter') > -1;
}
//# sourceMappingURL=tf_ssm_file_parser.js.map