const calcCeilDifferenceRate = (history_arr) => {
    for(let i = 24; i < history_arr.length; i++) {
        history_arr[i].ceiled_difference_rate = Math.ceil(history_arr[i].difference_rate);
    }
    return history_arr;
}

const calcNdaySuccessRate = (history_arr, days, target_profit) => {
    let current_history_obj = history_arr[history_arr.length-1];
    let success_count = 0;
    let fail_count = 0;
    for(let i = 24; i < history_arr.length - days; i++) {
        let success_flag = false;
        // history_arr을 순회하면서 같은 괴리율을 가지는 것으로 비교를 한다.
        if(history_arr[i].ceiled_difference_rate === current_history_obj.ceiled_difference_rate) {
            for(let j = 1; j <= days; j++) {
                if(history_arr[i+j].high_price > history_arr[i].close_price * (100 + target_profit) / 100) {
                    success_flag = true;
                    j = 999999999;  // 내부 for문 종료
                }
            }
            if(success_flag === true)   success_count++;
            else    fail_count++;
        }
    }

    let obj = {};
    obj.success_count = success_count;
    obj.fail_count = fail_count;
    obj.success_rate = success_count / (success_count + fail_count) * 100;
    return obj;
}

const calcNdayProfitRate = (history_arr, days) => {

}

module.exports = {
    calcCeilDifferenceRate: calcCeilDifferenceRate,
    calcNdaySuccessRate: calcNdaySuccessRate
}