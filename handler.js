const askGemini = require("./ai/gemini")

const emotionAI = require("./ai/emotion")
const sceneAI = require("./ai/sceneGenerator")
const dreamAI = require("./ai/dreamAI")

const memory = require("./memory/memoryManager")
const learning = require("./memory/learning")
const relationship = require("./memory/relationship")

const typing = require("./utils/typing")
const voice = require("./utils/voiceTTS")

const config = require("./config")

module.exports = async (sock, msg) => {

try{

if(!msg.messages) return

const m = msg.messages[0]

if(!m || !m.message) return

const jid = m.key.remoteJid

// ignore group chat
if(jid.endsWith("@g.us")) return

// extract text
const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

// typing simulation
await typing(sock, jid, text)

// emotion detection
const emotion = emotionAI(text)

// get history
let history = memory.getHistory(jid) || []

// limit history supaya AI tidak overload
history = history.slice(-config.memoryLimit)

// relationship data
const relation = relationship.get(jid)

// random scene
let scene = ""

if(Math.random() < config.sceneChance){
scene = await sceneAI(text)
}

// build prompt
const prompt = `
Emotion:${emotion}

Relationship:${JSON.stringify(relation)}

Scene:${scene}

Story:${JSON.stringify(story)}

Conversation History:
${JSON.stringify(history)}

User:${text}
`

// ask Gemini AI
const reply = await askGemini(prompt)

// save memory
memory.save(jid, text, reply)

learning.learn(jid, text)

relationship.update(jid, text)

storyAI.progress(jid, text)

// send reply
await sock.sendMessage(jid,{ text: reply })

// optional voice message
if(Math.random() < config.voiceChance){
await voice(sock, jid, reply)
}

}catch(err){

console.error("Handler Error:", err)

}

}
