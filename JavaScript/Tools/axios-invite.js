const axios = require('axios');
const code = "12.0:/#FAZ0JFzU9Gb5Qz%"
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