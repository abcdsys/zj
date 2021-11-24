/* 
 *@authot:  Mol
 *create: 2021-11-24-20点20分
 */


var fishMan = new Date()
var year = fishMan.getFullYear()
var month = fishMan.getMonth();
var d = fishMan.getDate();
var h = fishMan.getHours()
// console.log(`${month}///${d}`)

function headInfo() {
    var mae = ''
    if (h >= 6 && h < 12) {
        mae = '上午'
    } else if (h >= 12 && h < 18) {
        mae = '下午'
    } else if ((h >= 18 && h < 24) || h < 6) {
        mae = '晚上'
    }
    console.log(`【摸鱼办】
提醒您：${month + 1}月${d}日${mae}好，摸鱼人！工作再累，一定不要忘记摸鱼哦！有事没事起身去茶水间，去厕所，去廊道走走别老在工位上坐着，钱是老板的,但命是自己的`)
}
var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let getWeekDay = fishMan.getDay()
let nowweekday = weekday[getWeekDay]

function weekend(item) {
    if (item > 0 && item < 5) {
        item = 5 - item
        console.log(`距离周末还有${item}天`)
    } else {
        console.log('好好享受周末吧')
    }
}

function newYearSDay() {
    var nextNewYearDay = new Date(`${year + 1}`)
    var startDate = Date.parse(fishMan);
    var endDate = Date.parse(nextNewYearDay);
    var days = Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
    if (month + d !== 1) {
        console.log(`距离元旦还有${days}天`)
    } else {
        console.log(`今天就是元旦`)
    }
    return days
}

function chingMingFestival() {
    let nextChingMingFestival = new Date(`${year + 1},3,4`)
    let startDate = Date.parse(fishMan);
    let endDate = Date.parse(nextChingMingFestival);
    let days = Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
    if (month !== 3 && d !== 4) {
        console.log(`距离清明节还有${days}天`)
    } else {
        console.log(`今天就是清明节`)
    }
    return days
}




function lastInfo() {
    console.log(`上班是帮老板赚钱，摸鱼是赚老板的钱！最后，祝愿天下所有摸鱼人，都能愉快的渡过每一天…​`)
}




function getOneSpeech() {
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);
            console.log(myObj)
        }
    };
    xmlhttp.open("GET", "https://v1.hitokoto.cn/", true);
    xmlhttp.send();

}
// getOneSpeech()

function main() {
    headInfo();
    weekend(getWeekDay);
    newYearSDay()
    chingMingFestival()
    lastInfo()
}
main()