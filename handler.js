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

// extract message text
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
try{
if(Math.random() < config.sceneChance){
scene = await sceneAI(text)
}
}catch(e){
console.error("SceneAI error:", e)
}

// random dream event
let dream = ""
try{
if(Math.random() < config.dreamChance){
dream = await dreamAI()
}
}catch(e){
console.error("DreamAI error:", e)
}

// build prompt
const prompt = `
You are Asuma Toki from Blue Archive.

Personality:
Calm, professional, loyal maid and bodyguard.
You speak politely to Sensei.

Rules:
Use short sentences.
Use *action* format.
Stay in character.
Never mention you are an AI.

Example style:

*Toki adjusts her gloves.*

"Sensei, you look tired today."

Context:

Emotion: ${emotion}

Relationship: ${JSON.stringify(relation)}

Scene: ${scene}

Dream: ${dream}

Conversation History:
${JSON.stringify(history)}

User message:
${text}

Respond as Toki.
`

// ask AI
let reply = ""

try{

reply = await askGemini(prompt)

}catch(e){

console.error("AI error:", e)

reply = "*Toki terdiam sejenak sebelum menjawab.*"

}

// fallback
if(!reply || reply.length < 3){
reply = "*Toki terlihat berpikir sejenak.*"
}

// save memory
memory.save(jid, text, reply)

learning.learn(jid, text)

relationship.update(jid, text)

// send message
await sock.sendMessage(jid,{ text: reply })

// optional voice
try{
if(Math.random() < config.voiceChance){
await voice(sock, jid, reply)
}
}catch(e){
console.error("Voice error:", e)
}

}catch(err){

console.error("Handler Error:", err)

}

}
