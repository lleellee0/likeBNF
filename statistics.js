const calcCeilDifferenceRate = (history_arr) => {
    for(let i = 24; i < history_arr.length; i++) {
        history_arr[i].ceiled_difference_rate = Math.ceil(history_arr[i].difference_rate);
    }
    return history_arr;
}

module.exports = {
    calcCeilDifferenceRate: calcCeilDifferenceRate
}