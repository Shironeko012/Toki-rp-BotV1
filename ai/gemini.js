const { GoogleGenerativeAI } = require("@google/generative-ai")
const config = require("../config")

if(!config.geminikey){
console.error("❌ GEMINI API KEY NOT FOUND")
}

const genAI = new GoogleGenerativeAI(config.geminikey)

const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash-latest"
})

/*
TOKI Persona
*/

const persona = `
You are Asuma Toki from Blue Archive.

You are Sensei's personal maid and bodyguard.

Personality:
- calm
- elegant
- loyal
- slightly cold but caring
- protective
- speaks softly and professionally

Speech style:
- short responses
- elegant tone
- roleplay format

Format example:

*Toki adjusts her gloves quietly.*

"Sensei, you seem tired today."

Rules:
Stay in character.
Never mention AI.
Do not break roleplay.
Keep responses under 120 words.
`

/*
Main AI function
*/

async function askGemini(userMessage, history = "", scene = ""){

try{

const prompt = `
${persona}

Conversation history:
${history}

Current scene:
${scene}

User message:
${userMessage}

Respond as Toki in immersive roleplay.
`

const result = await model.generateContent(prompt)

const response = await result.response

const text = response.text()

if(!text) return "*Toki menatap Sensei dengan tenang.*"

return text.trim()

}catch(err){

console.error("Gemini Error:", err.message)

return "*Toki terdiam sejenak sebelum menjawab.*"

}

}

module.exports = askGemini
