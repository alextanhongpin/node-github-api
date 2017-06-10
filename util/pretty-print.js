const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Which file do you want to pretty print?', (fileName) => {
  if (!fileName) {
    console.log('We cannot pretty print that...')
    rl.close()
    return
  }

  console.log('\n', require(fileName, null, 2), '\n')
  rl.close()
})
