import fetch from 'node-fetch'
import fs from 'fs'

fetch(
  'https://developer.waimai.meituan.com/poi/list?app_poi_code=&name=&city_id=&city_name=&app_id=5339&status=-1&poi_status=-1&valid=-1&page_num=1&page_size=10&csrfToken=8rLyYg4q6KLoEbzsEuaVcGHKIap9wl1zykOfBABCD9L1JxWCcIOBphMkeszxdbJAIBsf0S9wUaaZg5QK%2FnWb3xWvf3CR3%2ByogvNZXdbSTcrVfBeQ48xW9q%2FHrKTaG2Vk%2BWKItYYcZ3Maif9FXI3cUg%3D%3D',
  {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'zh-CN,zh;q=0.9',
      'sec-ch-ua': '"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      cookie:
        '_lxsdk_cuid=1783f1010f2c8-0e0093e53152ba-13e3563-1fa400-1783f1010f3c8; _lxsdk=1783f1010f2c8-0e0093e53152ba-13e3563-1fa400-1783f1010f3c8; uuid=8dfd1f7143e44b24851a.1615965723.1.0.0; mtcdn=K; userTicket=OvHjUDUuybdMIOUdDcBTzgFrhFfwreIHGizuyUWf; lt=a96kAZACPIzBaup4mSKfFPam0gkAAAAABg0AANAwEai9x0kMXvogSfOF3Rdw-rBpr3HBd8mk_UkZKN5YWU02qVKvShtz7ezwfEq90A; u=97130574; n=Pjl617135409; cityId=440300; devcenter_token=a96kAZACPIzBaup4mSKfFPam0gkAAAAABg0AANAwEai9x0kMXvogSfOF3Rdw-rBpr3HBd8mk_UkZKN5YWU02qVKvShtz7ezwfEq90A; user_has_wm_app=1; user_has_sg_app=0; _ga=GA1.2.1024151421.1615966028; _gid=GA1.2.688150990.1615966028; open_developer_version=1; access_token=0PCNjbaYCHSrCqYTrJsgsTrSX6S4lu_-t4ZVd0afN9C8*; JSESSIONID=1i7vdfw8lkbcs5clqz4uwwbn5; _gat=1'
    },
    referrer:
      'https://developer.waimai.meituan.com/poi/list?app_poi_code=&name=&city_id=&city_name=&app_id=5339&status=-1&poi_status=-1&valid=-1&page_num=1&page_size=10&csrfToken=pgn78SHjxQ2Ptvpg%2BsdTKe6D4FTc3ZUp418IR%2B6jXXt3YQEGesikIIG5PI7ceqGCk%2Falzx1xpBUEn1xR%2FMBssnk7MuoobitSLQ8u8OzW6M%2FQGGclU3D1sEnsp3vbrQS2PArI9f%2FaiMOg1BeZKFO1CQ%3D%3D',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors'
  }
)
  .then(res => res.text())
  .then(res => console.log(res))
  .catch(err => console.error(err))
