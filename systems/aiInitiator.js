module.exports = function initiator(sock){

setInterval(async ()=>{

// contoh AI message duluan
const user = null // nanti bisa ambil dari database

if(!user) return

if(Math.random() < 0.02){

await sock.sendMessage(user,{
text: "Sensei... apakah anda sedang sibuk?"
})

}

},900000)

}
