module.exports = {

botName: "TOKI AI",
owner: "085601931030",

openai: {
apiKey: process.env.OPENAI_API_KEY,
model: "gpt-4o-mini"
},

memoryLimit: 20,

typingSpeed: {
min: 2000,
max: 6000
}

}
