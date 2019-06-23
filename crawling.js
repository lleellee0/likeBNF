const request = require('request');
const querySelectorAll = require('query-selector');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


// 코스피 200 : https://kr.investing.com/equities/StocksFilter?noconstruct=1&smlID=694&sid=&tabletype=price&index_id=37427
// 코스피 100 : https://kr.investing.com/equities/StocksFilter?noconstruct=1&smlID=694&sid=&tabletype=price&index_id=49660
// 코스피 50  : https://kr.investing.com/equities/StocksFilter?noconstruct=1&smlID=694&sid=&tabletype=price&index_id=49661

const headers = {
    accept: '*/*',
    acceptEncoding: 'gzip, deflate, br',
    acceptLanguage: 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,da;q=0.6',
    connection: 'keep-alive',
    cookie: 'G_AUTHUSER_H=0; adBlockerNewUserDomains=1557756359; _ga=GA1.2.1083946380.1557756364; __gads=ID=22bc1026098bdf5c:T=1557756361:S=ALNI_MYEyNYFma5wiVvidO7annDofRstvw; G_ENABLED_IDPS=google; _fbp=fb.1.1557756364566.722489930; __qca=P0-66211956-1557756364678; r_p_s_n=1; PHPSESSID=o6lrfhnvgt4rdrvs2bjkcio5i3; StickySession=id.91664825673.887kr.investing.com; SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1; isUserNoticedNewAlertPopup=1; _gid=GA1.2.984489773.1561190629; comment_notification_206754905=1; geoC=KR; G_AUTHUSER_H=0; gtmFired=OK; SideBlockUser=a%3A2%3A%7Bs%3A10%3A%22stack_size%22%3Ba%3A1%3A%7Bs%3A11%3A%22last_quotes%22%3Bi%3A8%3B%7Ds%3A6%3A%22stacks%22%3Ba%3A1%3A%7Bs%3A11%3A%22last_quotes%22%3Ba%3A8%3A%7Bi%3A0%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A7%3A%221097319%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A21%3A%22%2Findices%2Fkospi-50-ewi%22%3B%7Di%3A1%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A6%3A%22953520%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A28%3A%22%2Fetfs%2Fubs-hana-ktop-kospi-50%22%3B%7Di%3A2%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A6%3A%22953374%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A28%3A%22%2Fetfs%2Fhanwha-arirang-kospi50%22%3B%7Di%3A3%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A6%3A%22956486%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A37%3A%22%2Findices%2Finvesting.com-south-korea-50%22%3B%7Di%3A4%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A5%3A%2237427%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A18%3A%22%2Findices%2Fkospi-200%22%3B%7Di%3A5%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A5%3A%2243430%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A22%3A%22%2Fequities%2Fsk-hynix-inc%22%3B%7Di%3A6%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A5%3A%2244107%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A19%3A%22%2Fequities%2Fhanjinkal%22%3B%7Di%3A7%3Ba%3A3%3A%7Bs%3A7%3A%22pair_ID%22%3Bs%3A7%3A%221055949%22%3Bs%3A10%3A%22pair_title%22%3Bs%3A0%3A%22%22%3Bs%3A9%3A%22pair_link%22%3Bs%3A31%3A%22%2Fcrypto%2Fbitcoin%2Fbitcoin-futures%22%3B%7D%7D%7D%7D; UserReactions=true; billboardCounter_18=1; nyxDorf=Z2M1YmEpZTxjNDspNG5hYTV6Yj4wMA%3D%3D; ses_id=OXdhIGNsPzc%2Fe25oZTQ3NTNkMGxhY2ZgPDRlZmFjNyEwJDM9YTZkImVqPnBvbDMvYzE0PDBnYTM1Yzc7YDNhZzk5YWZjMz9qP2puZWVgNzczZDBvYTBmZTxvZTNhZjc%2BMGMzZGE1ZGFlZD5hb2czaWNxNCgwdGFwNWc3Z2AhYSY5NmEgYzA%2FNz9pbjdlMjc9M2MwamFjZjc8bGVnYTM3LzB7',
    host: 'kr.investing.com',
    referer: 'https://kr.investing.com/equities/south-korea',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    xRequestedWith: 'XMLHttpRequest'
}

const getNamesAndSymbols = (url) => {
    return new Promise((resolve, reject) => {
        request({uri: url, headers: headers}, function (error, response, body) {
            if(error) {
                console.log('error:', error);
                return;
            }
            console.log(body);
            let document = new JSDOM(body);
            document = document.window.document;

            let name_and_symbol_array = [];

            let name_dom_arr = document.querySelectorAll ('#marketInnerContent .plusIconTd a');
            for(let i = 0; i < name_dom_arr.length; i++)
                name_and_symbol_array.push({name:name_dom_arr[i].innerText});
            
            
            let symbol_dom_arr = document.querySelectorAll ('#marketInnerContent .plusIconTd span');
            for(let i = 0; i < symbol_dom_arr.length; i++)
                name_and_symbol_array[i].symbol = symbol_dom_arr[i].getAttribute('data-id');
            
            resolve(name_and_symbol_array);
        });
    });
}

const a = async () => {
    console.log(await getNamesAndSymbols('https://kr.investing.com/equities/south-korea'));
}

a();

module.exports = {
    getNamesAndSymbols: getNamesAndSymbols
}

// 위에 있는 코드로 시도해봤으나 잘안됨. 아래같이 뜨면서 ㅎ
// <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
// <html><head>
// <title>403 Forbidden</title>
// </head><body>
// <h1>Forbidden</h1>
// <p>You don't have permission to access /equities/south-korea
// on this server.</p>
// <hr>
// <address>Apache/2.4.6 (CentOS) Server at kr.investing.com Port 80</address>
// </body></html>


// 그래서 아래 코드로 텍스트를 만들어버렸음.

let name_and_symbol_array = [];

let name_dom_arr = document.querySelectorAll ('#marketInnerContent .plusIconTd a');
for(let i = 0; i < name_dom_arr.length; i++)
    name_and_symbol_array.push({name:name_dom_arr[i].innerText});


let symbol_dom_arr = document.querySelectorAll ('#marketInnerContent .plusIconTd span');
for(let i = 0; i < symbol_dom_arr.length; i++)
    name_and_symbol_array[i].symbol = symbol_dom_arr[i].getAttribute('data-id');

let text = "";
text += "[";
for(let i = 0; i < name_and_symbol_array.length; i++) {
    text += "{";
    text += "name : '";
    text += name_and_symbol_array[i].name;
    text += "'";
    text += ", ";
    text += "symbol : '";
    text += name_and_symbol_array[i].symbol;
    text += "'";
    text += "}";
    text += ", ";
}
text += "]";

// ETF를 긁어오기 위해서는 아래 코드 사용
let name_and_symbol_array = [];

let name_dom_arr = document.querySelectorAll ('#etfs .plusIconTd a');
for(let i = 0; i < name_dom_arr.length; i++)
    name_and_symbol_array.push({name:name_dom_arr[i].innerText});


let symbol_dom_arr = document.querySelectorAll ('#etfs .plusIconTd span');
for(let i = 0; i < symbol_dom_arr.length; i++)
    name_and_symbol_array[i].symbol = symbol_dom_arr[i].getAttribute('data-id');

let text = "";
text += "[";
for(let i = 0; i < name_and_symbol_array.length; i++) {
    text += "{";
    text += "name : '";
    text += name_and_symbol_array[i].name;
    text += "'";
    text += ", ";
    text += "symbol : '";
    text += name_and_symbol_array[i].symbol;
    text += "'";
    text += "}";
    text += ", ";
}
text += "]";