// dict-vector.js takes a string of comma separated values and creates an array of items with its label
/**
 * USAGE

We have a foo-bar.txt which contains a list of comma separated strings
e.g. Foo, Foo, Bar, Bar, Bar

count(foo-bar.txt) will then write the following
{ data: [
   { language: foo, frequency: 2 },
   { language: bar, frequency: 3 }
  ]
}

to a file

**/

// PHP, PHP, PHP, PHP, PHP, PHP, PHP, PHP, PHP, Ruby, VimL, Ruby, Go, PHP, PHP, PHP, PHP, PHP, Ruby, Ruby, Ruby,

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
      // Use label as it is more generic
      label: key,
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
