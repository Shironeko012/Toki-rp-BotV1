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

const qrcode = require("qrcode-terminal")

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

sock.ev.on("connection.update",(update)=>{

const { connection, lastDisconnect, qr } = update

if(qr){

console.log("SCAN QR CODE BELOW:")
qrcode.generate(qr,{small:false})

}

if(connection === "connecting"){
console.log("Connecting to WhatsApp...")
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

routine(sock)

}catch(err){

console.error("START ERROR:", err)

setTimeout(start,5000)

}

}

antiCrash()

start()
