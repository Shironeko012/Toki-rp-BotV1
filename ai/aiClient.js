const axios = require("axios")
const config = require("../config")
const persona = require("./persona")

async function chatAI(data){

try{

const messages = [

{role:"system",content:persona},

{role:"system",content:`Emotion:${data.emotion}`},

{role:"system",content:`Relationship:${JSON.stringify(data.relation)}`},

{role:"system",content:`LongMemory:${JSON.stringify(data.longMemory)}`},

...data.history,

{role:"user",content:data.userMessage}

]

const res = await axios.post(

"https://api.openai.com/v1/chat/completions",

{
model:config.openai.model,
messages,
temperature:0.9,
max_tokens:300
},

{
headers:{
Authorization:`Bearer ${config.openai.apiKey}`
}
}

)

return res.data.choices[0].message.content

}catch(e){

console.log("AI ERROR",e.message)

return "*Toki terdiam sejenak*"

}

}

module.exports={chatAI}
