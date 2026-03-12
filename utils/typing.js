const config = require("../config")

function sleep(ms){
return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (sock, jid, text = "") => {

try{

if(!sock || !jid) return

// jika socket belum ready jangan kirim presence
if(!sock.user) return

// config fallback
const min = config.typingSpeed?.min || 800
const max = config.typingSpeed?.max || 4000

// AI thinking delay
const thinking = Math.floor(Math.random() * 600 + 300)

await sleep(thinking)

// delay berdasarkan panjang teks
let delay

if(text){

const lengthDelay = text.length * 40

delay = Math.min(
Math.max(lengthDelay, min),
max
)

}else{

delay = Math.floor(Math.random() * (max - min) + min)

}

// mulai mengetik
await sock.sendPresenceUpdate("composing", jid)

// delay mengetik
await sleep(delay)

// berhenti mengetik
await sock.sendPresenceUpdate("paused", jid)

}catch(err){

// ignore error supaya bot tidak crash
if(err?.message?.includes("Connection Closed")){
return
}

console.error("Typing simulation error:", err.message)

}

}
