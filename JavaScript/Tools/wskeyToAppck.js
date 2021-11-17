const axios = require('axios')
const request = require("request");
const express = require("express");
const app = express()

const port = 6900
app.listen(port, () => {
    console.log(`server listening at https://locallhost:${port}`);
})


var sv, st, uuid, sign = ''
var tokenKey = ''
var appck = ''
app.post('/toappck', (req, res) => {
    if (req.body['key'] == true) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var wskey = req.headers['wskey'];
        async function getSign() {
            // console.log(wskey)
            return new Promise((resolve, reject) => {
                config = {
                    method: 'get',
                    url: 'https://hellodns.coding.net/p/sign/d/jsign/git/raw/master/sign',
                }
                axios(config).then((resp) => {
                        sign_list = resp['data'] //返回的是json格式
                        // console.log(sign_list)
                        sv = sign_list['sv']
                        st = sign_list['st']
                        uuid = sign_list['uuid']
                        sign = sign_list['sign']
                        resolve(sv, st, uuid, sign)
                    })
                    .catch((err) => {
                        reject(err);
                    });
            })
        }

        async function getTokenKey() {
            return new Promise((resolve, rejects) => {
                let config = {
                    method: 'post',
                    headers: {
                        'cookie': wskey,
                        // 'cookie':wskey,
                        'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'charset': 'UTF-8',
                        'accept-encoding': 'br,gzip,deflate'
                    },
                    params: {
                        'functionId': 'genToken',
                        'clientVersion': '10.1.2',
                        'client': 'android',
                        'uuid': uuid,
                        'st': st,
                        'sign': sign,
                        'sv': sv
                    },
                    url: 'https://api.m.jd.com/client.action',
                    data: 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fplogin.m.jd.com%252Fcgi-bin%252Fm%252Fthirdapp_auth_page%253Ftoken%253DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%2526client_type%253Dandroid%2526appid%253D879%2526appup_type%253D1%22%7D&'
                }
                axios(config).then((resp) => {
                        // console.log(config.url)
                        tokenKey = resp['data']['tokenKey']
                        resolve(tokenKey)
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });
        }

        async function appjmp() {
            return new Promise((resolve, rejects) => {
                const options = {
                    method: 'get',
                    followRedirect: false,
                    headers: {
                        "User-Agent": "okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;",
                        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
                    },
                    url: `https://un.m.jd.com/cgi-bin/app/appjmp?tokenKey=${tokenKey}&to=https://plogin.m.jd.com/cgi-bin/m/thirdapp_auth_page?token=AAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg&client_type=android&appid=879&appup_type=1`,
                };
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 302) {
                        options.headers.cookie = response.headers['set-cookie'][0];
                        request(options, function (error, resp, body) {
                            let appkey = resp.headers['set-cookie'][0].split(";")[0] + ";"
                            let pin = resp.headers['set-cookie'][1].split(";")[0] + ";"
                            appck = appkey + pin
                            console.log(appck)
                            resolve(appck)
                        });
                    } else {
                        console.log(response);
                    }
                });
            })
        }
        async function main() {
            await getSign()
            await getTokenKey()
            await appjmp()
        }
        main()
        res.send(appck);
    } else {
        return false
    }
})