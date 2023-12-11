"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixImports = exports.relativize = void 0;
const relativize = (filePath, importPath, pathSep) => {
    const dartSep = '/'; // dart uses this separator for imports no matter the platform
    const pathSplit = (path, sep) => path.length === 0 ? [] : path.split(sep);
    const fileBits = pathSplit(filePath, pathSep);
    const importBits = pathSplit(importPath, dartSep);
    let dotdotAmount = 0, startIdx;
    for (startIdx = 0; startIdx < fileBits.length; startIdx++) {
        if (fileBits[startIdx] === importBits[startIdx]) {
            continue;
        }
        dotdotAmount = fileBits.length - startIdx;
        break;
    }
    const relativeBits = new Array(dotdotAmount).fill('..').concat(importBits.slice(startIdx));
    return relativeBits.join(dartSep);
};
exports.relativize = relativize;
const fixImports = (editor, packageInfo, pathSep) => __awaiter(void 0, void 0, void 0, function* () {
    const currentPath = editor.getFileName().replace(/(\/|\\)[^/\\]*.dart$/, '');
    const libFolder = `${packageInfo.projectRoot}${pathSep}lib`;
    if (!currentPath.startsWith(libFolder)) {
        const l1 = 'Current file is not on project root or not on lib folder? File must be on $root/lib.';
        const l2 = `Your current file path is: '${currentPath}' and the lib folder according to the pubspec.yaml file is '${libFolder}'.`;
        throw Error(`${l1}\n${l2}`);
    }
    const relativePath = currentPath.substring(libFolder.length + 1);
    const lineCount = editor.getLineCount();
    let count = 0;
    for (let currentLine = 0; currentLine < lineCount; currentLine++) {
        const line = editor.getLineAt(currentLine);
        if (line.trim().length === 0) {
            continue;
        }
        const content = line.trim();
        if (!content.startsWith('import ')) {
            break;
        }
        const packageNameRegex = new RegExp(`^\\s*import\\s*(['"])package:${packageInfo.projectName}/([^'"]*)['"]([^;]*);\\s*$`);
        const packageNameExec = packageNameRegex.exec(content);
        if (packageNameExec) {
            const quote = packageNameExec[1];
            const importPath = packageNameExec[2];
            const ending = packageNameExec[3];
            const relativeImport = relativize(relativePath, importPath, pathSep);
            const newContent = `import ${quote}${relativeImport}${quote}${ending};`;
            yield editor.replaceLineAt(currentLine, newContent);
            count++;
        }
        else {
            const standardPrefixRegex = new RegExp('^\\s*import\\s*([\'"])\\./(.*)$');
            const standardPrefixExec = standardPrefixRegex.exec(content);
            if (standardPrefixExec) {
                const quote = standardPrefixExec[1];
                const end = standardPrefixExec[2];
                const newContent = `import ${quote}${end}`;
                yield editor.replaceLineAt(currentLine, newContent);
                count++;
            }
        }
    }
    return count;
});
exports.fixImports = fixImports;
//# sourceMappingURL=main.js.map