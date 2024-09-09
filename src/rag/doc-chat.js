const { CheerioWebBaseLoader } = require("@langchain/community/document_loaders/web/cheerio")
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter")
const { BaiduQianfanEmbeddings } = require("@langchain/baidu-qianfan")
const { MemoryVectorStore } = require("langchain/vectorstores/memory")
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts")
const { HumanMessage, AIMessage } = require("@langchain/core/messages")
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { getLLM } = require('../util')
const { RunnableLambda, RunnableSequence } = require('@langchain/core/runnables')

let doJob = async () => {

  const loader = new CheerioWebBaseLoader(
    "https://jamesyyang.github.io/2023/07/31/AI-how-to-use/",
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

  const retriever = vectorStore.asRetriever()

  const convertDocsToString = (documents) => {
    return documents.map((document) => {
      return `<doc>\n${document.pageContent}\n</doc>`
    }).join("\n")
  }


  const documentRetrievalChain = RunnableSequence.from([
    (input) => input.question, // Step 1: Extract the question from the input
    retriever, // Step 2: Pass the question to the retriever
    convertDocsToString, // Step 3: Pipe documents from the retriever function to the helper function above
  ]);

  // Run our chain
  const results = await documentRetrievalChain.invoke({
    question: "如何利用AI提升自己的工作效率",
  })



  let template = `
使用以下上下文来回答最后的问题。如果你不知道答案，就说你不知道，不要试图编造答案。最多使用三句话。尽量使答案简明扼要。
总是在回答的最后说“谢谢你的提问！”。
上下文: {context}
问题: {question}
  `

  let chatPrompt = ChatPromptTemplate.fromTemplate(template)

  let llm = getLLM()

  const retrievalChain = RunnableSequence.from([
    // Step 1: When an object is supplied to this initializer, it will be used as the input to the chain
    {
      context: documentRetrievalChain,
      question: (input) => input.question,
    },
    chatPrompt, // Step 2: Pass the required input to the prompt (context and question)
    llm, // Step 3: Pass the output to our model
    new StringOutputParser(),
  ]);


  let newPrompt = `
  根据之前的聊天记录，回答下面的问题。 
  问题：{question}`

  const rephraseQuestionChainPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("history"),
    [
      'human',
      newPrompt
    ]
  ]);

  const rephraseQuestionChain = RunnableSequence.from([
    rephraseQuestionChainPrompt,
    llm,
    new StringOutputParser(),
  ]);

  let originalQuestion = `如何利用AI提升自己的工作效率`
  // Step 1 - Ask the original question
  let firstResponse = await retrievalChain.invoke({ question: originalQuestion, })
  console.log(`\n如何利用AI提升自己的工作效率\n\n${firstResponse}\n\n`);

  // Step 2 - Rephrase the question with chat history and the original follow-up question from the user
  const chatHistory = [
    new HumanMessage(originalQuestion),
    new AIMessage(firstResponse),
  ];

  const rephrasedQuestionResponse = await rephraseQuestionChain.invoke({
    question: "能把他们用要点方式展示吗？",
    history: chatHistory,
  })

  console.log(`\n${rephrasedQuestionResponse}\n\n`)

}

doJob().then(() => console.log('program exists')).catch((err) => console.log(err))