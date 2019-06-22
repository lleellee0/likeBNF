const history = require('./history');
const statistics = require('./statistics');

const target_profit = 3;

const main = async () => {
    let history_obj = await history.getHistory('43430', '1361192945', Date.now());
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
    // issue_obj.in_3_days_profit_rate = calcNdayProfitRate(history_arr, 3);
    issue_obj.in_5_days = statistics.calcNdaySuccessRate(history_arr, 5, target_profit);
    // issue_obj.in_5_days_profit_rate = calcNdayProfitRate(history_arr, 5);
    issue_obj.in_7_days = statistics.calcNdaySuccessRate(history_arr, 7, target_profit);
    // issue_obj.in_7_days_profit_rate = calcNdayProfitRate(history_arr, 7);

    console.log(issue_obj);

    console.log(history_arr[history_arr.length-1]);
    console.log('history_arr 길이 : ' + history_arr.length);
}

main();