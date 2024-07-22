const axios = require('axios')
const https = require('https')
const fs = require('fs')
const moment = require('moment')
const agent = new https.Agent({ rejectUnauthorized: false, keepAlive: true, })
const config = require('./config')


let refreshToken = async () => {
  let token = loadCacheToken()
  if (token) return token

  let api_key = process.env.qf_api_key
  let secret = process.env.qf_secret_key

  let url = `${config.qianfan.url}/oauth/2.0/token?grant_type=client_credentials&client_id=${api_key}&client_secret=${secret}`
  let response = await axios.post(url, null, {
    httpsAgent: agent
  })
  let tokenInfo = response.data
  tokenInfo.create_time = moment().unix()

  fs.writeFileSync(`${__dirname}/qf_token.json`, JSON.stringify(tokenInfo, null, 2))
  return tokenInfo.access_token
}

let loadCacheToken = () => {
  if (fs.existsSync(`${__dirname}/qf_token.json`)) {
    let tokenInfo = JSON.parse(fs.readFileSync(`${__dirname}/qf_token.json`, 'utf-8'))

    if (tokenInfo.expires_in + tokenInfo.create_time > moment().unix()) {
      return tokenInfo.access_token
    }
  }
}

module.exports = {
  refreshToken: refreshToken
}