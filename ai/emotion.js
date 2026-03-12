exports.detectEmotion=(text)=>{

text=text.toLowerCase()

if(text.includes("sedih")) return "sad"
if(text.includes("capek")) return "tired"
if(text.includes("marah")) return "angry"
if(text.includes("senang")) return "happy"

return "neutral"

}
