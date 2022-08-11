#!/usr/bin/env node
const program = require('commander')
const print = require('../lib/print.js')
const path = require('path')
const Compiler = require('../lib/compiler.js')
program.version(require('../package').version).usage('<command> [options]')
program.on('--help', () => {
    console.log()
    print.info(`Run wt <command> --help for detailed usage of given command.`)
    console.log()
})
program
    .option('--config <filepath>','Set config file path','./wt-config.js')
    .action((cmd,options)=>{
        const inputParam = options._optionValues || {}
        print.info(JSON.stringify(inputParam))
        var filepath = path.resolve(process.env.PWD,inputParam.config)
        const wtConfig = require(filepath)
        // 拿到配置
        let compiler = new Compiler(wtConfig)
        print.success('初始化编译')
        compiler.run()
    })
program.parse(process.argv)