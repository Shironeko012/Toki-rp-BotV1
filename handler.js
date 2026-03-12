const config = require("./config")
const { chatAI } = require("./ai/aiClient")
const { detectEmotion } = require("./ai/emotion")
const { generateScene } = require("./ai/sceneGenerator")
const { generateEvent } = require("./ai/eventAI")

const memory = require("./memory/memoryManager")

const typing = require("./utils/typing")
const voice = require("./utils/voice")

module.exports = async(sock,msg)=>{

const m = msg.messages[0]

if(!m.message) return

const sender = m.key.remoteJid
const isGroup = sender.endsWith("@g.us")

if(isGroup) return

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

await typing(sock,sender)

const emotion = detectEmotion(text)

const history = memory.getHistory(sender)

const longMemory = memory.getLongTerm(sender)

const relation = memory.getRelationship(sender)

let scene = ""

if(Math.random()<0.2){

scene = await generateScene(text)

}

const aiReply = await chatAI({

userMessage:text,
history,
emotion,
scene,
longMemory,
relation

})

memory.saveHistory(sender,text,aiReply)
memory.updateRelationship(sender,text)

await sock.sendMessage(sender,{text:aiReply})

if(Math.random()<0.05){

const event = await generateEvent()

await sock.sendMessage(sender,{text:event})

}

if(Math.random()<0.15){

await voice(sock,sender,aiReply)

}

}
