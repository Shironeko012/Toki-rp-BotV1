const gemini = require("./gemini")

module.exports = async()=>{

const prompt = `
Create a dream roleplay scene
where Toki dreams about Sensei.
`

return await gemini(prompt)

}
