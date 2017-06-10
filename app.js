
const fs = require('fs')

const startYear = 2008
const currentYear = new Date().getFullYear() + 1
const numberOfYears = currentYear - startYear

const usersByYear = Array(numberOfYears).fill(0).map((_, year) => {
  const targetYear = startYear + year
  return {
  	data: require(`./data/${targetYear}.json`),
  	label: targetYear
  }
})

// Calculate the number of users for each year

const data = usersByYear.map((user) => {
  console.log([user.data.length, 'users joined Github in', user.label].join(' '))
  return {
  	count: user.data.length,
  	label: user.label
  }
})

writeToJson('users-by-years.json', data).then().catch()

function writeToJson (name = 'data.json', json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, JSON.stringify(json), 'utf8', (err) => {
      err ? reject(err) : resolve(true)
    })
  })
}

