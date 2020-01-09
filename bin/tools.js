const fs = require('fs-extra');
const shell = require('shelljs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const red_chalk = str => chalk.red(str);
const green_chalk = str => chalk.green(str);

class Tools {
    constructor(optios){
        this.inPath = '';
        this.filePath = '';
        this.routerConfig = '';
        this.appDirectory = fs.realpathSync(process.cwd());
        this.configPath = this.resolveApp('router.config.json');
        this.initRouter();
    }
    resolveApp(relativePath){
        return path.resolve(this.appDirectory, relativePath);
    }

    resolveDir(relativePath) {
        return path.resolve(__dirname, relativePath);
    }

    initRouter(){
        if (fs.existsSync(this.configPath)){
            this.routerConfig = require(this.configPath);
            this.inPath = this.routerConfig.path[0];
        }else{
            console.log(red_chalk('router.config.js is Non-existent!'));
            process.exit(1);
        }
    }

    // 创建文件
    createFile(path){
        let _path;
        if(path.includes('src/pages')){
            _path = path;
        }else{
            _path = `src/pages/${path}`;
        }
        
        const filePath = this.resolveApp(_path);
        this.inPath = _path;
        this.filePath = filePath;
        if (fs.existsSync(filePath)){
            console.log(red_chalk(`${path} already exist!`));
            process.exit(1);
        }else{
            this.createDir(filePath,()=>{
                this.addConfigJsonData();
            })
        }
    }

    createDir(filePath,cb){
        console.log(green_chalk('mkdir && copyTemplate start.....'));
        fs.mkdir(filePath, { recursive: true }, err => {
            if (err) throw err;
            fs.copySync(this.resolveDir('../bin/template'), filePath);
            console.log(green_chalk('mkdir && copyTemplate end.....'));
            cb && cb();
        })
    }

    addConfigJsonData(){
        let pathList = this.routerConfig.path;
        if (pathList.indexOf(this.inPath) !== -1) {
            pathList.splice(pathList.indexOf(this.inPath), 1);
        }
        pathList.unshift(this.inPath);
        this.routerConfig.path = pathList;
        fs.writeFile(this.configPath, JSON.stringify(this.routerConfig, '', '\t'), err => {
            if (err) return console.error(err)
            console.log(green_chalk('success!'));
        })
    }

    // runCbr
    runCbr(){
        this.createFile(this.inPath);
    }

    // staet
    runStart(){
        this.inPath ?
            shell.exec(`yarn start --path ${this.inPath}/index`) :
            console.log(green_red('noexit path'));
    }

    // build
    runBuild(){
        this.inPath ?
        shell.exec(`yarn build --path ${this.inPath}/index`):
        console.log(green_red('noexit path'));
    }

    //question
    setQuestions(){
        return {
            type: 'list',
            name: 'pathList',
            message: 'select filepath',
            choices: this.routerConfig.path
        }
    }

    runSfs(){
        const questions = this.setQuestions();
        inquirer.prompt(questions).then(answers => {
            console.log('\nOrder receipt:');
            console.log(JSON.stringify(answers, null, '  '));
            this.runStart();
        });
    }

    runSfb() {
        const questions = this.setQuestions();
        inquirer.prompt(questions).then(answers => {
            console.log('\nOrder receipt:');
            console.log(JSON.stringify(answers, null, '  '));
            this.runBuild();
        });
    }

    runJsdoc(){
        // shell.exec(`./node_modules/.bin/typedoc --theme ./node_modules/typedoc-ava-theme/bin/default --out typedoc/ src/`);
        // shell.exec(`./node_modules/.bin/typedoc --theme node_modules/typedoc-default-themes/bin/minimal --out typedoc/ src/`);
        shell.exec(`./node_modules/.bin/typedoc --out typedoc/ src/`);

    }

}

module.exports = Tools;
