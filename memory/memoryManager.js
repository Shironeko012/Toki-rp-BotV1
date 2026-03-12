const fs = require("fs")

const historyDB = "./database/chatHistory.json"
const longDB = "./memory/longMemory.json"
const relationDB = "./memory/relationship.json"

function read(path){

if(!fs.existsSync(path)){
fs.writeFileSync(path, JSON.stringify({}))
}

return JSON.parse(fs.readFileSync(path))

}

function write(path,data){

fs.writeFileSync(path,JSON.stringify(data,null,2))

}

/* HISTORY */

exports.getHistory=(user)=>{

const db=read(historyDB)

return db[user]||[]

}

exports.saveHistory=(user,input,reply)=>{

const db=read(historyDB)

if(!db[user]) db[user]=[]

db[user].push(
{role:"user",content:input},
{role:"assistant",content:reply}
)

db[user]=db[user].slice(-20)

write(historyDB,db)

}

/* alias supaya handler lama tidak error */

exports.save = exports.saveHistory

/* LONG TERM MEMORY */

exports.getLongTerm=(user)=>{

const db=read(longDB)

return db[user]||{}

}

/* RELATIONSHIP */

exports.getRelationship=(user)=>{

const db=read(relationDB)

if(!db[user]){

db[user]={

affection:0,
trust:0

}

write(relationDB,db)

}

return db[user]

}

exports.updateRelationship=(user,text)=>{

const db=read(relationDB)

if(!db[user]) db[user]={affection:0,trust:0}

text = text.toLowerCase()

if(text.includes("terima kasih"))
db[user].affection+=1

if(text.includes("percaya"))
db[user].trust+=1

write(relationDB,db)

}
