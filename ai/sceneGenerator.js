cconst axios = require("axios")
const config = require("../config")

exports.generateScene = async(text)=>{

try{

const prompt = `
You are a roleplay scene generator.

Create a short immersive scene for a roleplay conversation.

Character: Asuma Toki
Universe: Blue Archive
User is called: Sensei

Rules:
- Write in roleplay format
- Use *action* for environment description
- Keep scene under 80 words
- Focus on atmosphere
- Do not explain anything
- Only output the scene

User message:
${text}

Example format:

*Soft rain falls outside the academy courtyard.*

*Toki stands beside Sensei quietly.*

"Tampaknya cuaca hari ini cukup tenang, Sensei."
`

const res = await axios.post(
"https://api.openai.com/v1/chat/completions",
{
model: config.openai.model,
messages: [
{
role: "system",
content: "You create immersive anime roleplay scenes."
},
{
role: "user",
content: prompt
}
],
temperature: 0.9,
max_tokens: 120
},
{
headers:{
Authorization:`Bearer ${config.openai.apiKey}`,
"Content-Type":"application/json"
}
}
)

return res.data.choices[0].message.content.trim()

}catch(e){

console.log("Scene Generator Error:", e.message)

return "*Toki berdiri di dekat Sensei dengan tenang.*"

}

}
