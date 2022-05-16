
const error = new URLSearchParams(window.location.search).get("error")
if(error)
alert(error)
const startWork=()=>{
    window.location.assign("/home/startWork")
}

const endWork=()=>{
    window.location.assign("/home/endWork")
}