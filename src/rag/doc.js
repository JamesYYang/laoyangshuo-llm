const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio")
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter")
const { BaiduQianfanEmbeddings } = require("@langchain/baidu-qianfan")
const { MemoryVectorStore } = require("langchain/vectorstores/memory")
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents")
const { PromptTemplate } = require("@langchain/core/prompts")
const { createRetrievalChain } = require('langchain/chains/retrieval')
const { StringOutputParser } = require("@langchain/core/output_parsers")
const {getLLM} = require('../util')

let doJob = async () => {

  const loader = new CheerioWebBaseLoader(
    "https://jamesyyang.github.io/2024/05/26/product-make-it-happen/",
    {
      selector: ".post-content",
    }
  )

  const docs = await loader.load()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  })
  
  const splits = await textSplitter.splitDocuments(docs)

  const embeddings = new BaiduQianfanEmbeddings()
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    embeddings
  )

  // vectorStore = new Chroma(embedding, {
  //   collectionName: "laoyangshuo",
  //   url: "http://localhost:8000"
  // });

  let template = `
使用以下上下文来回答最后的问题。如果你不知道答案，就说你不知道，不要试图编造答案。最多使用三句话。尽量使答案简明扼要。
总是在回答的最后说“谢谢你的提问！”。
上下文: {context}
问题: {input}
  `

  let prompt = new PromptTemplate({
    template: template,
    inputVariables: ['context', 'input']
  })

  let llm = getLLM()

  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  })

  const retriever = vectorStore.asRetriever({ k: 6 })

  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
    outputParser: new StringOutputParser(),
  })

  let response = await retrievalChain.invoke({ input: '什么决定了产品的成败？' })
  console.log(response)

}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))