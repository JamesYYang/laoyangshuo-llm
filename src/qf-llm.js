const axios = require('axios')
const https = require('https')
const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true, })
const config = require('./config')
const qf_token = require('./qf-token')

let wenxin_embedding = async (txt) => {
  let token = await qf_token.refreshToken()

  let url = `${config.qianfan.url}/rpc/2.0/ai_custom/v1/wenxinworkshop/embeddings/embedding-v1?access_token=${token}`

  let body = {
    input: [`${txt}`]
  }

  let response = await axios.post(url, body, {
    httpsAgent: agent
  })

  return response.data
}

module.exports = {
  embedding: wenxin_embedding
}