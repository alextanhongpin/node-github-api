// Fetches data for the user's repository and carry out processing

const config = require('../config.json')
const pagination = require('../util/pagination.js')
const writeJson = require('../util/write-json.js')
const Promise = require('bluebird')
const request = require('request')
const year = 2017
const users = require(`../data/user/${year}.json`)

function fetchRepos (login, page) {
  console.log(`Fetching user = ${login} page = ${page}`)
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.github.com/users/${login}/repos?page=${page}`,
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

function fetch (user) {
  const pages = pagination.pageArray(pagination.pageCount(user.public_repos, config.per_page))
  const promises = Promise.resolve(pages).map((page) => {
    return fetchRepos(user.login, page)
  }, {
    concurrency: 20
  })
  const all = promises.then((data) => {
    const repos = data.reduce((a, [_, b]) => {
      return a.concat(b)
    }, [])
    return {
      repos: repos,
      user: user.login
    }
  }).catch((error) => {
    console.log(error)
  })
  return all
}

const fetchingUsers = Promise.resolve(users).map((user) => {
  return fetch(user)
}, {
  concurrency: 5
}).then((repos) => {
  writeJson(`./${year}.json`, repos).then(() => {
    console.log('successfully wrote repos')
  }).catch((error) => {
    console.log(error)
  })
})
