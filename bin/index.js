#! /usr/bin/env node

const program = require("commander");
const Tools = require('./tools');
const tool = new Tools();

program
    .version("0.0.1")
    .description("create project")
    .option("-c, --cr <cr>", "create dir && file")
    .option("-r, --cbr", "create dir && file by router.config.json")
    .option("-s, --start", "yarn start")
    .option("-b, --build", "yarn build")
    .option("-f, --sfs", "searc for yarn start")
    .option("-n, --sfb", "searc for yarn build")
    .option("-o, --jsdoc", "jsdoc -c jsconf.json")
    .action(option => {
        const cr = option.cr;
        const cbr = option.cbr;
        const start = option.start;
        const build = option.build;
        const sfs = option.sfs;
        const sfb = option.sfb;
        const jsdoc = option.jsdoc;
        if (cr){
            tool.createFile(cr);
        }
        else if (cbr){
            tool.runCbr();
        }
        else if (start){
            tool.runStart();
        }
        else if(build){
            tool.runBuild();
        }
        else if (sfs) {
            tool.runSfs();
        }
        else if (sfb) {
            tool.runSfb();
        }
        else if (jsdoc) {
            tool.runJsdoc();
        }
        else{
            process.exit(1);
        }
    });

program.parse(process.argv);
