let audio_ele = document.querySelector('audio')
let dispatch = false
let audio_progress = document.querySelector('#duration')
let duration = audio_ele.duration
let sec = 0
let volume = audio_ele.volume


audio_ele.onplaying =()=>{
    sec = sec + 1
    setInterval(()=>{
        audio_progress.value += sec
    },audio_ele.duration * 10)
}

// control the play button
let play_btn = document.getElementById('play')

play_btn.addEventListener('click',()=>{
    if (audio_ele.paused == false || dispatch == false){
        audio_ele.play()
        dispatch = true
    }else{
        audio_ele.pause()
        dispatch = false
    }
})

audio_ele.onchange = ()=>{
    audio_progress.setAttribute('value',0)
}

// control  volume

let volume_high = document.getElementById('volume-high')
let volume_low = document.getElementById('volume-low')
let volume_progress = document.getElementById('volume-progress')
volume_progress.value = (audio_ele.volume * 100)
volume_high.addEventListener('click',()=>{

    if(audio_ele.volume < 1){
        audio_ele.volume += 0.1
        volume_progress.value += 10
    }
})
volume_low.addEventListener('click',()=>{
    if(audio_ele.volume >0){
        volume_progress.value -= 10
        audio_ele.volume -= 0.1
    }
})



/*
    ==========================
    M U S I C  C O N T R O L S
    ==========================
*/

let next = document.querySelector('#next')
let previous = document.querySelector('#previous')
let title = document.querySelector('#song-title')


previous.addEventListener('click',()=>{
    audio_ele.src = '/get-song/'+previous.getAttribute('data-previous')
    fetch('/song',{
        method:'POST',
        body:JSON.stringify({"id":previous.getAttribute('data-previous'),"next":false}),
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{return res.json()}).then((jsonRes)=>{
        next.setAttribute('data-next',previous.getAttribute('data-previous'))
        previous.setAttribute('data-previous',jsonRes['id'])
        audio_ele.play()
        title.textContent = jsonRes['title']
    }).catch((error)=>{alert(error)})
})

next.addEventListener('click',()=>{
    audio_ele.src = '/get-song/'+next.getAttribute('data-next')
    fetch('/song',{
        method:'POST',
        body:JSON.stringify({"id":next.getAttribute('data-next'),"next":true}),
        headers:{"Content-Type":"application/json"}
    }).then((res)=>{return res.json()}).then((jsonRes)=>{
        previous.setAttribute('data-previous',next.getAttribute('data-next'))
        next.setAttribute('data-next',jsonRes['id'])
        audio_ele.play()
        title.textContent = jsonRes['title'] 
    }).catch((error)=>{alert(error)})

})
