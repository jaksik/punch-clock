export function date() {
    let today = new Date();
    let currentMonth = today.getMonth() + 1;
    let currentDay = today.getDate();
    let date = today.getFullYear() + '-' + (currentMonth < 10 ? "0" : "") + currentMonth + '-' + (currentDay < 10 ? "0" : "") + currentDay;
    return date;
}

export function timeStamp(){
    let today = new Date();
    return today.getTime();
}

export function time(x, y) {
    let today = new Date();
    let currentMinutes = today.getMinutes();
    let currentHours = today.getHours();
    let time = (currentHours < 10 ? '0' : '') + currentHours + ':' + (currentMinutes < 10 ? '0' : '') + currentMinutes;

    return time;
}

export function plus(x, y) {
    let date = new Date();
    return date;
}

