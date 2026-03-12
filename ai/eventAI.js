const axios = require("axios")
const config = require("../config")

exports.generateEvent = async()=>{

const prompt=`

Create a small unexpected roleplay event involving Toki.

Examples:

sudden rain
enemy alert
night patrol
coffee break

`

try{

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

}catch{

return ""

}

}
