/* 
 *@authot:  Mol
 *@create: 2021-11-24-20/20-20
 */


var fishMan = new Date()
var year = fishMan.getFullYear()
var month = fishMan.getMonth();
var day = fishMan.getDate();
var hour = fishMan.getHours()

function headInfo() {
    var mae = ''
    if (hour >= 6 && hour < 12) {
        mae = '上午'
    } else if (hour >= 12 && hour < 18) {
        mae = '下午'
    } else if ((hour >= 18 && hour < 24) || hour < 6) {
        mae = '晚上'
    }
    let data = `【摸鱼办】
提醒您：${month + 1}月${day}日${mae}好，摸鱼人！工作再累，一定不要忘记摸鱼哦！
有事没事起身去茶水间，去厕所，去廊道走走别老在工位上坐着，钱是老板的,但命是自己的!`
    console.log(data)
    return data
}

function weekend() {
    let item = fishMan.getDay()
    let data = ``
    if (item > 0 && item <= 5) {
        item = 6 - item
        data = `距离周末还有${item}天`
    } else {
        data = '好好享受周末吧'
    }
    console.log(data)
    return data
}
var startDate = Date.parse(fishMan);

function festival(chinese, fmonth, fday) {
    let info = ``
    let newfestival = new Date(`${year + 1},${fmonth},${fday}`)
    let endDate = Date.parse(newfestival);
    let days = Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
    if (month == fmonth && day == fday) {
        info = `今天就是${chinese}节，好好享受！`
    } else {
        info = `距离${chinese}节还有${days}天`
    }
    console.log(info)
    return info
}

function lastInfo() {
    let info = `上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快的渡过每一天…​`
    console.log(info)
    return info
}


function main() {
    headInfo()
    weekend()
    festival('元旦', 1, 1)
    festival('清明', 4, 4)
    festival('国庆', 10, 1)
    lastInfo()
}
main()