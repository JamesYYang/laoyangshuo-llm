const { TextLoader } = require('langchain/document_loaders/fs/text')
const { DirectoryLoader } = require('langchain/document_loaders/fs/directory')
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters')

let loadText = async () => {

  const loader = new DirectoryLoader(process.env.document_folder, {
    ".md": (path) => new TextLoader(path)
  })

  const data = await loader.load()

  console.log(`total files: ${data.length}`)

  let results = []
  for (let i = 0; i < data.length; i++) {
    const d = data[i];
    let splitted = await splitText(d.pageContent)
    results.push(...splitted)
  }

  console.log(`total files after split: ${results.length}`)

  return results
}

let splitText = async (text) => {
  text = text.replaceAll('<!--more-->', '')
  text = text.replaceAll('---', '')
  text = text.replaceAll('\r\n', '\n')
  text = text.replaceAll('- ', '')
  text = text.replaceAll('### ', '')
  text = text.replaceAll('## ', '')

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 10,
    separators: ["\n\n", "\n", "。", ". "],
  })
  
  const output = await splitter.createDocuments([text])
  return output
}

module.exports = {
  loadText: loadText
}