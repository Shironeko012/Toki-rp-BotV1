const config = require("../config")

function sleep(ms){
return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = async (sock, jid, text = "") => {

try{

if(!sock || !jid) return

// config fallback
const min = config.typingSpeed?.min || 800
const max = config.typingSpeed?.max || 4000

// thinking delay (AI seperti berpikir dulu)
const thinking = Math.floor(Math.random() * 500 + 300)

await sleep(thinking)

// base typing delay
let delay = Math.floor(
Math.random() * (max - min) + min
)

// jika ada teks, gunakan panjang teks
if(text){

const lengthDelay = text.length * 45

delay = Math.min(
Math.max(lengthDelay, min),
max
)

}

// mulai typing
await sock.sendPresenceUpdate("composing", jid)

// delay mengetik
await sleep(delay)

// berhenti typing
await sock.sendPresenceUpdate("paused", jid)

}catch(err){

console.error("Typing simulation error:", err)

}

}
