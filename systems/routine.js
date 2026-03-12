// systems/routine.js

module.exports = function routine(sock){

setInterval(async ()=>{

const hour = new Date().getHours()

const users = [] // nanti bisa diambil dari database user aktif

for(const jid of users){

if(hour === 7){

await sock.sendMessage(jid,{
text:"*Toki membuka tirai jendela*\n\nSelamat pagi, Sensei."
})

}

if(hour === 12){

await sock.sendMessage(jid,{
text:"Sensei, jangan lupa makan siang."
})

}

if(hour === 22){

await sock.sendMessage(jid,{
text:"Hari sudah malam.\nSilakan istirahat, Sensei."
})

}

}

},600000)

}
