const fs = require('fs');
const glob = require('glob');
const argv = require('yargs').argv;
const path = require('path');
const paths = require('./paths');
const DLL_PATH = path.resolve(__dirname, '../public/dll');
const webpack = require('webpack');
const _dllConfig = require('./dll.config');
const _ENV = process.env.NODE_ENV;
const _path = _ENV === 'development' ? '' : '/scripts/react-modules/build';

const argvPath = argv.path;
const entryPath = paths.getEntryJs(argvPath);

const basename = path.posix.basename(path.dirname(entryPath));
const entryJsPath = {
    [basename]: entryPath
}
const emptyDir = `${paths.appBuild}/pages/${basename}`;

const dllPlugin = () => {
    let map = [];
    const dllFiles = glob.sync(DLL_PATH + '/*.json');
    dllFiles.forEach(filePath => {
        const dllname = path.posix.basename(filePath);
        if (dllname !== 'bundle-config.json') {
            map.push(
                new webpack.DllReferencePlugin({
                    context: __dirname,
                    manifest: require(path.resolve(__dirname, '../public/dll/' + dllname))
                })
            )
        }

    });
    return map;
}

const dllFiles = ()=>{
    let conf = {};
    for (let s in _dllConfig) {
        const name = _dllConfig[s].name;
        conf[name] = (function () {
            const dllName = require(path.resolve(__dirname, `../public/dll/bundle-config.json`))[name]['js'];
            return `${_path}/dll/${dllName}`;
        })()
    }
    return conf;
}

const getLessVariables = (file)=>{
    var themeContent = fs.readFileSync(file, 'utf-8')
    var variables = {}
    themeContent.split('\n').forEach(function (item) {
        if (item.indexOf('//') > -1 || item.indexOf('/*') > -1) {
            return
        }
        var _pair = item.split(':')
        if (_pair.length < 2) return;
        var key = _pair[0].replace('\r', '')
        if (!key) return;
        var value = _pair[1].replace(';', '').replace('\r', '').replace(/^\s+|\s+$/g, '')
        variables[key] = value
    })
    return variables
}


module.exports = {
    argvPath,
    entryPath,
    basename,
    entryJsPath,
    emptyDir,
    dllPlugin,
    dllFiles,
    globalVars: getLessVariables(paths.themePath)
}

