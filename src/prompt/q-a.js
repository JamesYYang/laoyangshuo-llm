require('dotenv').config()

const { ChatBaiduQianfan } = require('@langchain/baidu-qianfan')
const { PromptTemplate } = require("@langchain/core/prompts")
const { StringOutputParser, JsonOutputParser } = require("@langchain/core/output_parsers")
const { SystemMessage, HumanMessage } = require('@langchain/core/messages')


let tellJoke = async ()=>{

  let sysMessage = new SystemMessage('你是一个助理，你总是喜欢用一个笑话来回复问题')

  let hMessage = new HumanMessage('为什么在地球上看不到月球的背面')

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  let parser = new StringOutputParser()

  let res = await llm.pipe(parser).invoke([sysMessage, hMessage])

  console.log(res)
}

let doJob = async () => {

  await tellJoke()
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))