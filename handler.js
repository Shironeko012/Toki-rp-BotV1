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

if(!msg || !msg.messages) return

const m = msg.messages[0]

if(!m || !m.message) return

const jid = m.key?.remoteJid

if(!jid) return

// ignore group & broadcast
if(jid.endsWith("@g.us") || jid === "status@broadcast") return

// extract text (support more message types)
const text =
m.message.conversation ||
m.message.extendedTextMessage?.text ||
m.message.imageMessage?.caption ||
m.message.videoMessage?.caption

if(!text) return

// typing simulation
await typing(sock, jid, text)

// emotion detection
const emotion = emotionAI(text) || "neutral"

// conversation history
let history = memory.getHistory(jid) || []

if(config.memoryLimit){
history = history.slice(-config.memoryLimit)
}

// relationship
let relation = {}

try{
relation = relationship.get(jid)
}catch(e){
console.error("Relationship error:", e)
}

// random scene
let scene = ""

try{
if(Math.random() < config.sceneChance){
scene = await sceneAI(text)
}
}catch(e){
console.error("SceneAI error:", e)
}

// random dream
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

Speak politely to Sensei.

Rules:
Stay in character.
Use *action* style sometimes.
Keep responses natural.

Context:

Emotion: ${emotion}

Relationship:
${JSON.stringify(relation)}

Scene:
${scene}

Dream:
${dream}

Conversation History:
${JSON.stringify(history)}

User message:
${text}

Reply as Toki.
`

let reply = ""

try{

reply = await askGemini(prompt)

}catch(e){

console.error("Gemini error:", e)

reply = "*Toki terdiam sejenak sebelum menjawab.*"

}

// fallback reply
if(!reply || reply.length < 3){
reply = "*Toki terlihat berpikir sejenak.*"
}

// save memory
try{
memory.save(jid, text, reply)
learning.learn(jid, text)
relationship.update(jid, text)
}catch(e){
console.error("Memory error:", e)
}

// send reply
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
