
/*
    ========================
    A D D    N E W   S O N G
    ========================
*/

let form = document.getElementById('upload-form')

form.addEventListener('submit',(event)=>{
    event.preventDefault()
    console.log("submitting....")
    let song_file = document.querySelector('input[type="file"]').files[0]

    let formdata = new FormData()

    if(!song_file){
        controller.abort()
    }else{
        formdata.append('song-file',song_file)
        let controller = new AbortController()
        let signal = controller.signal
        signal.addEventListener('abort',()=>{
            alert('error ocuured!')
        })
    
        fetch('/add-song',{
            method:'POST',
            signal:signal,
            body:formdata
        }).then((response)=>{return response.json()}).then((jsonRes)=>{
            if(jsonRes['success'] == false){
                controller.abort()
            }else{alert(jsonRes)}}
            ).catch(()=>{
            controller.abort()
        })
    }

})

