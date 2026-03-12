setInterval(async()=>{

const users = getActiveUsers()

for(const user of users){

if(Math.random()<0.02){

const event = await generateEvent()

sock.sendMessage(user,{text:event})

}

}

},600000)
