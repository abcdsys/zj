const axios = require('axios');
const readlineSync = require('readline-sync');

const code = readlineSync.question('May I have your name? ');

const data = JSON.stringify({
    "code": code
});
var config = {
    method: 'post',
    url: 'https://api.jds.codes/jCommand',
    headers: {
        'Content-Type': 'application/json'
    },
    data: data
};

axios(config)
    .then((resp) => {
        // console.log(JSON.stringify(resp.data));
        const jumpUrl = resp.data['data']['jumpUrl']
        console.log(jumpUrl)
        // const emreg = /(?<=&inviteId=).*(?=&mpin)/g;
        const emreg = /(?<=inviteId=).*(?=&encryptedPin=)/g;    //城城
        console.log("This inviteId is:\n" + emreg.exec(jumpUrl))
    })
    .catch(function (err) {
        console.log(err);
    });