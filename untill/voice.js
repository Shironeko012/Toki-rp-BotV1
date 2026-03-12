const gtts = require("gtts")
const fs = require("fs")

module.exports = async(sock,jid,text)=>{

try{

const tts = new gtts(text,"en")

tts.save("voice.mp3",async()=>{

await sock.sendMessage(jid,{
audio:fs.readFileSync("voice.mp3"),
mimetype:"audio/mp4",
ptt:true
})

})

}catch{}

}
