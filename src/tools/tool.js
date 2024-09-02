const { WikipediaQueryRun } = require("@langchain/community/tools/wikipedia_query_run")
const { getLLM, getCompletion } = require('../util')
const { convertToOpenAITool } = require("@langchain/core/utils/function_calling")
const { StringOutputParser } = require("@langchain/core/output_parsers")
const { SystemMessage, HumanMessage } = require('@langchain/core/messages')

let doJob = async () => {
  const tool = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
  })

  let model = getLLM()

  let ml = model.bind({
    tools: [tool].map(convertToOpenAITool)
  })
  // let ml = model.bindTools([tool])

  // const res = await tool.invoke("Langchain")
  // console.log(res)

  // let llmRes = await ml.pipe(new StringOutputParser()).invoke('Lanchain')
  let userMessage = new HumanMessage('Lanchain')
  let llmRes = await ml.invoke([userMessage])
  // let llmRes = await getCompletion([userMessage])
  console.log(llmRes)
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))