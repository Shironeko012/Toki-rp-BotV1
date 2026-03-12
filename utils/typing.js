const config = require("../config")

// sleep helper
function sleep(ms){
return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async function typing(sock, jid, text = ""){

try{

// safety check
if(!sock) return
if(!jid || typeof jid !== "string") return
if(!sock.user) return

// config fallback
const min = config.typingSpeed?.min || 800
const max = config.typingSpeed?.max || 4000

// AI thinking delay
const thinkingDelay = Math.floor(Math.random() * 600 + 300)

await sleep(thinkingDelay)

// typing delay calculation
let delay

if(text && typeof text === "string"){

// semakin panjang teks semakin lama mengetik
const lengthDelay = text.length * 35

delay = Math.min(
Math.max(lengthDelay, min),
max
)

}else{

delay = Math.floor(Math.random() * (max - min) + min)

}

// start typing
try{

await sock.sendPresenceUpdate("composing", jid)

}catch{

return

}

// typing simulation
await sleep(delay)

// stop typing
try{

await sock.sendPresenceUpdate("paused", jid)

}catch{

return

}

}catch(err){

// ignore connection errors
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
