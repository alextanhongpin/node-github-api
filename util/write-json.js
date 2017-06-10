// util/write-json.js
//
// Description: A util to write a javascript object to json file

const fs = require('fs')
function writeToJson (name, json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, JSON.stringify(json), 'utf8', (err) => {
      err ? reject(err) : resolve(true)
    })
  })
}

module.exports = writeToJson
