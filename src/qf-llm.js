const axios = require('axios')
const https = require('https')
const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true, })
const config = require('./config')
const qf_token = require('./qf-token')
const { BaiduQianfanEmbeddings } = require('@langchain/community/embeddings/baidu_qianfan')
const { Chroma } = require('@langchain/community/vectorstores/chroma')

let vectorStore

let wenxin_embedding = async (txt) => {
  let token = await qf_token.refreshToken()

  let url = `${config.qianfan.url}/rpc/2.0/ai_custom/v1/wenxinworkshop/embeddings/embedding-v1?access_token=${token}`

  let body = {
    input: [`${txt}`]
  }

  let response = await axios.post(url, body, {
    httpsAgent: agent
  })

  return response.data
}


let initVectorDB = () => {
  let api_key = process.env.qf_api_key
  let secret = process.env.qf_secret_key

  let embedding = new BaiduQianfanEmbeddings({
    baiduApiKey: api_key,
    baiduSecretKey: secret
  })

  vectorStore = new Chroma(embedding, {
    collectionName: "laoyangshuo",
    url: "http://localhost:8000"
  });
}

let addDocs = async (docs) => {
  const ids = await vectorStore.addDocuments(docs)
  return ids
}

let queryDocs = async(query) => {
  const filteredResponse = await vectorStore.similaritySearch(query, 2)
  return filteredResponse
}

module.exports = {
  initVectorDB: initVectorDB,
  addDocs: addDocs,
  queryDocs: queryDocs
}