require('dotenv').config()

const { ChatBaiduQianfan } = require('@langchain/baidu-qianfan')
const { PromptTemplate } = require("@langchain/core/prompts")
const { StringOutputParser, JsonOutputParser } = require("@langchain/core/output_parsers")

let lamp_review = `
  我需要一盏漂亮的卧室灯，这款灯具有额外的储物功能，价格也不算太高。\
  我很快就收到了它。在运输过程中，我们的灯绳断了，但是公司很乐意寄送了一个新的。\
  几天后就收到了。这款灯很容易组装。我发现少了一个零件，于是联系了他们的客服，他们很快就给我寄来了缺失的零件！\
  在我看来，Lumina 是一家非常关心顾客和产品的优秀公司！
  `

let story = `
在疫情冲击和经济低迷的双重打击下，最近两年任何企业，任何个人其实日子都不好过。我们看到了很多曾经风光的大厂都开启了大规模的裁员。
不知道你思考过没，企业选择裁员的逻辑是什么？裁员到底有没有用？

我们可以类比一下减肥。正常的减肥思维，肯定是哪里肉多减哪里对吧？
你会不会说我们要平均分配一下，身体每个部分都减一下，又不是神经病。

所以，同理可得，裁员的本质是要去除冗余。就好像减肥一样，减肥的目的是要让自己更健康，所以，要把身体里不好的冗余去除。
企业也是一样，伴随着裁员，企业在过程中应该是去识别冗余，剔除那些对企业可有可无的业务，可有可无的员工。
当然，要做到这一点看似很容易，其实对于高管（VP以上）要求是挺高的，至少高管心里对于公司的整体营运情况是非常清晰的，包括每个业务投入多少资源？
产了多大的收益？这些问题要随时能答的上来，否则怎么知道哪里有冗余？
难道就靠算一下人力成本？难道就看一下每个人的工作负荷？会不会太low了……
`

let emotionAnalysis = async () => {

  const promptTemplate = PromptTemplate.fromTemplate(
    `识别以下评论的作者表达的情感。包含不超过五个项目。将答案格式化为以逗号分隔的单词列表。

    评论文本: \`\`\`{lamp_review}\`\`\` 
    `)

  let output = await promptTemplate.invoke({ lamp_review: lamp_review })

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  let res = await llm.invoke(output)

  console.log(res)
}

let productReviewAnalysis = async () => {

  const promptTemplate = PromptTemplate.fromTemplate(
    `
从评论文本中识别以下项目：
- 评论者购买的物品
- 制造该物品的公司

评论文本用三个反引号分隔。将你的响应格式化为以 “物品” 和 “品牌” 为键的 JSON 对象。
如果信息不存在，请使用 “未知” 作为值。
让你的回应尽可能简短。

    评论文本: \`\`\`{lamp_review}\`\`\` 
    `)

  let output = await promptTemplate.invoke({ lamp_review: lamp_review })

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  let parser = new JsonOutputParser()

  let res = await llm.pipe(parser).invoke(output)

  console.log(res)
}

let subjectAnalysis = async ()=>{
  const promptTemplate = PromptTemplate.fromTemplate(
    `
确定以下给定文本中讨论的五个主题。

每个主题用1-2个词概括。

请输出一个可解析的Json数组，每个元素是一个字符串，展示了一个主题。

给定文本: \`\`\`{story}\`\`\`
    `)

  let output = await promptTemplate.invoke({ story: story })

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  let parser = new JsonOutputParser()

  let res = await llm.pipe(parser).invoke(output)

  console.log(res)
}

let doJob = async () => {
  // await emotionAnalysis()

  // await productReviewAnalysis()

  await subjectAnalysis()
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))