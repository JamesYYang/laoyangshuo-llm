require('dotenv').config()

const { ChatBaiduQianfan } = require('@langchain/baidu-qianfan')
const { PromptTemplate } = require("@langchain/core/prompts")
const { StringOutputParser, JsonOutputParser } = require("@langchain/core/output_parsers")

let review = `
他们在11月份的季节性销售期间以约49美元的价格出售17件套装，折扣约为一半。\
但由于某些原因（可能是价格欺诈），到了12月第二周，同样的套装价格全都涨到了70美元到89美元不等。\
11件套装的价格也上涨了大约10美元左右。\
虽然外观看起来还可以，但基座上锁定刀片的部分看起来不如几年前的早期版本那么好。\
不过我打算非常温柔地使用它，例如，\
我会先在搅拌机中将像豆子、冰、米饭等硬物研磨，然后再制成所需的份量，\
切换到打蛋器制作更细的面粉，或者在制作冰沙时先使用交叉切割刀片，然后使用平面刀片制作更细/不粘的效果。\
制作冰沙时，特别提示：\
将水果和蔬菜切碎并冷冻（如果使用菠菜，则轻轻煮软菠菜，然后冷冻直到使用；\
如果制作果酱，则使用小到中号的食品处理器），这样可以避免在制作冰沙时添加太多冰块。\
大约一年后，电机发出奇怪的噪音，我打电话给客服，但保修已经过期了，所以我不得不再买一个。\
总的来说，这些产品的总体质量已经下降，因此它们依靠品牌认可和消费者忠诚度来维持销售。\
货物在两天内到达。
  `

let aiCSEmail = async ()=>{
  const promptTemplate = PromptTemplate.fromTemplate(
    `
你是一名客户服务的AI助手。
你的任务是给一位重要的客户发送邮件回复。
根据通过三个反引号分隔的客户电子邮件内容生成回复，以感谢客户的评价。
如果客户评价的情感是积极的或中性的，感谢他们的评价。
如果客户评价的情感是消极的，道歉并建议他们联系客户服务。
请确保使用评论中的具体细节。
以简明和专业的语气写信。
以“AI客户代理”的名义签署电子邮件。
客户评价：\`\`\`{review}\`\`\`
    `)

  let output = await promptTemplate.invoke({ review: review })

  let llm = new ChatBaiduQianfan({ modelName: 'ERNIE-Bot-4' })

  let parser = new StringOutputParser()

  let res = await llm.pipe(parser).invoke(output)

  console.log(res)
}

let doJob = async () => {

  await aiCSEmail()
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))