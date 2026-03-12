const fs = require("fs")

const DB="./database/memory.json"

function read(){

if(!fs.existsSync(DB)) return {}

return JSON.parse(fs.readFileSync(DB))

}

function write(data){

fs.writeFileSync(DB,JSON.stringify(data,null,2))

}

exports.learn=(user,text)=>{

const db=read()

if(!db[user]) db[user]=[]

if(text.includes("aku suka")){

db[user].push(text)

}

db[user]=db[user].slice(-50)

write(db)

}
