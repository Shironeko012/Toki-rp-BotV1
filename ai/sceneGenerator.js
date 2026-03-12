const axios = require("axios")
const config = require("../config")

exports.generateScene = async(text)=>{

try{

const prompt = `

Create a roleplay environment scene.

User message:
${text}

Return immersive scene.

`

const res = await axios.post(

"https://api.openai.com/v1/chat/completions",

{
model:config.openai.model,
messages:[{role:"user",content:prompt}],
temperature:1
},

{
headers:{
Authorization:`Bearer ${config.openai.apiKey}`
}
}

)

return res.data.choices[0].message.content

}catch(e){

return ""

}

}
