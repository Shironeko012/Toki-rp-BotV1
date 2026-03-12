const askGemini = require("./ai/gemini")

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

/* ignore group */

if(jid.endsWith("@g.us")) return

/* extract message */

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

/* typing simulation */

await typing(sock,jid,text)

/* emotion detection */

const emotion = emotionAI(text)

/* memory */

const history = memory.getHistory(jid)

/* relationship */

const relation = relationship.get(jid)

/* random scene */

let scene=""

if(Math.random()<config.sceneChance){

scene = await sceneAI(text)

}

/* story state */

const story = storyAI.get(jid)

/* build prompt */

const prompt = `
Emotion:${emotion}

Relationship:${JSON.stringify(relation)}

Scene:${scene}

Story:${JSON.stringify(story)}

Conversation History:
${JSON.stringify(history)}

User:${text}
`

/* ask AI */

const reply = await askGemini(prompt)

/* save memory */

memory.save(jid,text,reply)

learning.learn(jid,text)

relationship.update(jid,text)

storyAI.progress(jid,text)

/* send message */

await sock.sendMessage(jid,{ text: reply })

/* optional voice */

if(Math.random()<config.voiceChance){

await voice(sock,jid,reply)

}
