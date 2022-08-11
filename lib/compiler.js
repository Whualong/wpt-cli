const fs  = require('fs')
const path = require('path')
const Parser = require('./util.js')
const print = require('../lib/print.js')
class Compiler {
    constructor( option = {} ){
        const { entry, output } = option
        this.entry = entry
        this.output = output
        this.modules = []
    }
    run(){
        print.success(this.entry)
        let entryInfo = this.build(this.entry)
        print.success( JSON.stringify(entryInfo,null,4))
        this.modules.push(entryInfo)
        this.modules.forEach(({dependencies})=>{
            if(dependencies){
                for( const dependency in dependencies){
                    this.modules.push(this.build(dependencies[dependency]))
                }
            }
        })

        const dependencyGraph = this.modules.reduce( (graph,item) =>  ({
                ...graph,
                [item.filename] : {
                    dependencies : item.dependencies,
                    code : item.code
                }
            }),
            {}
        )
        print.success( JSON.stringify(dependencyGraph,null,4))
        this.generate(dependencyGraph)
    }

    build(filename){
        const { getAst, getDependencies, getCode } = Parser
        const ast = getAst(filename)
        const dependencies = getDependencies(ast, filename)
        const code = getCode(ast)
        return {
          // 文件路径,可以作为每个模块的唯一标识符
          filename,
          // 依赖对象,保存着依赖模块路径
          dependencies,
          // 文件内容
          code
        }
    }

    generate(code) {
        // 输出文件路径
        const filePath = path.join(this.output.path, this.output.filename)
        const bundle = `(function(graph){
          function require(module){
            function localRequire(relativePath){
              return require(graph[module].dependecies[relativePath])
            }
            var exports = {};
            (function(require,exports,code){
              eval(code)
            })(localRequire,exports,graph[module].code);
            return exports;
          }
          require('${this.entry}')
        })(${JSON.stringify(code)})`
    
        // 把文件内容写入到文件系统
        let outpath = path.resolve(process.env.PWD,this.output.path)
        fs.exists(outpath,(exists)=>{
            if(!exists){
                fs.mkdir(outpath,(err)=>{
                    if(err){
                        print.success(`打包路径：${outpath}`)
                    }else{
                         fs.writeFileSync(path.resolve(outpath,this.output.filename), bundle, 'utf-8')
                    }
                })
            }else{
                 fs.writeFileSync(path.resolve(outpath,this.output.filename), bundle, 'utf-8')
            }
        })
    }
    
}
module.exports = Compiler