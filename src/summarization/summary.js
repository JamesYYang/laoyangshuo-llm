const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio")
const { RecursiveCharacterTextSplitter, TokenTextSplitter } = require("langchain/text_splitter")
const { loadSummarizationChain } = require("langchain/chains")
const { PromptTemplate } = require("@langchain/core/prompts")
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { getLLM } = require('../util')

let doJob = async () => {

  const loader = new CheerioWebBaseLoader(
    // "https://jamesyyang.github.io/2023/07/31/AI-how-to-use/",
    "https://jamesyyang.github.io/2024/05/26/product-make-it-happen/",
    {
      selector: ".post-content",
    }
  )

  const docs = await loader.load()

  // const textSplitter = new RecursiveCharacterTextSplitter({
  //   chunkSize: 500,
  //   chunkOverlap: 100,
  // })

  const textSplitter = new TokenTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 150,
  })

  const splits = await textSplitter.splitDocuments(docs)

  let summaryTemplate = `
你是一个文章摘要的专家，请对以下文章做摘要，并只返回摘要的内容。

-----------
{text}
-----------
  `

  let summaryPrompt = PromptTemplate.fromTemplate(summaryTemplate)

  let summaryRefineTemplate = `
  你是一个文章摘要的专家。请对以下文章做摘要，并只返回摘要的内容。
  我们提供了某个特定点的现有摘要：{existing_answer}

  -----------
  {text}
  -----------
    `

  let summaryRefindPrompt = PromptTemplate.fromTemplate(summaryRefineTemplate)

  let llm = getLLM()

  const summarizeChain = loadSummarizationChain(llm, {
    type: "refine",
    verbose: true,
    questionPrompt: summaryPrompt,
    refinePrompt: summaryRefindPrompt,
  });

  const response = await summarizeChain.invoke({ input_documents: splits})

  console.log(response)

}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))