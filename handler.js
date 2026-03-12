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

// ignore broadcast & group
if(!jid || jid.endsWith("@g.us") || jid === "status@broadcast") return

// extract text
const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

// typing simulation
await typing(sock, jid, text)

// emotion detection
const emotion = emotionAI(text)

// conversation history
let history = memory.getHistory(jid) || []
history = history.slice(-config.memoryLimit)

// relationship state
const relation = relationship.get(jid)

// random scene
let scene = ""
if(Math.random() < config.sceneChance){
scene = await sceneAI(text)
}

// random dream event
let dream = ""
if(Math.random() < config.dreamChance){
dream = await dreamAI()
}

// build prompt
const prompt = `
You are Toki from Blue Archive.

Emotion: ${emotion}

Relationship: ${JSON.stringify(relation)}

Scene: ${scene}

Dream: ${dream}

Conversation History:
${JSON.stringify(history)}

User: ${text}

Respond as Toki in roleplay format.
`

// ask Gemini
let reply

try{

reply = await askGemini(prompt)

}catch(e){

console.error("AI error:", e)

reply = "*Toki terdiam sejenak sebelum menjawab.*"

}

// save memory
memory.save(jid, text, reply)
learning.learn(jid, text)
relationship.update(jid, text)

// send message
await sock.sendMessage(jid,{ text: reply })

// optional voice
if(Math.random() < config.voiceChance){
await voice(sock, jid, reply)
}

}catch(err){

console.error("Handler Error:", err)

}

}
