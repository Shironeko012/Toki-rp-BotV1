const gtts = require("gtts")
const fs = require("fs")
const path = require("path")

function sleep(ms){
return new Promise(r => setTimeout(r, ms))
}

module.exports = async (sock, jid, text = "") => {

try{

if(!sock || !jid) return
if(!sock.user) return

// batasi panjang teks
if(text.length > 200){
text = text.slice(0,200)
}

// buat nama file unik
const file = path.join(
__dirname,
`voice_${Date.now()}.mp3`
)

// bahasa Jepang untuk karakter Toki
const tts = new gtts(text,"ja")

await new Promise((resolve,reject)=>{

tts.save(file,(err)=>{
if(err) reject(err)
else resolve()
})

})

// sedikit delay supaya natural
await sleep(500)

await sock.sendMessage(jid,{
audio: fs.readFileSync(file),
mimetype: "audio/mpeg",
ptt: true
})

// hapus file setelah dikirim
fs.unlink(file,()=>{})

}catch(err){

console.log("Voice TTS error:", err.message)

}

}
