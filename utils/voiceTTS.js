const gtts = require("gtts")

module.exports = async(sock,jid,text)=>{

const tts = new gtts(text,"ja")

tts.save("voice.mp3",async()=>{

await sock.sendMessage(jid,{
audio:require("fs").readFileSync("voice.mp3"),
ptt:true
})

})

}
