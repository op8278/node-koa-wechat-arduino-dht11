import xml2js from 'xml2js'
import compileTemple from './template'
import sha1 from 'sha1'

const TYPE_TEXT = 'text'
const TYPE_NEWS = 'news'

// xml to json
export function parseXML(xml) {
  console.log('parseXml')
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { trim: true }, (err, json) => {
      if (err) {
        reject(err)
      } else {
        resolve(json)
      }
    })
  })
}
// console.log('测试util.formatmessage-------------Start')
// console.log(util.formatMessage({
//   key1: ['a', 'b'],
//   key2: ['c'],
//   key3: 'd',
//   key4: ['e', ['f', 'g']],
//   key5: ['e', { f: 'f', g: 'g' }]
// }))
// console.log('测试util.formatmessage-------------End')

// 转换为key-value形式
export function formatMessage(message) {
  let result = {}

  if (message && typeof message === 'object') { // null object array
    // console.log('formatMessage - message存在')
    // 获取当前对象key集合
    let keys = Object.keys(message)
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let item = message[key]

      // 判断是否为数组
      if (!Array.isArray(item) || item.length === 0) {
        continue
      }

      if (item.length === 1) {
        let val = item[0]
        if (val && typeof val === 'object') {
          result[key] = formatMessage(val)
        } else {
          result[key] = (val || '').trim()
        }
      } else {
        result[key] = []
        for (var j = 0; j < item.length; j++) {
          result[key].push(formatMessage(item[j]))
        }
      }
    }
  }
  return result
}
// 返回相应的回复模版
export function tpl(receiveDataFromWechat, replyData) {
  // 总目的:构建模版的所需的数据项
  // !replyData && (replyData = 'Empty News') // TODO 默认值

  // 判断接收类型
  let type = TYPE_TEXT
  if (Array.isArray(replyData)) {
    type = TYPE_NEWS
  }
  if (!replyData) {
    replyData = '没有回复内容'
  }
  if (replyData && replyData.type) {
    type = replyData.type
  }

  // 模版需要的数据项
  let templateData = Object.assign({}, {
    toUserName: receiveDataFromWechat.FromUserName,
    fromUserName: receiveDataFromWechat.ToUserName,
    createTime: new Date().getTime(),
    msgType: type,
    content: replyData
  })

  return compileTemple(templateData)
}

export function sign(ticket, url) {
  const noncestr = createNoncestr()
  const timestamp = createTimestamp()

  const signature = generateSignature(ticket, url, noncestr, timestamp)

  return {
    timestamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: noncestr, // 必填，生成签名的随机串
    signature: signature// 必填，签名，见附录1
  }
}
function createNoncestr() {
  const temp = Math.random().toString(36).substr(2, 15)
  console.log('----------CreateNonceStr-------------' + temp)
  // return Math.random().toString(36).substr(2, 15)
  return temp
}
function createTimestamp() {
  return parseInt((new Date().getTime() / 1000), 0) + ''
}
function generateSignature(ticket, url, noncestr, timestamp) {
  let tempObj = {
    jsapi_ticket: ticket,
    url: url,
    noncestr: noncestr,
    timestamp: timestamp
  }

  let keyValueString = ''
  console.log('-----排序前的signature字段顺序-----')
  for (let key in tempObj) {
    console.log(key)
  }

  // 排序
  let keyArray = Object.keys(tempObj)
  keyArray = keyArray.sort() // 按ASCII字典序排序
  console.log('-----排序后的signature字段顺序-----')
  // 组装keyvalue
  for (let key of keyArray) {
    console.log(key)
    keyValueString += '&' + key + '=' + tempObj[key]
  }
  keyValueString = keyValueString.substr(1)
  console.log('-----排序后的signature数据-----')
  console.log(keyValueString)

  return sha1(keyValueString)
}