const history = require('./history');
const statistics = require('./statistics');
const floor2Digits = require('./util').floor2Digits;
const express = require('express');
const app = express();

const target_profit = 3;

const kospi50_arr = [{name : 'KB금융', symbol : '43413'}, {name : 'KT', symbol : '43507'}, {name : 'KT&G', symbol : '43480'}, {name : 'LG', symbol : '43508'}, {name : 'LG Electronics', symbol : '43348'}, {name : 'LG디스플레이', symbol : '43463'}, {name : 'LG생활건강', symbol : '43521'}, {name : 'LG유플러스', symbol : '43492'}, {name : 'LG화학', symbol : '43424'}, {name : 'S-oil', symbol : '43473'}, {name : 'SK Telecom', symbol : '43472'}, {name : 'SK그룹', symbol : '43520'}, {name : 'SK이노베이션', symbol : '43404'}, {name : 'SK하이닉스', symbol : '43430'}, {name : 'Woori Financial', symbol : '1131302'}, {name : '강원랜드', symbol : '43422'}, {name : '고려아연', symbol : '43381'}, {name : '기아차', symbol : '43460'}, {name : '기업은행', symbol : '43542'}, {name : '네이버 주식회사', symbol : '43493'}, {name : '넷마블', symbol : '1010663'}, {name : '롯데쇼핑', symbol : '43383'}, {name : '롯데케미칼', symbol : '43374'}, {name : '삼성SDI', symbol : '43450'}, {name : '삼성물산', symbol : '43477'}, {name : '삼성바이오로직스', symbol : '993256'}, {name : '삼성생명', symbol : '43428'}, {name : '삼성에스디에스', symbol : '948394'}, {name : '삼성전기', symbol : '43350'}, {name : '삼성전자', symbol : '43433'}, {name : '삼성화재해상보험', symbol : '43370'}, {name : '셀트리온', symbol : '979618'}, {name : '신한지주', symbol : '43453'}, {name : '아모레G', symbol : '43443'}, {name : '아모레퍼시픽', symbol : '43416'}, {name : '엔씨소프트', symbol : '43448'}, {name : '이마트', symbol : '44089'}, {name : '카카오', symbol : '979247'}, {name : '코웨이', symbol : '43524'}, {name : '포스코', symbol : '43531'}, {name : '하나금융지주', symbol : '43378'}, {name : '한국전력', symbol : '43525'}, {name : '한국타이어', symbol : '44101'}, {name : '한미사이언스', symbol : '43783'}, {name : '현대건설', symbol : '43371'}, {name : '현대글로비스', symbol : '43379'}, {name : '현대모비스', symbol : '43398'}, {name : '현대제철', symbol : '43400'}, {name : '현대중공업', symbol : '43541'}, {name : '현대차', symbol : '43399'}];
const krx100_arr = [{name : 'BGF', symbol : '940988'}, {name : 'BNK 금융그룹', symbol : '43414'}, {name : 'CJ CGV', symbol : '43992'}, {name : 'CJ ENM', symbol : '979248'}, {name : 'CJ 그룹', symbol : '43499'}, {name : 'CJ대한통운', symbol : '43377'}, {name : 'CJ제일제당', symbol : '43376'}, {name : 'GKL', symbol : '44066'}, {name : 'GS 그룹', symbol : '43497'}, {name : 'GS리테일', symbol : '43751'}, {name : 'Hyundai Robotics', symbol : '1010641'}, {name : 'JYP Ent.', symbol : '979251'}, {name : 'KB금융', symbol : '43413'}, {name : 'KCC', symbol : '43537'}, {name : 'KT', symbol : '43507'}, {name : 'KT&G', symbol : '43480'}, {name : 'LG', symbol : '43508'}, {name : 'LG Electronics', symbol : '43348'}, {name : 'LG디스플레이', symbol : '43463'}, {name : 'LG생활건강', symbol : '43521'}, {name : 'LG유플러스', symbol : '43492'}, {name : 'LG이노텍', symbol : '43465'}, {name : 'LG화학', symbol : '43424'}, {name : 'Lotte', symbol : '43454'}, {name : 'OCI', symbol : '43469'}, {name : 'Posco Chemical', symbol : '979031'}, {name : 'S-oil', symbol : '43473'}, {name : 'SK Telecom', symbol : '43472'}, {name : 'SK그룹', symbol : '43520'}, {name : 'SK머티리얼즈', symbol : '979264'}, {name : 'SK이노베이션', symbol : '43404'}, {name : 'SK하이닉스', symbol : '43430'}, {name : 'Woori Financial', symbol : '1131302'}, {name : '강원랜드', symbol : '43422'}, {name : '고려아연', symbol : '43381'}, {name : '고영', symbol : '979813'}, {name : '금호석유', symbol : '43347'}, {name : '기아차', symbol : '43460'}, {name : '기업은행', symbol : '43542'}, {name : '네이버 주식회사', symbol : '43493'}, {name : '녹십자', symbol : '43503'}, {name : '농심', symbol : '43494'}, {name : '대림산업', symbol : '43456'}, {name : '대한 유화', symbol : '43533'}, {name : '동부화재', symbol : '43455'}, {name : '롯데케미칼', symbol : '43374'}, {name : '메디톡스', symbol : '979729'}, {name : '메리츠종금증권', symbol : '43775'}, {name : '미래에셋대우', symbol : '43441'}, {name : '삼성SDI', symbol : '43450'}, {name : '삼성물산', symbol : '43477'}, {name : '삼성생명', symbol : '43428'}, {name : '삼성에스디에스', symbol : '948394'}, {name : '삼성전기', symbol : '43350'}, {name : '삼성전자', symbol : '43433'}, {name : '삼성증권', symbol : '43407'}, {name : '삼성카드', symbol : '43427'}, {name : '삼성화재해상보험', symbol : '43370'}, {name : '셀트리온', symbol : '979618'}, {name : '신세계', symbol : '43484'}, {name : '신한지주', symbol : '43453'}, {name : '아모레G', symbol : '43443'}, {name : '아모레퍼시픽', symbol : '43416'}, {name : '에스에프에이', symbol : '979505'}, {name : '에스원', symbol : '43495'}, {name : '엔씨소프트', symbol : '43448'}, {name : '영원무역', symbol : '44065'}, {name : '오뚜기', symbol : '43518'}, {name : '오리온', symbol : '1031094'}, {name : '유한양행', symbol : '43532'}, {name : '이마트', symbol : '44089'}, {name : '제일기획', symbol : '43352'}, {name : '카카오', symbol : '979247'}, {name : '컴투스', symbol : '979666'}, {name : '코스맥스', symbol : '940989'}, {name : '코웨이', symbol : '43524'}, {name : '키움증권', symbol : '43955'}, {name : '포스코', symbol : '43531'}, {name : '포스코 대우', symbol : '43535'}, {name : '하나금융지주', symbol : '43378'}, {name : '한국전력', symbol : '43525'}, {name : '한국콜마', symbol : '44102'}, {name : '한국타이어', symbol : '44101'}, {name : '한국투자금융지주', symbol : '43540'}, {name : '한국항공우주', symbol : '43962'}, {name : '한미사이언스', symbol : '43783'}, {name : '한미약품', symbol : '43440'}, {name : '한샘', symbol : '43791'}, {name : '한온시스템', symbol : '43346'}, {name : '한전KPS', symbol : '43964'}, {name : '한화케미칼', symbol : '43457'}, {name : '현대건설', symbol : '43371'}, {name : '현대글로비스', symbol : '43379'}, {name : '현대모비스', symbol : '43398'}, {name : '현대백화점', symbol : '43372'}, {name : '현대제철', symbol : '43400'}, {name : '현대중공업', symbol : '43541'}, {name : '현대차', symbol : '43399'}, {name : '현대해상', symbol : '43590'}, {name : '효성', symbol : '43506'}];
const kb_kstar_etf_arr = [{name : 'KB KSTAR KOSPI 200', symbol : '953389'}, {name : 'KB KSTAR Short-term MSB', symbol : '953392'}, {name : 'KB KBSTAR KOSDAQ150 ETF', symbol : '1031343'}, {name : 'KB KBSTAR Short-term KTB Active', symbol : '1031354'}, {name : 'KB KBSTAR KRX300', symbol : '1073393'}, {name : 'KB KSTAR Credit Bond', symbol : '953382'}, {name : 'KB KBSTAR F-KOSDAQ150 Inverse', symbol : '1031351'}, {name : 'KB KSTAR Top5 Group', symbol : '953394'}, {name : 'KB KBSTAR Mid Small Cap High Dividend', symbol : '1055055'}, {name : 'KB KBSTAR 200 Heavy Industries', symbol : '1056438'}, {name : 'KB KSTAR Korea Treasury Bond', symbol : '953387'}, {name : 'KB KBSTAR 200 Constructions', symbol : '1057214'}, {name : 'KB KSTAR Prime Industry', symbol : '953391'}, {name : 'KB KBSTAR 200 Energy & Chemicals', symbol : '1056436'}, {name : 'KB KBSTAR 200 Steels & Materials', symbol : '1056439'}, {name : 'KB KSTAR Fixed Income Balanced-Derivatives', symbol : '953385'}, {name : 'KB KBSTAR High Dividend', symbol : '1014024'}, {name : 'KB KBSTAR KTB 10Y Futures', symbol : '1077028'}, {name : 'KB KSTAR Exporter Equity', symbol : '953384'}, {name : 'KB KBSTAR KQ High Dividend', symbol : '1031346'}, {name : 'KB KBSTAR Holding Company', symbol : '1056174'}, {name : 'KB KBSTAR 200 Information Technology', symbol : '1056437'}, {name : 'KB KBSTAR 200 Consumer Staples', symbol : '1057215'}, {name : 'KB KBStar Game Industry', symbol : '1089768'}, {name : 'KB KBSTAR 200 Industrials', symbol : '1057213'}, {name : 'KB KBSTAR KTB 3Y Futures Inverse', symbol : '1055118'}, {name : 'KB KBSTAR KTB 10Y Futures Inverse', symbol : '1077031'}, {name : 'KB KSTAR Equity Balanced Equity-Derivatives ', symbol : '953383'}, {name : 'KB KBStar KOSPI', symbol : '1089767'}, {name : 'KB KBSTAR KQ Momentum Value', symbol : '1089538'}, {name : 'KB KBSTAR Mid-Small Cap Momentum LowVol', symbol : '1089537'}, {name : 'KB KBSTAR Mid-Small Cap Momentum Value', symbol : '1089536'}, {name : 'KB KBSTAR KQ Momentum LowVol', symbol : '1089535'}, {name : 'KB KBSTAR ESG SRI', symbol : '1072257'}, {name : 'KB KBSTAR 200 Financials', symbol : '1056435'}, {name : 'KB KBSTAR 200 Consumer Discretionary', symbol : '1057216'}, {name : 'KB KBSTAR China H Futures Inverse', symbol : '1073352'}, {name : 'KB KSTAR Japan Leverage (H)', symbol : '953386'}, {name : 'KB KSTAR Synth-US Oil Gas EP Compa', symbol : '956468'}, {name : 'KB KBSTAR China H-Share Hedged', symbol : '997384'}, {name : 'KB KBSTAR US Treasury Long Bond Futures', symbol : '1014032'}, {name : 'KB KBSTAR US Treasury Long Bond Futures Inverse', symbol : '1014033'}, {name : 'KB KBSTAR US Treasury Long Bond Futures Leverage S', symbol : '1014034'}, {name : 'KB KBSTAR US Treasury Long Bond Futures Inverse 2X', symbol : '1014035'}, {name : 'KB KSTAR China Mainland CSI100 Feeder', symbol : '953381'}];

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

const main = async (stocks_arr) => {
    let issue_obj_arr = [];

    for(let i = 0; i < stocks_arr.length; i++) {
        issue_obj_arr.push(await getIssueObject(stocks_arr[i].name, stocks_arr[i].symbol, '1245660137'));
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
    main(stocks_arr);
}

app.get('/', (req, res) => {
    res.send(`${date}에 최신화되었습니다.<br>아래 데이터들은 괴리율을 기준으로 오름차순 정렬되어있습니다.<br>` + webString);
});
const server = app.listen(3000, () => { 
    console.log('Server is running!');
});


main(krx100_arr);