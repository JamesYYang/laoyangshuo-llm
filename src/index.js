require('dotenv').config()

const token = require('./qf-token')
const wenxin = require('./qf-llm')
const lcHelper = require('./langchainHelper')
const _ = require('lodash')
const https = require('https')


let main = async()=>{
  wenxin.initVectorDB()
  console.log('init vector db finished')


  // let data = await lcHelper.loadText()
  // let output = _.slice(data, 0, 20)

  // console.log('load docs finished')
  // // console.log(JSON.stringify(output, null, 2))

  // let ids = await wenxin.addDocs(output)

  // console.log('add docs to vector dbs')

  // console.log(ids)

  // let queryResponse = await wenxin.queryDocs('提问技巧')
  // console.log(queryResponse)

  let chatRes = await wenxin.chatWenxin()
  console.log(chatRes)
}

main().then(() => console.log('program exists')).catch((err) => console.log(err))