const express = require("express")

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")

const handler = require("./handler")
const { antiCrash } = require("./utils/antiCrash")

const routine = require("./systems/routine")
// const initiator = require("./systems/aiInitiator")

const app = express()

app.get("/", (req,res)=>{
res.send("TOKI RP BOT V2 ONLINE")
})

app.listen(process.env.PORT || 3000, ()=>{
console.log("Web server running")
})

async function start(){

console.log("Starting TOKI RP BOT...")

const { state, saveCreds } =
await useMultiFileAuthState("./session")

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({

version,
auth: state,
logger: pino({ level:"silent" }),
browser:["TOKI","AI","V2"]

})

sock.ev.on("creds.update", saveCreds)

/*
PAIRING CODE LOGIN
*/

if (!sock.authState.creds.registered) {

const phone = process.env.PHONE_NUMBER

if(!phone){
console.log("PHONE_NUMBER env not set")
}else{

const code = await sock.requestPairingCode(phone)

console.log("PAIRING CODE:", code)

}

}

sock.ev.on("messages.upsert", async(msg)=>{

try{

await handler(sock,msg)

}catch(err){

console.error("Handler error:", err)

}

})

sock.ev.on("connection.update",(update)=>{

const { connection,lastDisconnect } = update

if(connection==="close"){

const reason =
lastDisconnect?.error?.output?.statusCode

console.log("Connection closed:", reason)

if(reason!==DisconnectReason.loggedOut){

console.log("Reconnecting...")
setTimeout(start,5000)

}

}

if(connection==="open"){

console.log("TOKI BOT CONNECTED")

}

})

routine(sock)
// initiator(sock)

}

antiCrash()

start()
