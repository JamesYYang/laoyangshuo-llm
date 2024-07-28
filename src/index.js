require('dotenv').config()

const token = require('./qf-token')
const wenxin = require('./qf-llm')
const lcHelper = require('./langchainHelper')
const _ = require('lodash')
const https = require('https')

let sleep = (s) => {
  return new Promise((resolve) => setTimeout(resolve, s * 1000))
}


let main = async () => {
  wenxin.initVectorDB()
  console.log('init vector db finished')


  // let data = await lcHelper.loadText()
  // console.log('load docs finished')

  // while (data.length > 0) {
  //   let output = _.take(data, 20)

  //   let ids = await wenxin.addDocs(output)
  //   console.log(ids)
  //   data = _.drop(data, 20)
  //   console.log(`add ${output.length} docs to vector dbs, left ${data.length}`)
  //   await sleep(2)
  // }

  let question = '如何做一个产品？'

  let queryResponse = await wenxin.queryDocs(question)
  console.log(queryResponse)

  let chatRes = await wenxin.RAG(question)
  console.log(chatRes)
}

main().then(() => console.log('program exists')).catch((err) => console.log(err))