/* 
 *@authot:  Mol
 *@create: 2021-11-24-20/20-20
 */


var fishMan = new Date(),
    year = fishMan.getFullYear(),
    month = fishMan.getMonth() + 1,
    day = fishMan.getDate(),
    hour = fishMan.getHours();
var msg = ''

function headInfo() {
    var mae = ''
    if (hour >= 6 && hour < 12) {
        mae = '上午'
    } else if (hour >= 12 && hour < 18) {
        mae = '下午'
    } else if ((hour >= 18 && hour < 24) || hour < 6) {
        mae = '晚上'
    }
    let info = `【摸鱼办】
提醒您：${month }月${day}日${mae}好，摸鱼人！工作再累，一定不要忘记摸鱼哦！
有事没事起身去茶水间， 去厕所， 去廊道走走别老在工位上坐着， 钱是老板的, 但命是自己的!`
    msg += info
}

function weekend() {
    let item = fishMan.getDay()

    if (item > 0 && item <= 5) {
        item = 6 - item
        info = `\n距离周末还有${item}天\n`
    } else {
        info = `\n好好享受周末吧\n`
    }
    msg += info
}
var startDate = Date.parse(fishMan);
/**
 * @Created by Mol on 2021/12/29
 * @description 等待优化
 */

function festival([chinese, fmonth, fday]) {

    const newFestivalData = new Date(`${year},${fmonth},${fday}`)
    const newFestivalDataNext = new Date(`${year + 1},${fmonth},${fday}`)
    const endDate = Date.parse(newFestivalData);
    const endDateNext = Date.parse(newFestivalDataNext);
    const days = calculate(endDate) + 1
    const daysNext = calculate(endDateNext) + 1

    function calculate(endDate) {
        return Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
    }
    if (month == fmonth) {
        if (day == fday) {
            info = `今天就是${chinese}节，好好享受！\n`
        } else if (day < fday) {
            info = `距离${chinese}节还有${days}天\n`
        } else {
            info = `距离${chinese}节还有${daysNext}天\n`
        }
    } else if (month > fmonth) {
        info = `距离${chinese}节还有${daysNext}天\n`
    } else {
        info = `距离${chinese}节还有${days}天\n`
    }
    msg += info
}

function lastInfo() {
    let info = `上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快的渡过每一天…\n​`
    msg += info

}

function festivalAll() {
    let festivalList = [
        ['元旦', 1, 1],
        ['清明', 4, 5],
        ['劳动', 5, 1],
        ['国庆', 10, 1],



    ]
    const n = festivalList.length;
    for (let i = 0; i < n; i++) {
        festival(festivalList[i])
    }
}
(function () {
    headInfo()
    weekend()
    festivalAll()
    lastInfo()
    console.log(msg)
})()