const fs = require('fs')

fs.readFile('data/languages.txt', 'utf-8', (error, data) => {
  if (error) {
    console.log(error)
  }
  const languages = data.split(',').map((d) => d.trim())
  console.log('found', languages.length)

  const language = {}
  languages.forEach((lang) => {
  	if (!language[lang]) {
  		language[lang] = 0
  	}
  	language[lang] += 1
  })

  const pairs = Object.keys(language).map((key) => {
  	return {
  		language: key,
  		frequency: language[key]
  	}
  })
  const sortedPairs = pairs.sort((a, b) => {
    if (a.frequency < b.frequency) return 1
    if (a.frequency > b.frequency) return -1
    return 0
  })
  fs.writeFile('data/language_count.json', JSON.stringify({data: sortedPairs}), 'utf-8', (error) => {
  	if (error) {
  		console.log(error)
  	}
  		console.log('successfully wrote to data/language_count.json')
  })
})
