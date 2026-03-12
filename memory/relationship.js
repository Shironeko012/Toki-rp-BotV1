const fs = require("fs")

const DB = "./memory/relationship.json"

function readDB(){

if(!fs.existsSync(DB)){
fs.writeFileSync(DB, JSON.stringify({}))
}

return JSON.parse(fs.readFileSync(DB))

}

function writeDB(data){

fs.writeFileSync(DB, JSON.stringify(data,null,2))

}

/* GET RELATIONSHIP */

exports.get = function(user){

const db = readDB()

if(!db[user]){

db[user] = {
affection: 0,
trust: 0,
comfort: 0
}

writeDB(db)

}

return db[user]

}

/* UPDATE RELATIONSHIP */

exports.update = function(user,text){

const db = readDB()

if(!db[user]){

db[user] = {
affection: 0,
trust: 0,
comfort: 0
}

}

text = text.toLowerCase()

if(text.includes("terima kasih")) db[user].affection += 2
if(text.includes("aku sedih")) db[user].comfort += 2
if(text.includes("aku percaya")) db[user].trust += 2

writeDB(db)

}
