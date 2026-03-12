const gtts = require("gtts")
const fs = require("fs")

module.exports = async(sock,jid,text)=>{

try{

const file = "voice_"+Date.now()+".mp3"

const tts = new gtts(text,"en")

tts.save(file,async()=>{

await sock.sendMessage(jid,{
audio:fs.readFileSync(file),
mimetype:"audio/mp4",
ptt:true
})

fs.unlinkSync(file)

})

}catch(err){

console.log("VOICE ERROR",err)

}

}
