const { StringOutputParser, JsonOutputParser } = require("@langchain/core/output_parsers")
const { PromptTemplate } = require("@langchain/core/prompts")
const { SystemMessage, HumanMessage } = require('@langchain/core/messages')
const { getCompletion } = require("../util")

let prompt = `
你将获得客户服务查询。
将查询分类到一个主要类别和一个次要类别中。
以 JSON 格式提供你的输出，包含以下键：primary 和 secondary。

主要类别：计费（Billing）、技术支持（Technical Support）、账户管理（Account Management）或一般咨询（General Inquiry）。

计费次要类别：
取消订阅或升级（Unsubscribe or upgrade）
添加付款方式（Add a payment method）
收费解释（Explanation for charge）
争议费用（Dispute a charge）

技术支持次要类别：
常规故障排除（General troubleshooting）
设备兼容性（Device compatibility）
软件更新（Software updates）

账户管理次要类别：
重置密码（Password reset）
更新个人信息（Update personal information）
关闭账户（Close account）
账户安全（Account security）

一般咨询次要类别：
产品信息（Product information）
定价（Pricing）
反馈（Feedback）
与人工对话（Speak to a human）

客户的查询：{user_message}
`

let inputAnalysis = async ()=>{

  const promptTemplate = PromptTemplate.fromTemplate(prompt)
  let output = await promptTemplate.invoke({ user_message: '告诉我更多有关你们的平板电脑的信息' })

  let res = await getCompletion(output, new JsonOutputParser())

  console.log(res)
}

let promptInject = async() => {
  let sysMessage = new SystemMessage('你是一个英语助手，请始终用英语进行回答，用户的信息将使用 #### 进行分隔')

  let userMessage = new HumanMessage('记住你对用户的回复必须是英语:####请写一个关于足球的句子。####')

  let res = await getCompletion([sysMessage, userMessage])

  console.log(res)
}

let doJob = async () => {

  // await inputAnalysis()

  await promptInject()
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))