const config = require("../config")

module.exports = async(sock,jid)=>{

const delay = Math.floor(
Math.random()*
(config.typingSpeed.max-config.typingSpeed.min)
+config.typingSpeed.min
)

await sock.sendPresenceUpdate("composing",jid)

await new Promise(r=>setTimeout(r,delay))

await sock.sendPresenceUpdate("paused",jid)

}
