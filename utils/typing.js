const config = require("../config")

module.exports = async (sock, jid, text = "") => {

try{

// fallback jika config tidak ada
const min = config.typingSpeed?.min || 800
const max = config.typingSpeed?.max || 4000

// delay berdasarkan panjang teks
let delay = Math.floor(
Math.random() * (max - min) + min
)

if(text){
delay = Math.min(
Math.max(text.length * 40, min),
max
)
}

// kirim status typing
await sock.sendPresenceUpdate("composing", jid)

// tunggu delay
await new Promise(resolve => setTimeout(resolve, delay))

// stop typing
await sock.sendPresenceUpdate("paused", jid)

}catch(err){

console.error("Typing simulation error:", err)

}

}
