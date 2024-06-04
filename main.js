import './style.css'
async function getData(city) {
    const input =  await fetch("http://api.weatherapi.com/v1/current.json?key=1f90bb24247a4d1cbc5104240242805&q="+city+"&aqi=yes")
    const a = await input.json()
    return await a
}
let submit = document.querySelector("#submit")
let inputCity = document.querySelector("#city")
let error = document.querySelector("#error")
let timeDiv = document.querySelector("#time")
let refreshButton = document.querySelector("#refreshB")

let currentFetch = ""

refreshButton.addEventListener("click", e =>{
    console.log(currentFetch)
    doFetch(currentFetch)
})


submit.disabled = true
inputCity.addEventListener('change',e =>{
    console.log(e.target.value)
    if(e.target.value === ""){
        submit.disabled = true;
        error.textContent = "You cant submit an empty city"
        error.style.display = "block"
    }else{
        submit.disabled = false;
        error.style.display = "none"
    }

})

async function handleError(text){
    error.textContent = text
    error.style.display = "block"
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(3000)
    error.style.display = "none"
}

async function doFetch(fetch){
    let inputDiv = document.querySelector("#i")
    try {
        const data = await getData(fetch)
        currentFetch = fetch
        inputDiv.innerHTML = ""
        let div = document.createElement("div")
        div.id = "input"
        let temperature = document.createElement("p")
        temperature.textContent = "Current temperature: " + data.current.temp_c + " C"
        temperature.id = "temp"
        let condition = document.createElement("div")
        let conditionTxt = document.createElement("p")
        conditionTxt.textContent = data.current.condition.text
        let conditionImg = document.createElement("img")
        conditionImg.src = data.current.condition.icon
        condition.id = "cond"
        condition.appendChild(conditionImg)
        condition.appendChild(conditionTxt)

        div.appendChild(temperature)
        div.appendChild(condition)
        inputDiv.appendChild(div)
        timeDiv.style.display = "flex"
        timeS = timeM * 60
    } catch (e) {
        timeDiv.style.display = "none"
        await handleError("city is not on the list")
    }
}

submit.addEventListener("click", async e => {
    await doFetch(inputCity.value)
})
let time = document.querySelector("#timer")
let timeM = 2
let timeS = timeM * 60
function timeUpdate(){
    timeS--
    let minutes = Math.floor(timeS / 60)
    let seconds = timeS % 60

    if (timeS < 0) {
        timeS =  timeM * 60
        doFetch(currentFetch)
        return;
    }

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    time.textContent = minutes+":"+seconds
}
let timeInterval = setInterval(timeUpdate, 1000)