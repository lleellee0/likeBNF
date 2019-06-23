const request = require('request');

const getHistory = (symbol, from, to) => {
    return new Promise((resolve, reject) => {
        request(`https://tvc4.forexpros.com/227407a1d8a6d5ef9f47bc2f1f9d6c9e/${Date.now()}/18/18/88/history?symbol=${symbol}&resolution=D&from=${from}&to=${to}`, function (error, response, body) {
            if(error) {
                console.log('error:', error);
                return;
            }
            if(body == undefined) return;
            body = JSON.parse(body);
            resolve(body);
        });
    });
}

const transferObjToArr = (history_obj) => {
    // history 응답은 다음과 같이 배열 형태가 아니라 객체 형태로 되어있다.
    // 다루기 쉽게하려면 이를 배열 형태로 만드는게 좋을 것 같다.
    // 이 함수는 history_obj를 history_arr로 만드는 함수이다.
    // {
    //  c: [84200, 84000, 82800, 84600, 87900, 84400, 84400, 84400, 82100, 82400, 86500, 87100, 87100],
    //  h: [84200, 84700, 84000, 85400, 88200, 86300, 84400, 85300, 83400, 83000, 87100, 88800, 87100],
    //  l: [84200, 83400, 82300, 83700, 85300, 84000, 84400, 83300, 80400, 80900, 83300, 86800, 87100],
    //  o: [84200, 84200, 83900, 84100, 85800, 85900, 84400, 83400, 83300, 81600, 83800, 88500, 87100],
    //  s: "ok",
    //  t: [1523750400, 1523836800, 1523923200, 1524009600, 1524096000, 1524182400, 1524355200, 1524441600,…],
    //  v: [0, 1473637, 2492385, 3365362, 5877877, 4574615, 0, 2934952, 6791628, 3824565, 7499472, 4615820, 0],
    //  vo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // }
    let history_arr = [];

    for(let i = 0; i < history_obj.c.length; i++) {
        // c나 h, l, o, t, v는 어차피 같은 길이일 것이다. 그래서 c의 길이를 기준으로 잡았다.
        let obj = {};
        obj.close_price = history_obj.c[i];
        obj.high_price = history_obj.h[i];
        obj.low_price = history_obj.l[i];
        obj.open_price = history_obj.o[i];
        obj.timestamp = history_obj.t[i];
        obj.date = new Date(obj.timestamp* 1000);
        obj.volume = history_obj.v[i];  // 사실 지금 하려는거에 볼륨은 필요 없긴하다.
        // 2019년 6월 16일이 버그인지 일요일인데 거래가 있는걸로 나와있음 ㅡㅡ 그거 제외하기 위한 코드
        if(obj.date.getDay() !== 0 && obj.date.getDay() !== 6)  // 0은 일요일, 6은 토요일
            history_arr.push(obj);
    }

    return history_arr;
}


const calcMovingAverage25 = (history_arr) => {
    for(let i = 24; i < history_arr.length; i++) {
        let sum = 0;
        for(let j = 0; j < 25; j++) {
            sum += history_arr[i-24+j].close_price;
        }
        history_arr[i].ma25 = sum / 25;
    }

    return history_arr;
}

const calcDifferenceRate = (history_arr) => {
    for(let i = 24; i < history_arr.length; i++) {
        history_arr[i].difference_rate = ((history_arr[i].close_price / history_arr[i].ma25) - 1) * 100;
    }

    return history_arr;
}

module.exports = {
    getHistory: getHistory,
    transferObjToArr: transferObjToArr,
    calcMovingAverage25: calcMovingAverage25,
    calcDifferenceRate: calcDifferenceRate
}