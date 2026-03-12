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
const initiator = require("./systems/aiInitiator")

const app = express()

app.get("/",(req,res)=>{
res.send("TOKI RP BOT V2 ONLINE")
})

app.listen(process.env.PORT || 3000)

async function start(){

const { state, saveCreds } =
await useMultiFileAuthState("./session")

const { version } =
await fetchLatestBaileysVersion()

const sock = makeWASocket({

version,
auth: state,
logger: pino({ level:"silent" })

})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async(msg)=>{

await handler(sock,msg)

})

sock.ev.on("connection.update",(update)=>{

const { connection,lastDisconnect } = update

if(connection==="close"){

const reason =
lastDisconnect?.error?.output?.statusCode

if(reason!==DisconnectReason.loggedOut){

setTimeout(start,5000)

}

}

})

routine(sock)
initiator(sock)

}

antiCrash()

start()
