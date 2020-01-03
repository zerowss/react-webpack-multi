const argv = require('yargs').argv;
const path = require('path');
const paths = require('./paths');
const argvPath = argv.path;
const entryPath = paths.getEntryJs(argvPath);
const basename = path.posix.basename(path.dirname(entryPath));
const entryJsPath = {
    [basename]: entryPath
}
const emptyDir = `${paths.appBuild}/pages/${basename}`;
module.exports = {
    argvPath,
    entryPath,
    basename,
    entryJsPath,
    emptyDir
}

