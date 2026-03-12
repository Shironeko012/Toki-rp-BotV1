const config = require("../config")

function sleep(ms){
return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (sock, jid, text = "") => {

try{

// socket tidak tersedia
if(!sock) return

// jid tidak valid
if(!jid || typeof jid !== "string") return

// socket belum login
if(!sock.user) return

// config fallback
const min = config.typingSpeed?.min || 800
const max = config.typingSpeed?.max || 4000

// delay berpikir AI
const thinking = Math.floor(Math.random() * 600 + 300)

await sleep(thinking)

// delay berdasarkan panjang pesan
let delay

if(text){

const lengthDelay = text.length * 35

delay = Math.min(
Math.max(lengthDelay, min),
max
)

}else{

delay = Math.floor(Math.random() * (max - min) + min)

}

// kirim presence mengetik
try{

await sock.sendPresenceUpdate("composing", jid)

}catch(e){

// jika gagal kirim presence jangan lanjut
return

}

// delay mengetik
await sleep(delay)

// berhenti mengetik
try{

await sock.sendPresenceUpdate("paused", jid)

}catch(e){

return

}

}catch(err){

// ignore error umum supaya bot tidak crash
if(
err?.message?.includes("Connection Closed") ||
err?.message?.includes("not-authorized") ||
err?.message?.includes("Precondition Required")
){
return
}

console.error("Typing simulation error:", err.message)

}

}
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
