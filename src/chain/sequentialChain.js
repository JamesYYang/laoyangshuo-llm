const { StringOutputParser } = require("@langchain/core/output_parsers")
const { PromptTemplate } = require("@langchain/core/prompts")
const { RunnableLambda } = require('@langchain/core/runnables')
const { getLLM } = require('../util')

let getCompanyName = () => {
  const prompt = PromptTemplate.fromTemplate("我要创建一个做AI算力共享的公司，请给这个公司取一个名字，只返回一个公司的名字。")

  let model = getLLM()

  const chain = prompt.pipe(model).pipe(new StringOutputParser())

  return chain
}

let getCompanyIntro = () => {
  const prompt = PromptTemplate.fromTemplate("写一个100字的描述对于这个AI算力共享公司：{company_name}")

  let model = getLLM()

  const chain = prompt.pipe(model).pipe(new StringOutputParser())

  return chain
}

let doJob = async () => {

  let chain = getCompanyName()
  let composeChain = new RunnableLambda({
    func: async () => {
      const result = await chain.invoke();
      console.log(result)
      return { company_name: result };
    }
  }).pipe(getCompanyIntro())

  let res = await composeChain.invoke()

  console.log(res)
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))