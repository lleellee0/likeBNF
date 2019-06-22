const history = require('./history');
const statistics = require('./statistics');
const floor2Digits = require('./util').floor2Digits;
const express = require('express');
const app = express();

const target_profit = 3;

const kospi50_arr = [{name : 'KB금융', symbol : '43413'}, {name : 'KT', symbol : '43507'}, {name : 'KT&G', symbol : '43480'}, {name : 'LG', symbol : '43508'}, {name : 'LG Electronics', symbol : '43348'}, {name : 'LG디스플레이', symbol : '43463'}, {name : 'LG생활건강', symbol : '43521'}, {name : 'LG유플러스', symbol : '43492'}, {name : 'LG화학', symbol : '43424'}, {name : 'S-oil', symbol : '43473'}, {name : 'SK Telecom', symbol : '43472'}, {name : 'SK그룹', symbol : '43520'}, {name : 'SK이노베이션', symbol : '43404'}, {name : 'SK하이닉스', symbol : '43430'}, {name : 'Woori Financial', symbol : '1131302'}, {name : '강원랜드', symbol : '43422'}, {name : '고려아연', symbol : '43381'}, {name : '기아차', symbol : '43460'}, {name : '기업은행', symbol : '43542'}, {name : '네이버 주식회사', symbol : '43493'}, {name : '넷마블', symbol : '1010663'}, {name : '롯데쇼핑', symbol : '43383'}, {name : '롯데케미칼', symbol : '43374'}, {name : '삼성SDI', symbol : '43450'}, {name : '삼성물산', symbol : '43477'}, {name : '삼성바이오로직스', symbol : '993256'}, {name : '삼성생명', symbol : '43428'}, {name : '삼성에스디에스', symbol : '948394'}, {name : '삼성전기', symbol : '43350'}, {name : '삼성전자', symbol : '43433'}, {name : '삼성화재해상보험', symbol : '43370'}, {name : '셀트리온', symbol : '979618'}, {name : '신한지주', symbol : '43453'}, {name : '아모레G', symbol : '43443'}, {name : '아모레퍼시픽', symbol : '43416'}, {name : '엔씨소프트', symbol : '43448'}, {name : '이마트', symbol : '44089'}, {name : '카카오', symbol : '979247'}, {name : '코웨이', symbol : '43524'}, {name : '포스코', symbol : '43531'}, {name : '하나금융지주', symbol : '43378'}, {name : '한국전력', symbol : '43525'}, {name : '한국타이어', symbol : '44101'}, {name : '한미사이언스', symbol : '43783'}, {name : '현대건설', symbol : '43371'}, {name : '현대글로비스', symbol : '43379'}, {name : '현대모비스', symbol : '43398'}, {name : '현대제철', symbol : '43400'}, {name : '현대중공업', symbol : '43541'}, {name : '현대차', symbol : '43399'}];

let webString = "데이터 준비중입니다.";
let date = new Date();

const getIssueObject = async (name, symbol, from_time) => {
    return new Promise(async (resolve, reject) => {
        let history_obj = await history.getHistory(symbol, from_time, Date.now());
        let history_arr = history.transferObjToArr(history_obj);
        history_arr = history.calcMovingAverage25(history_arr);
        history_arr = history.calcDifferenceRate(history_arr);

        history_arr = statistics.calcCeilDifferenceRate(history_arr);
        
        let issue_obj = {};
        
        issue_obj.name = name;
        issue_obj.price = history_arr[history_arr.length-1].close_price;
        issue_obj.ma25 = history_arr[history_arr.length-1].ma25;
        issue_obj.difference_rate = history_arr[history_arr.length-1].difference_rate;
        issue_obj.ceiled_difference_rate = history_arr[history_arr.length-1].ceiled_difference_rate;
        issue_obj.in_3_days = statistics.calcNdaySuccessRate(history_arr, 3, target_profit);
        issue_obj.in_3_days.profit_rate = statistics.calcNdayProfitRate(history_arr, 3);
        issue_obj.in_5_days = statistics.calcNdaySuccessRate(history_arr, 5, target_profit);
        issue_obj.in_5_days.profit_rate = statistics.calcNdayProfitRate(history_arr, 5);
        issue_obj.in_7_days = statistics.calcNdaySuccessRate(history_arr, 7, target_profit);
        issue_obj.in_7_days.profit_rate = statistics.calcNdayProfitRate(history_arr, 7);

        console.log(`종목/괴리율: ${issue_obj.name}/${floor2Digits(issue_obj.difference_rate)}%`);

        resolve(issue_obj);
    });
}

const main = async () => {
    let issue_obj_arr = [];

    for(let i = 0; i < kospi50_arr.length; i++) {
        issue_obj_arr.push(await getIssueObject(kospi50_arr[i].name, kospi50_arr[i].symbol, '1245660137'));
    }

    issue_obj_arr.sort((a, b) => {
        return a.difference_rate - b.difference_rate;
    })



    for(let i = 0; i < issue_obj_arr.length; i++) {
        let issue_obj = issue_obj_arr[i];
        console.log(`종목                : ${issue_obj.name}`);
        console.log(`현재가격           : ${issue_obj.price}`);
        console.log(`25일이동평균가격    : ${issue_obj.ma25}`);
        console.log(`현재괴리율         : ${floor2Digits(issue_obj.difference_rate)}%`);
        console.log(`3일내 ${target_profit}%상승    : ${issue_obj.in_3_days.success_count}%(+${floor2Digits(issue_obj.in_3_days.profit_rate)}%)`);
        console.log(`5일내 ${target_profit}%상승    : ${issue_obj.in_5_days.success_count}%(+${floor2Digits(issue_obj.in_5_days.profit_rate)}%)`);
        console.log(`7일내 ${target_profit}%상승    : ${issue_obj.in_7_days.success_count}%(+${floor2Digits(issue_obj.in_7_days.profit_rate)}%)`);

        webString += `종목                : ${issue_obj.name}<br>`;
        webString += `현재가격           : ${issue_obj.price}<br>`;
        webString += `25일이동평균가격    : ${issue_obj.ma25}<br>`;
        webString += `현재괴리율         : ${floor2Digits(issue_obj.difference_rate)}%<br>`;
        webString += `3일내 ${target_profit}%상승    : ${issue_obj.in_3_days.success_count}%(+${floor2Digits(issue_obj.in_3_days.profit_rate)}%)<br>`;
        webString += `5일내 ${target_profit}%상승    : ${issue_obj.in_5_days.success_count}%(+${floor2Digits(issue_obj.in_5_days.profit_rate)}%)<br>`;
        webString += `7일내 ${target_profit}%상승    : ${issue_obj.in_7_days.success_count}%(+${floor2Digits(issue_obj.in_7_days.profit_rate)}%)<br><br>`;

    }
    console.log(webString);
    date = new Date();
    main();
}

app.get('/', (req, res) => {
    res.send(`${date}에 최신화되었습니다.<br>아래 데이터들은 괴리율을 기준으로 오름차순 정렬되어있습니다.<br>` + webString);
});
const server = app.listen(3000, () => { 
    console.log('Server is running!');
});


main();
