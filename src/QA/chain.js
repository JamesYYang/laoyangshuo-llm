let prompt = `
请按照以下步骤回答客户的提问。客户的提问将以####分隔。

步骤 1:首先确定用户是否正在询问有关特定产品或产品的问题。产品类别不计入范围。

步骤 2:如果用户询问特定产品，请确认产品是否在以下列表中。所有可用产品：

产品：TechPro 超极本
类别：计算机和笔记本电脑
品牌：TechPro
型号：TP-UB100
保修期：1 年
评分：4.5
特点：13.3 英寸显示屏，8GB RAM，256GB SSD，Intel Core i5 处理器
描述：一款适用于日常使用的时尚轻便的超极本。
价格：$799.99

产品：BlueWave 游戏笔记本电脑
类别：计算机和笔记本电脑
品牌：BlueWave
型号：BW-GL200
保修期：2 年
评分：4.7
特点：15.6 英寸显示屏，16GB RAM，512GB SSD，NVIDIA GeForce RTX 3060
描述：一款高性能的游戏笔记本电脑，提供沉浸式体验。
价格：$1199.99

产品：PowerLite 可转换笔记本电脑
类别：计算机和笔记本电脑
品牌：PowerLite
型号：PL-CV300
保修期：1年
评分：4.3
特点：14 英寸触摸屏，8GB RAM，256GB SSD，360 度铰链
描述：一款多功能可转换笔记本电脑，具有响应触摸屏。
价格：$699.99

产品：TechPro 台式电脑
类别：计算机和笔记本电脑
品牌：TechPro
型号：TP-DT500
保修期：1年
评分：4.4
特点：Intel Core i7 处理器，16GB RAM，1TB HDD，NVIDIA GeForce GTX 1660
描述：一款功能强大的台式电脑，适用于工作和娱乐。
价格：$999.99

产品：BlueWave Chromebook
类别：计算机和笔记本电脑
品牌：BlueWave
型号：BW-CB100
保修期：1 年
评分：4.1
特点：11.6 英寸显示屏，4GB RAM，32GB eMMC，Chrome OS
描述：一款紧凑而价格实惠的 Chromebook，适用于日常任务。
价格：$249.99

步骤 3: 如果消息中包含上述列表中的产品，请列出用户在消息中做出的任何假设，\
例如笔记本电脑 X 比笔记本电脑 Y 大，或者笔记本电脑 Z 有 2 年保修期。

步骤 4: 如果用户做出了任何假设，请根据产品信息确定假设是否正确。

步骤 5: 如果用户有任何错误的假设，请先礼貌地纠正客户的错误假设（如果适用）。\
只提及或引用可用产品列表中的产品，因为这是商店销售的唯一五款产品。以友好的口吻回答客户。

使用以下格式回答问题：
步骤 1:  <步骤 1 的推理>
步骤 2:  <步骤 2 的推理>
步骤 3:  <步骤 3 的推理>
步骤 4:  <步骤 4 的推理>
回复客户:  <回复客户的内容>

请确保每个步骤上面的回答中中使用  对步骤和步骤的推理进行分隔。

####{question}####
`

const { PromptTemplate } = require("@langchain/core/prompts")
const { getCompletion } = require("../util")

let chainOfThought = async() => {

  const promptTemplate = PromptTemplate.fromTemplate(prompt)
  // let output = await promptTemplate.invoke({ question: 'BlueWave Chromebook 比 TechPro 台式电脑贵多少？' })
  let output = await promptTemplate.invoke({ question: '你卖巧克力吗？' })

  let res = await getCompletion(output)

  console.log(res)
}

let doJob = async () => {

  await chainOfThought()
}


doJob().then(() => console.log('program exists')).catch((err) => console.log(err))