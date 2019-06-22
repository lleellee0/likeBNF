const history = require('./history');
const statistics = require('./statistics');
const floor2Digits = require('./util').floor2Digits;

const target_profit = 3;

const main = async () => {
    let history_obj = await history.getHistory('43430', '1245660137', Date.now());
    let history_arr = history.transferObjToArr(history_obj);
    history_arr = history.calcMovingAverage25(history_arr);
    history_arr = history.calcDifferenceRate(history_arr);

    history_arr = statistics.calcCeilDifferenceRate(history_arr);
    
    let issue_obj = {};
    
    issue_obj.name = 'SK Hynix Inc';
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

    console.log(`종목                : ${issue_obj.name}`);
    console.log(`현재가격           : ${issue_obj.price}`);
    console.log(`25일이동평균가격    : ${issue_obj.ma25}`);
    console.log(`현재괴리율         : ${floor2Digits(issue_obj.difference_rate)}%`);
    console.log(`3일내 ${target_profit}%상승    : ${issue_obj.in_3_days.success_count}%(${floor2Digits(issue_obj.in_3_days.profit_rate)}%)`);
    console.log(`5일내 ${target_profit}%상승    : ${issue_obj.in_5_days.success_count}%(${floor2Digits(issue_obj.in_5_days.profit_rate)}%)`);
    console.log(`7일내 ${target_profit}%상승    : ${issue_obj.in_7_days.success_count}%(${floor2Digits(issue_obj.in_7_days.profit_rate)}%)`);
}

main();