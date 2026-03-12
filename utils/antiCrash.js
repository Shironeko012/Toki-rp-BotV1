exports.antiCrash=()=>{

process.on("uncaughtException",(err)=>{

console.log("UNCAUGHT",err)

})

process.on("unhandledRejection",(err)=>{

console.log("PROMISE ERROR",err)

})

}
