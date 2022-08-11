const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { transformFromAst } = require('@babel/core')
const fs  = require('fs')
const path = require('path')
const Parser = {
    getAst( filepath ){
        const content = fs.readFileSync(filepath,'utf-8');
        return parser.parse(content,{
            sourceType : 'module'
        })
    },
    getDependencies(ast,filename){
        const dependencies = {}
        traverse(ast,{
            ImportDeclaration({ node }) {
                const dirname = path.dirname(filename)
                // 保存依赖模块路径,之后生成依赖关系图需要用到
                const filepath =  path.join(dirname, node.source.value)
                 dependencies[node.source.value] = filepath
              }
        })
        return dependencies
    },
    getCode(ast){
        // AST转换为code
        const { code } = transformFromAst(ast, null, {
            presets: ['@babel/preset-env']
        })
        return code
    }
}
module.exports = Parser