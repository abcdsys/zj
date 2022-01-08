const axios = require('axios');
const code = "28:/#3BytY2Ww5aAFK%扌丁kai鶁崠，そ幫我助力ひ赚赏金"
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
    .then( (data) =>{
        data = JSON.parse(data);
        jumpUrl = data['data']['jumpUrl']
        // console.log(jumpUrl)
        let inviteId = jumpUrl.match(/inviteId=(\S*?)&/)[1]
        console.log(inviteId)
        
    })
    .catch(function (err) {
        console.log(err);
    });