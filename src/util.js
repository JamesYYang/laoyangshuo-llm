require('dotenv').config()

const { ChatBaiduQianfan } = require('@langchain/baidu-qianfan')
const { StringOutputParser } = require("@langchain/core/output_parsers")

let wenxin;
let getCompletion = async (messages, parser = new StringOutputParser(),
  model = 'ERNIE-Bot-4', temperature = 0) => {

  if (!wenxin) {
    wenxin = new ChatBaiduQianfan({ modelName: model, temperature: temperature })
  }

  let res = await wenxin.pipe(parser).invoke(messages)

  return res
}

module.exports = {
  getCompletion: getCompletion
}