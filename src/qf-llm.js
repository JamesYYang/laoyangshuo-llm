const axios = require('axios')
const https = require('https')
const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true, })
const config = require('./config')
const qf_token = require('./qf-token')
const { BaiduQianfanEmbeddings } = require('@langchain/community/embeddings/baidu_qianfan')
const { Chroma } = require('@langchain/community/vectorstores/chroma')
const { ChatBaiduQianfan } = require('@langchain/baidu-qianfan')
const { HumanMessage } = require('@langchain/core/messages')

const { createStuffDocumentsChain } = require("langchain/chains/combine_documents")
const { PromptTemplate } = require("@langchain/core/prompts")
const { createRetrievalChain } = require('langchain/chains/retrieval')

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

let queryDocs = async (query) => {
  const filteredResponse = await vectorStore.similaritySearch(query, 3)
  return filteredResponse
}

let chatWenxin = async () => {
  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  const message = new HumanMessage("成都明天天气");

  let res = await llm.invoke([message])

  return res
}

let rag = async (question) => {
  let template = `
使用以下上下文来回答最后的问题。如果你不知道答案，就说你不知道，不要试图编造答案。最多使用三句话。尽量使答案简明扼要。
总是在回答的最后说“谢谢你的提问！”。
{context}
问题: {input}
  `

  let prompt = new PromptTemplate({
    template: template,
    inputVariables: ['context', 'input']
  })

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  })

  const retriever = vectorStore.asRetriever({ k: 6 })

  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  })

  let response = await retrievalChain.invoke({ input: question })
  return response
}

module.exports = {
  initVectorDB: initVectorDB,
  addDocs: addDocs,
  queryDocs: queryDocs,
  chatWenxin: chatWenxin,
  RAG: rag
}