const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason,
fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const handler = require("./handler")
const { antiCrash } = require("./utils/antiCrash")

async function startBot(){

try{

const { state, saveCreds } = await useMultiFileAuthState("./session")

const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: pino({ level:"silent" }),
browser:["TOKI","AI","1.0"]
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async(msg)=>{

try{

await handler(sock,msg)

}catch(err){

console.log("HANDLER ERROR",err)

}

})

sock.ev.on("connection.update",(update)=>{

const { connection, lastDisconnect } = update

if(connection==="close"){

const reason = lastDisconnect?.error?.output?.statusCode

if(reason!==DisconnectReason.loggedOut){

console.log("Reconnecting TOKI...")
startBot()

}

}else if(connection==="open"){

console.log("TOKI AI ONLINE")

}

})

}catch(e){

console.log("BOT CRASH:",e)
setTimeout(startBot,5000)

}

}

antiCrash()

startBot()
