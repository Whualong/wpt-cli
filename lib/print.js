const chalk = require('chalk')
function error( err = ''){
    console.log( `error: ${chalk.red(err)}`)
}
function success( info = ''){
    console.log( `success: ${chalk.green(info)}`)
}
function warn( warning = ''){
    console.log( `warn: ${chalk.yellowBright(warning)}`)
}
function info( e = '' ){
    console.log( `${chalk.blue(e)}`)
}
module.exports = {
    error,
    success,
    warn,
    info
}