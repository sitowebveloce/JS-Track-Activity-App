// SELECT ELEMENTS
const time = document.querySelector('.time');
const secCircle = document.querySelector('.svg-seconds');
const minCircle = document.querySelector('.svg-minutes');
const hoursCircle = document.querySelector('.svg-hours');
// CONTROLS
let totalTime = document.querySelector('.total-time');
const startBtn = document.querySelector('.start');
const stopBtn = document.querySelector('.stop');
const timeBox = document.querySelector('.time-box');
const timeClock = document.querySelector('.time');
let activities = document.querySelector('.activities');
// IS STARTED VARIABLE
let started = false;

// 1 TIME FN
function timeFn (){
    let time = new Date();
    let hours = addZero(time.getHours());
    let minutes = addZero(time.getMinutes());
    let seconds = time.getSeconds().toString().padStart(2,0);
    // 4 SVG OFFSET
    secCircle.style.strokeDashoffset = -(63 - (64 * seconds) / 60);
    minCircle.style.strokeDashoffset = -(63 - (64 * minutes) / 60);
    hoursCircle.style.strokeDashoffset = -(63 - (64 * hours) / 24)
    // FULL TIME
    let fullTime = `${hours}:${minutes}:${seconds}`;
    // console.log(fullTime)
    return fullTime;
}
// 3 ADD ZERO FN
function addZero (timeValue) {
    return Number(timeValue) >= 10 ? timeValue : '0'+ timeValue;
};
// 2 SET INTERVAL 1 SECOND
setInterval(()=> time.innerHTML = timeFn());
 
// 4 GET TIME DIFFERENCE
function getTimeDifference (startTime){
    let diffTime = Math.abs(new Date().valueOf() - startTime);
    let days = diffTime / (24*60*60*1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    // console.log({days:Math.floor(days), hours:Math.floor(hours), minutes: Math.floor(minutes),seconds: Math.floor(secs)})
    return {days:Math.floor(days), hours:Math.floor(hours), minutes: Math.floor(minutes),seconds: Math.floor(secs), createdAt:startTime, name:'New Act'};
};

// 5 BUTTON START NEW ACTIVITY
let startItem = 'start';
startBtn.onclick = ()=>{
    // CHANGE UI
    started = true;
    timeBox.classList.add('active');
    time.classList.add('active');
    secCircle.classList.add('active');
    let startTime = new Date().valueOf()
    // ADD
    localStorage.setItem(startItem, JSON.stringify(startTime));
    alert('Start time created.');
};

// 6 STOP ACTIVITY
stopBtn.onclick = ()=>{
    // Get Start Time
    let startTime = JSON.parse(localStorage.getItem(startItem));
    if(startTime === null) return alert('First Start.');
    // GET TIME DIFFERENCE OBJECT
    let activity = getTimeDifference(startTime);
    // ADD COMPLETED TIME
    activity.completed = new Date().valueOf();
    // SAVE NEW ACTIVITY IN THE LOCAL STORAGE
    saveNewActivity (activity);
    // CHANGE UI
    getActivities();
    // Delete local storage start time
    localStorage.removeItem('start');
    // CHANGE UI
    started = false;
    timeBox.classList.remove('active');
    time.classList.remove('active');
    secCircle.classList.remove('active');
};

// 7 SAVE NEW ACTIVITY
let activitiesName = 'activities';
function saveNewActivity (activity){
     // ACTIVITY NAME
     // GET ACTIVITIES
     let storedActivities = JSON.parse(localStorage.getItem(activitiesName));
     if(storedActivities === null){ 
         // New Arr   
         let actsArr = [];
         // Push
         actsArr.push(activity);
         // Save 
         localStorage.setItem(activitiesName, JSON.stringify(actsArr));
         }else{
         storedActivities.push(activity);
         // Save 
         localStorage.setItem(activitiesName, JSON.stringify(storedActivities));
     };
};

 // 9 CREATE CARD FN
 function createCard (activity){
    // CREATE CARD DIV
    let card = document.createElement('div');
    // ADD CLASS
    card.classList.add('flex','card');
    // CREATE INPUT NAME
    let input = document.createElement('input');
        input.classList.add('act-name');
        input.placeholder = 'Action Name';
        input.value = activity.name;
        input.addEventListener('keypress', e =>{
            if(e.code === 'Enter'){
                // Add activity name
                if(input.value !== ''){
                // GET ACTIVITIES
                let storedActivities = JSON.parse(localStorage.getItem(activitiesName));
                // FIND ACT
                let found = storedActivities.find(a => a.createdAt === Number(activity.createdAt));
                // console.log(found);
                // CHANGE ACT NAME
                found.name = input.value;
                let actsRemaining = storedActivities.filter(a => +a.createdAt !== +found.createdAt);
                // PUSH
                actsRemaining.push(found);
                // SAVE 
                localStorage.setItem(activitiesName, JSON.stringify(actsRemaining));
                }else{
                    alert('Insert a valid act name!')
                };
                // REMOVE FOCUS FROM THE INPUT
                input.blur();
                // UPDATE UI
                getActivities();
            };
        });
        // SPAN TIME
        let span = document.createElement('span');
        span.classList.add('span-total-time');
        span.innerHTML = `D: ${activity.days} H:${activity.hours} M: ${activity.minutes} S:${activity.seconds}`;
        // CREATED AT DIV
        let div = document.createElement('div');
        div.classList.add('created-at');
        div.innerHTML = `Created at ${new Date(activity.createdAt).toLocaleDateString('it')}`;
        // DELETE
        let btnDelete = document.createElement('button');
        btnDelete.classList.add('btn-delete');
        btnDelete.innerText = 'X'
        btnDelete.id = activity.createdAt;
        btnDelete.onclick = ()=>{
         deleteActivity(btnDelete.id);
        };
        // APPEND
        card.append(btnDelete, span,input,div);
        activities.appendChild(card);
};

// 8 GET ACTIVITIES
function getActivities(){
    // RESET
    activities.innerHTML = '';
    // GET ACTIVITIES
    let allActivities = JSON.parse(localStorage.getItem(activitiesName));

    if(allActivities === null) return;
    if(allActivities.length === 0){ return totalTime.innerHTML = 0 }
    // SORT
    allActivities.sort(function(a,b){
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    let totalSecondsArray =[];
    let totalSeconds;
    // CHANTE UI
    allActivities.map(activity => {
        
        let seconds = toSeconds(activity);
        totalSecondsArray.push(seconds);
        // console.log(totalSecondsArray);
        // REDUCER
        totalSeconds = totalSecondsArray.reduce((total, s) => total + s,0);

        // CHANGE UI CREATE CARDS
        createCard(activity);
        // SHOW TOTAL TIME
        totalTime.innerHTML = `D: ${Math.floor(totalSeconds / 86400).toString()}- H: ${Math.floor(totalSeconds / 3600).toString().padStart(2, '0')} - M: ${(Math.floor(totalSeconds / 60) % 60).toString().padStart(2, '0')} - S: ${(Math.floor(totalSeconds) % 60).toString().padStart(2, '0')}`
    });
};
// WINDOW CONTENT LOADED EVENT
window.addEventListener('DOMContentLoaded', ()=> getActivities());

// 10 DELETE FUNCTION
function deleteActivity (id){
    const confirm = window.confirm('Are you sure?');
    if(confirm){
    let activities = JSON.parse(localStorage.getItem(activitiesName));
    let actsRemaining = activities.filter(a => +a.createdAt !== +id);
    localStorage.setItem(activitiesName, JSON.stringify(actsRemaining));
    // CHANGE UI
    getActivities();
    }
};

// TIME TO SECONS FUNCTION
function toSeconds (activity){
 return (activity.days * 86400) + (activity.hours * 3600) + (activity.minutes * 60) + activity.seconds;
};