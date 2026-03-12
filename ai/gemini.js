const { GoogleGenerativeAI } = require("@google/generative-ai")
const config = require("../config")

if(!config.geminikey){
console.error("❌ GEMINI API KEY NOT FOUND")
}

const genAI = new GoogleGenerativeAI(config.geminikey)

const model = genAI.getGenerativeModel({
model: config.ai.model
})

/*
Persona TOKI
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

Speaking style:
Use roleplay format.

Example:

*Toki pours tea quietly*

"Sensei, you look tired today."

Stay in character.
Never mention you are an AI.
`

/*
Main AI function
*/

async function askGemini(userMessage){

try{

const prompt = `
${persona}

User message:
${userMessage}

Reply as Toki.
`

const result = await model.generateContent(prompt)

const response = await result.response

const text = response.text()

return text

}catch(err){

console.error("Gemini Error:", err.message)

return "*Toki terdiam sejenak sebelum menjawab.*"

}

}

module.exports = askGemini
