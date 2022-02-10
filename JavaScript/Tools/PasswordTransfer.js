const axios = require('axios');
const code = "12.0:/#FAZ0JFzU9Gb5Qz%"
const data = JSON.stringify({
    "code": code
});
var config = {
    method: 'post',
    url: 'https://api.jds.codes/jd/jcommand',
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
            // const inviteId = jumpUrl.split('inviteId=')[-1].split('&mpin')[0].split('&encryptedPin')[0]
            // console.log("This inviteId is:\n" + inviteId)
    })
    .catch(function(err) {
        console.log(err);
    });