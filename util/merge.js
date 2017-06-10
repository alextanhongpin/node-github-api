const readline = require('readline')
const writeJson = require('./write-json.js')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Enter the path to the first json file you want to merge', (file1) => {
  if (!file1) {
    console.log('No file specified. Exiting program.')
    rl.close()
    return
  }
  rl.question('Enter the path to the second json file you want to merge', (file2) => {
  	  if (!file2) {
	    console.log('No file specified. Exiting program.')
	    rl.close()
	    return
	  }
	  const file1Json = require(file1)
	  const file2Json = require(file2)
	  const finalFile = file1Json.concat(file2Json)

	  rl.question('Name the path you want to save the file to', (path) => {
	  	writeJson(path, finalFile).then(() => {
	  		console.log('Successfully merged file')
	  		rl.close()
	  	}).catch((error) => {
	  		console.log('Error merging file')
	  	})
	  })
  })
})
