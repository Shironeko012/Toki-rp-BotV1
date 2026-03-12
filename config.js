module.exports = {

botName: "TOKI RP BOT V2",

// Gemini API key dari Railway
geminikey: process.env.GEMINI_API_KEY,

// AI model
ai: {
model: "gemini-1.5-flash-latest"
},

// typing simulation speed
typingSpeed: {
min: 800,
max: 4000
},

// memory conversation
memoryLimit: 12,

// chance system
sceneChance: 0.25,
dreamChance: 0.05,
voiceChance: 0.2

}
