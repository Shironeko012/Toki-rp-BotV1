const gemini = require("./ai/gemini")

const emotionAI = require("./ai/emotionAI")
const sceneAI = require("./ai/sceneAI")
const dreamAI = require("./ai/dreamAI")
const storyAI = require("./ai/storyAI")

const memory = require("./memory/memoryManager")
const learning = require("./memory/learning")
const relationship = require("./memory/relationship")

const typing = require("./utils/typing")
const voice = require("./utils/voiceTTS")

const config = require("./config")

module.exports = async(sock,msg)=>{

const m = msg.messages[0]

if(!m.message) return

const jid = m.key.remoteJid

if(jid.endsWith("@g.us")) return

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

await typing(sock,jid,text)

const emotion = emotionAI(text)

const history = memory.getHistory(jid)

const relation = relationship.get(jid)

let scene=""

if(Math.random()<config.sceneChance){

scene = await sceneAI(text)

}

const story = storyAI.get(jid)

const prompt = `
Emotion:${emotion}
Relationship:${JSON.stringify(relation)}
Scene:${scene}
Story:${JSON.stringify(story)}

User:${text}
`

const reply = await gemini(prompt)

memory.save(jid,text,reply)

learning.learn(jid,text)

relationship.update(jid,text)

storyAI.progress(jid,text)

await sock.sendMessage(jid,{text:reply})

if(Math.random()<config.voiceChance){

await voice(sock,jid,reply)

}

}
