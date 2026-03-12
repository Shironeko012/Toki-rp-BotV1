setInterval(()=>{

const hour = new Date().getHours()

if(hour==7){

sendRoutine("selamat pagi hehe")

}

if(hour==12){

sendRoutine("makan sianb dulu!")

}

if(hour==22){

sendRoutine("selamat malam, tidur yang nyenyak")

}

},600000)
