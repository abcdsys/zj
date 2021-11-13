# 解密Zy143L的wskey转换脚本
# 删除boom方法
# 调用ddo的获取sign的云接口
# 参考皮卡丘的相关代码，加入通知服务，wskey过期自动通知

# 此版本是我认为市面上相对安全的版本，可以放心使用。建议自用，勿传播。

import base64
import http.client
import json
import datetime
import os
import re
import sys
from urllib.parse import quote, unquote
try:
    import requests
except Exception as e:
    print(e, "\n缺少requests模块, 请执行命令：pip3 install requests\n")
    sys.exit(1)
os.environ['no_proxy'] = '*'
requests.packages.urllib3.disable_warnings()

# Env环境设置 通知服务
# export BARK=''                   # bark服务,苹果商店自行搜索;
# export SCKEY=''                  # Server酱的SCKEY;
# export TG_BOT_TOKEN=''           # tg机器人的TG_BOT_TOKEN;
# export TG_USER_ID=''             # tg机器人的TG_USER_ID;
# export TG_API_HOST=''            # tg 代理api
# export TG_PROXY_IP=''            # tg机器人的TG_PROXY_IP;
# export TG_PROXY_PORT=''          # tg机器人的TG_PROXY_PORT;
# export DD_BOT_ACCESS_TOKEN=''    # 钉钉机器人的DD_BOT_ACCESS_TOKEN;
# export DD_BOT_SECRET=''          # 钉钉机器人的DD_BOT_SECRET;
# export QQ_SKEY=''                # qq机器人的QQ_SKEY;
# export QQ_MODE=''                # qq机器人的QQ_MODE;
# export QYWX_AM=''                # 企业微信；http://note.youdao.com/s/HMiudGkb
# export PUSH_PLUS_TOKEN=''        # 微信推送Plus+ ；

# 获取通知模块
message_info = ''''''

def println(s):
    print("[{0}]: {1}".format(
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), s))
    sys.stdout.flush()

def message(str_msg):
    global message_info
    print(str_msg)
    message_info = "{}\n{}".format(message_info, str_msg)
    sys.stdout.flush()


def getsendNotify(a=0):
    # if a == 0:
    #     a += 1
    # try:
    #     url = 'https://gitee.com/curtinlv/Public/raw/master/sendNotify.py'
    #     response = requests.get(url)
    #     if 'main' in response.text:
    #         with open('sendNotify.py', "w+", encoding="utf-8") as f:
    #             f.write(response.text)
    #     else:
    #         if a < 5:
    #             a += 1
    #             return getsendNotify(a)
    #         else:
    #             pass
    # except:
    #     if a < 5:
    #         a += 1
    #         return getsendNotify(a)
    #     else:
    #         pass
    url = 'https://gitee.com/curtinlv/Public/raw/master/sendNotify.py'
    response = requests.get(url)
    if 'main' in response.text:
        with open('sendNotify.py', "w+", encoding="utf-8") as f:
            f.write(response.text)


cur_path = os.path.abspath(os.path.dirname(__file__))
sys.path.append(cur_path)
if os.path.exists(cur_path + "/sendNotify.py"):
    from sendNotify import send
else:
    getsendNotify()
    from sendNotify import send
###################


def ql_login():
    path = '/ql/config/auth.json'
    if os.path.isfile(path):
        with open(path, "r")as file:
            auth = file.read()
            file.close()
        auth = json.loads(auth)
        username = auth["username"]
        password = auth["password"]
        token = auth["token"]
        if token == '':
            url = "http://127.0.0.1:5700/api/login"
            payload = {"username": username, "password": password}
            headers = {'Content-Type': 'application/json'}
            res = requests.post(url=url, headers=headers,
                                data=payload, verify=False)
            token = json.loads(res.text)['token']
            return token
        else:
            return token
    else:
        println("没有发现auth文件, 你这是青龙吗???")
        sys.exit(0)


def get_wskey():
    if "JD_WSCK" in os.environ:
        wskey_list = os.environ['JD_WSCK'].split('&')
        if len(wskey_list) > 0:
            return wskey_list
        else:
            print("JD_WSCK变量未启用")
            sys.exit(1)
    else:
        println("未添加JD_WSCK变量")
        sys.exit(0)


def get_ck():
    if "JD_COOKIE" in os.environ:
        ck_list = os.environ['JD_COOKIE'].split('&')
        if len(ck_list) > 0:
            return ck_list
        else:
            println("JD_COOKIE变量未启用")
            sys.exit(1)
    else:
        println("未添加JD_COOKIE变量")
        sys.exit(0)


def check_ck(ck):
    url = 'https://wq.jd.com/user_new/info/GetJDUserInfoUnion?orgFlag=JD_PinGou_New&callSource=mainorder'
    headers = {'Cookie': ck, 'Referer': 'https://home.m.jd.com/myJd/home.action',
               'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1', }
    res = requests.get(url=url, headers=headers, verify=False, timeout=30)
    if res.status_code == 200:
        code = int(json.loads(res.text)['retcode'])
        pin = ck.split(";")[1]
        if code == 0:
            println(f"{pin}状态正常\n")
            return re_check_ck(ck)
        else:
            println(f"{pin}状态失效\n")
            return False
    else:
        return False
    
def re_check_ck(ck):
    url = 'https://plogin.m.jd.com/cgi-bin/ml/islogin'
    headers = {'Cookie': ck, 'Referer': 'https://h5.m.jd.com/',
               'User-Agent': 'jdapp;iPhone;10.1.2;15.0;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1', }
    res = requests.get(url=url, headers=headers, verify=False, timeout=30)
    pin = r.findall(ck)
    pin = unquote(pin[0])
    if res.status_code == 200:
        code = json.loads(res.text)['islogin']
        if code == "1":
            println(f"账号{pin}的状态确实正常\n")
            return True
        else:
            println(f"账号{pin}状态已经失效")
            return False
    else:
        println("请求超时，接口炸掉了,一会再试吧")

def getToken(wskey):
    headers = {'cookie': wskey, 'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;',
               'content-type': 'application/x-www-form-urlencoded; charset=UTF-8', 'charset': 'UTF-8', 'accept-encoding': 'br,gzip,deflate'}
    params = {'functionId': 'genToken', 'clientVersion': '10.1.2',
              'client': 'android', 'uuid': uuid, 'st': st, 'sign': sign, 'sv': sv}
    url = 'https://api.m.jd.com/client.action'
    data = 'body=%7B%22action%22%3A%22to%22%2C%22to%22%3A%22https%253A%252F%252Fplogin.m.jd.com%252Fcgi-bin%252Fm%252Fthirdapp_auth_page%253Ftoken%253DAAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg%2526client_type%253Dandroid%2526appid%253D879%2526appup_type%253D1%22%7D&'
    res = requests.post(url=url, params=params,
                        headers=headers, data=data, verify=False)
    res_json = json.loads(res.text)
    tokenKey = res_json['tokenKey']
    return appjmp(wskey, tokenKey)


def appjmp(wskey, tokenKey):
    headers = {'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.1.2;build/89743;screen/1440x3007;os/11;network/wifi;',
               'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3', }
    params = {'tokenKey': tokenKey, 'to': 'https://plogin.m.jd.com/cgi-bin/m/thirdapp_auth_page?token=AAEAIEijIw6wxF2s3bNKF0bmGsI8xfw6hkQT6Ui2QVP7z1Xg',
              'client_type': 'android', 'appid': 879, 'appup_type': 1, }
    url = 'https://un.m.jd.com/cgi-bin/app/appjmp'
    res = requests.get(url=url, headers=headers, params=params,
                       verify=False, allow_redirects=False)
    res_set = res.cookies.get_dict()
    pt_key = 'pt_key='+res_set['pt_key']
    pt_pin = 'pt_pin='+res_set['pt_pin']
    jd_ck = str(pt_key)+';'+str(pt_pin)+';'
    wskey = wskey.split(";")[0]
    if 'fake' in pt_key:
        println(f"{wskey}wskey状态失效\n")
        send(wskey+"的wskey状态失效\n请查看是否退出客户端或者修改过密码", message_info)
        return False, jd_ck
    else:
        println(f"{wskey}wskey状态正常\n")
        return True, jd_ck


def get_sign():
    url = 'https://hellodns.coding.net/p/sign/d/jsign/git/raw/master/sign'
    res = requests.get(url=url, verify=False, timeout=20)
    sign_list = json.loads(res.text)
    svv = sign_list['sv']
    stt = sign_list['st']
    suid = sign_list['uuid']
    jign = sign_list['sign']
    return svv, stt, suid, jign


def serch_ck(pin):
    pin2 = pin.replace('%', '%5C%25')
    conn = http.client.HTTPConnection("127.0.0.1", 5700)
    payload = ''
    headers = {'Authorization': 'Bearer '+token}
    url = '/api/envs?searchValue={0}'.format(pin2)
    conn.request("GET", url, payload, headers)
    res = json.loads(conn.getresponse().read())
    if len(res['data']) == 0:
        print(f"{pin}检索失败\n")
        return False, 1
    elif len(res['data']) > 1:
        println(f"{pin}Pin存在重复, 取第一条\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid
    else:
        print(pin, "检索成功\n")
        key = res['data'][0]['value']
        eid = res['data'][0]['_id']
        return True, key, eid


def ql_update(eid, n_ck):
    url = 'http://127.0.0.1:5700/api/envs'
    data = {"name": "JD_COOKIE", "value": n_ck, "_id": eid}
    data = json.dumps(data)
    res = json.loads(s.put(url=url, data=data).text)
    if res['data']['status'] == 1:
        ql_enable(eid)


def ql_enable(eid):
    url = 'http://127.0.0.1:5700/api/envs/enable'
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        println("账号启用成功")
        println("--------------------\n")
        return True
    else:
        println("账号启用失败")
        println("--------------------\n")
        return False


def ql_disable(eid):
    url = 'http://127.0.0.1:5700/api/envs/disable'
    data = '["{0}"]'.format(eid)
    res = json.loads(s.put(url=url, data=data).text)
    if res['code'] == 200:
        println("账号禁用成功")
        println("--------------------\n")
        return True
    else:
        println("账号禁用失败")
        println("--------------------\n")
        return False


def ql_insert(i_ck):
    data = [{"value": i_ck, "name": "JD_COOKIE"}]
    data = json.dumps(data)
    url = 'http://127.0.0.1:5700/api/envs'
    s.post(url=url, data=data)
    println("账号添加完成")
    println("--------------------\n")


if __name__ == '__main__':
    r = re.compile(r'pt_pin=(.*?);')
    sv, st, uuid, sign = get_sign()
    token = ql_login()
    s = requests.session()
    s.headers.update({"authorization": "Bearer "+str(token)})
    s.headers.update({"Content-Type": "application/json;charset=UTF-8"})
    wslist = get_wskey()
    for ws in wslist:
        wspin = ws.split(";")[0]
        if "pin" in wspin:
            wspin = "pt_"+wspin
            return_serch = serch_ck(wspin)
            if return_serch[0]:
                jck = str(return_serch[1])
                if not check_ck(jck):
                    return_ws = getToken(ws)
                    if return_ws[0]:
                        nt_key = str(return_ws[1])
                        println("wskey转换成功\n")
                        eid = return_serch[2]
                        ql_update(eid, nt_key)
                    else:
                        println(f"{ws}wskey失效\n")
                        send(ws+"的wskey状态失效\n请查看是否退出了客户端或者修改过密码", message_info)
                        eid = return_serch[2]
                        println("禁用账号", wspin)
                        ql_disable(eid)
                else:
                    println(f"{wspin}账号有效\n")
                    println("----------------------------------\n\n")

            else:
                println("wskey未生成pt_key\n")
                return_ws = getToken(ws)
                if return_ws[0]:
                    nt_key = str(return_ws[1])
                    println("wskey转换成功\n")
                    ql_insert(nt_key)
        else:
            println("WSKEY格式错误\n--------------------\n")
    println("执行完成\n--------------------")
    sys.exit(0)
