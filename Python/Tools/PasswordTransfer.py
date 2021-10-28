"""
    @Author: isaac
    @Date:   2021-10-27 22:30:29
    @Last Modified by: isaac
    @Last Modified time: 2021-10-27 22:45:29
"""

import json
import base64
import requests
def passwd2Code(code):
    # url = "https://api.jds.codes/jCommand"
    url = str(base64.b64decode('aHR0cHM6Ly9hcGkuamRzLmNvZGVzL2pDb21tYW5k').decode())
    payload = json.dumps({"code": code})
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers, data=payload)
    data = json.loads(response.text)
    print(payload)
    print(data)
    print('\n')
    jumpUrl = data['data']['jumpUrl']
    # print("jumpUrl="+jumpUrl)
    inviteId = jumpUrl.split('inviteId=')[-1].split('&mpin')[0].split('&encryptedPin')[0]
    print("This inviteId is:\n"+inviteId)
if __name__ == "__main__":
    code = input("Please Input The Password:")
    passwd2Code(code)
