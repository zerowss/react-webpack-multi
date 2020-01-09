'use strict';
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.on('unhandledRejection', err => {
    throw err;
});


const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const configFactory = require('../config/webpack.dll.config');
const paths = require('../config/paths');

const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;
// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.dllConfig])) {
    console.log(
        chalk.red(
            'dll.config.js is Non-existent!'
        )
    );
    process.exit(1);
}
const _dllConfig = require('../config/dll.config');

const dll = _dllConfig || [];

if (
    Object.prototype.toString.call(dll) !== "[object Array]" ||
    JSON.stringify(dll) === "[]"
) {
    console.log(chalk.yellow('dll is empty'));
    process.exit(1);
}

let noRelyDll = dll.filter(v => !v.conf); // 无依赖可直接打包的库
let hasRelyDll = dll.filter(v => !!v.conf); //有依赖需要明确依赖的库

function build(config, previousFileSizes) {
    if (process.env.NODE_PATH) {
        console.log(
            chalk.yellow(
                'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
            )
        );
        console.log();
    }

    console.log(`Creating an dll:${config.name} production build...`);

    const compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }

                let errMessage = err.message;

                // Add additional information for postcss errors
                if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
                    errMessage +=
                        '\nCompileError: Begins at CSS selector ' +
                        err['postcssNode'].selector;
                }

                messages = formatWebpackMessages({
                    errors: [errMessage],
                    warnings: [],
                });
            } else {
                messages = formatWebpackMessages(
                    stats.toJson({ all: false, warnings: true, errors: true })
                );
            }
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }

            return resolve({
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            });
        });
    });
}


function run() {
    fs.emptyDirSync(paths.dllPublic);
    noRelyDll.forEach(dllconfig => {
        const config = configFactory(dllconfig);
        measureFileSizesBeforeBuild(paths.dllPublic)
            .then(previousFileSizes => {
                return build(config, previousFileSizes);
            })
            .then(
                ({ stats, previousFileSizes, warnings }) => {
                    if (warnings.length) {
                        console.log(chalk.yellow('Compiled with warnings.\n'));
                        console.log(warnings.join('\n\n'));
                        console.log(
                            '\nSearch for the ' +
                            chalk.underline(chalk.yellow('keywords')) +
                            ' to learn more about each warning.'
                        );
                        console.log(
                            'To ignore, add ' +
                            chalk.cyan('// eslint-disable-next-line') +
                            ' to the line before.\n'
                        );
                    } else {
                        console.log(chalk.green('Compiled successfully.\n'));
                    }

                    console.log('File sizes after gzip:\n');
                    printFileSizesAfterBuild(
                        stats,
                        previousFileSizes,
                        paths.dllPublic,
                        WARN_AFTER_BUNDLE_GZIP_SIZE,
                        WARN_AFTER_CHUNK_GZIP_SIZE
                    );
                    console.log();
                },
                err => {
                    console.log(chalk.red('Failed to compile.\n'));
                    printBuildError(err);
                    process.exit(1);
                }
            )
            .catch(err => {
                if (err && err.message) {
                    console.log(err.message);
                }
                process.exit(1);
            });
    });
    hasRelyDll.forEach(dllconfig => {
        const config = configFactory(dllconfig);
        build(config);
    })
}

run();
