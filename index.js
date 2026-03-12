// FIX crypto for Baileys
const crypto = require("crypto")
if (!global.crypto) global.crypto = crypto.webcrypto

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

const app = express()

app.get("/", (req,res)=>{
res.send("TOKI RP BOT V2 ONLINE")
})

app.listen(process.env.PORT || 3000, ()=>{
console.log("Web server running")
})

let pairingRequested = false

async function start(){

try{

console.log("Starting TOKI RP BOT...")

const { state, saveCreds } =
await useMultiFileAuthState("./session")

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level:"silent" }),
browser:["TOKI","AI","V2"],
syncFullHistory:false
})

sock.ev.on("creds.update", saveCreds)

/*
CONNECTION UPDATE
*/

sock.ev.on("connection.update", async(update)=>{

const { connection, lastDisconnect } = update

if(connection === "connecting"){
console.log("Connecting to WhatsApp...")
}

/*
PAIRING CODE (DELAYED)
*/

if(connection === "connecting" && !sock.authState.creds.registered && !pairingRequested){

pairingRequested = true

setTimeout(async ()=>{

const phone = process.env.PHONE_NUMBER?.replace(/[^0-9]/g,"")

if(!phone){
console.log("PHONE_NUMBER env not set")
return
}

try{

const code = await sock.requestPairingCode(phone)

console.log("PAIRING CODE:", code)

}catch(err){

console.log("Pairing error:", err.message)

}

},5000)

}

if(connection === "open"){
console.log("TOKI BOT CONNECTED")
}

if(connection === "close"){

const reason = lastDisconnect?.error?.output?.statusCode

console.log("Connection closed:", reason)

if(reason !== DisconnectReason.loggedOut){

console.log("Reconnecting in 5 seconds...")
setTimeout(start,5000)

}

}

})

/*
MESSAGE HANDLER
*/

sock.ev.on("messages.upsert", async(msg)=>{

try{

await handler(sock,msg)

}catch(err){

console.error("Handler error:", err)

}

})

/*
SYSTEMS
*/

routine(sock)

}catch(err){

console.error("START ERROR:", err)

setTimeout(start,5000)

}

}

antiCrash()

start()
