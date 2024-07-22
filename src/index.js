require('dotenv').config()

const token = require('./qf-token')
const wenxin = require('./qf-llm')

let main = async()=>{
  let t = await token.refreshToken()

  console.log(t)

  let text = `前几天看了一篇风叔的文章，里面提到了中国人熟悉的一句话：一命二运三风水，四积阴德五读书，今天我也说说我对这句话的看法。`

  let embedding = await wenxin.embedding(text)

  console.log(JSON.stringify(embedding, null, 2))
}

main().then(() => console.log('program exists')).catch((err) => console.log(err))