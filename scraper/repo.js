// repo.js scrapes a github user's repo

// E.g. githubApiEndpoint: https://api.github.com/users/alextanhongpin/repos
const Promise = require('bluebird')
const request = require('request')
const writeJson = require('../util/write-json.js')
const config = require('../config.json')
const flags = require('flags')

flags.defineInteger('year', new Date().getFullYear(), 'The year of the github account is created')
flags.parse()

fetchUsers(flags.get('year'))
function fetchUser (login) {
  console.log('fetching user', login)
  return new Promise((resolve, reject) => {
    request({
		  url: `https://api.github.com/users/${login}`,
		  headers: {
		    'User-Agent': 'request',
		    'Authorization': `token ${config.access_token}`
		  },
		  json: true
    }, (error, response, body) => {
      const isSuccess = !error && response.statusCode === 200
      isSuccess ? resolve([response, body]) : reject(error || body)
    })
  })
}

function fetchUsers (year) {
  console.log('fetching all users from the year', year)
	// User's created in 2008
  const data = require(`../data/${year}.json`)

	// Get the user's login id
  const login = data.map(u => u.login)

  const fetchAll = Promise.resolve(login).map(fetchUser, { concurrency: 10 })

  fetchAll.then((data) => {
    const users = data.map(([response, user]) => {
      console.log('x-ratelimit-remaining =>', response.headers['x-ratelimit-remaining'])
   	// headers['x-ratelimit-reset']
      return user
    })
    return writeJson(`data/user/${year}.json`, users)
  }).then((ok) => {
    console.log('successfully wrote to json file')
  }).catch((error) => {
  	console.log(error)
  })
  // const userPromises = login.map((id) => {
	 //  return fetchUser(id)
  // })

  // return Promise.all(userPromises).then((data) => {

  //   return writeJson(`data/user/${year}.json`, users)
  // }).then((ok) => {
  //   console.log('successfully wrote to json file')
  // }).catch((error) => {
  // 	console.log(error)
  // })
}

// Don't do this!
// const fetchAll = Promise.resolve(years).map(fetchUsers, {concurrency: 1 })
// { documentation_url: 'https://developer.github.com/v3/#abuse-rate-limits',
//   message: 'You have triggered an abuse detection mechanism. Please wait a few minutes before you try again.' }

// fetchAll.then((ok) => {
//     // do stuff to read files.
//   console.log(ok)
// })
