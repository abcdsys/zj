const puppeteer = require('puppeteer');
const fs = require("fs");

/**
* @Created by Mol on 2022/03/19
* @description 提前建好log子文件夹
*/

(async () => {
    const browser = await puppeteer.launch({
        headless
            : true,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });
    const page = await browser.newPage();
    // await page.emulate(devices['iPhone X'])
    await page.goto('https://s.weibo.com/top/summary?cate=realtimehot');
    await page.waitForSelector("#pl_top_realtimehot > table > tbody > tr> td.td-02 > a")
    const hotText = await page.$$eval("#pl_top_realtimehot > table > tbody > tr> td.td-02 > a", ((a) => { return a.map(x => x.innerText) }))
    const hotHerf = await page.$$eval("#pl_top_realtimehot > table > tbody > tr> td.td-02 > a", ((a) => { return a.map(x => x.href) }))
    const heat = await page.$$eval("#pl_top_realtimehot > table > tbody > tr > td.td-02 > span", ((a) => { return a.map(x => x.innerText) }))
    let hotMessage = hotText.map((item, index) => ({
        title: item,
        herf: hotHerf[index],
        hot:heat[index-1]
    }))
    // console.log(hotMessage);

    dt = new Date();
    var y = dt.getFullYear();
    var mt = dt.getMonth() + 1;
    var day = dt.getDate();
    var h = dt.getHours(); //获取时
    var m = dt.getMinutes(); //获取分
    var s = dt.getSeconds(); //获取秒
    fs.writeFileSync(
        `${__dirname}/log/hotSearch-${`${y}年${mt} 月${day} 日${h} 时${m} 分${s} 秒`}.json`,
        JSON.stringify({ ...hotMessage }),
        "utf-8"
    );
    await browser.close();
})();



