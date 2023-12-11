"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { parseHcl } = require('./hcl-hil/hcl-hil-wrapper');
function extractSSMKeysFromFile(document) {
    const [ast] = parseHcl(document);
    return ast.Node.Items
        .filter(filterAWSSSMParameterKey)
        .map(mapAWSSSMKey);
}
exports.extractSSMKeysFromFile = extractSSMKeysFromFile;
function mapAWSSSMKey(item) {
    const list = item.Val.List;
    const [nameItem] = list.Items
        .filter((item) => item.Keys.length === 1 && item.Keys[0].Token.Text === 'name');
    return {
        Path: nameItem.Val.Token.Text.replace(new RegExp('"', 'g'), '').replace(new RegExp("'", 'g'), ''),
        Line: nameItem.Val.Token.Pos.Line,
        Column: nameItem.Val.Token.Pos.Column,
        Offset: nameItem.Val.Token.Pos.Offset
    };
}
function filterAWSSSMParameterKey(item) {
    return item.Keys.length === 3 &&
        item.Keys[0].Token.Type === 4 && item.Keys[0].Token.Text.indexOf('data') > -1 &&
        item.Keys[1].Token.Type === 9 && item.Keys[1].Token.Text.indexOf('aws_ssm_parameter') > -1;
}
//# sourceMappingURL=tf_ssm_file_parser.js.map