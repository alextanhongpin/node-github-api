// Fetches data for the user's repository and carry out processing

// For each user, get the login id

// For each login id, check the total count of public_repos

// For each public_repos, check the number of max display

// For each pages, get the repo
const config = require('../config.json')
const pagination = require('../util/pagination.js')
const writeJson = require('../util/write-json.js')
const Promise = require('bluebird')
const request = require('request')
const year = 2017
const users = require(`../data/user/${year}.json`)

const user = {
  login: 'alextanhongpin',
  id: 6033638,
  avatar_url: 'https://avatars0.githubusercontent.com/u/6033638?v=3',
  gravatar_id: '',
  url: 'https://api.github.com/users/alextanhongpin',
  html_url: 'https://github.com/alextanhongpin',
  followers_url: 'https://api.github.com/users/alextanhongpin/followers',
  following_url: 'https://api.github.com/users/alextanhongpin/following{/other_user}',
  gists_url: 'https://api.github.com/users/alextanhongpin/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/alextanhongpin/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/alextanhongpin/subscriptions',
  organizations_url: 'https://api.github.com/users/alextanhongpin/orgs',
  repos_url: 'https://api.github.com/users/alextanhongpin/repos',
  events_url: 'https://api.github.com/users/alextanhongpin/events{/privacy}',
  received_events_url: 'https://api.github.com/users/alextanhongpin/received_events',
  type: 'User',
  site_admin: false,
  name: 'Alex Tan Hong Pin',
  company: null,
  blog: 'http://www.alextanhongpin.com/',
  location: 'Malaysia & Germany',
  email: null,
  hireable: true,
  bio: 'Design patterns and architecture above everything. Currently focusing on microservices.',
  public_repos: 109,
  public_gists: 26,
  followers: 7,
  following: 15,
  created_at: '2013-11-25T18:21:32Z',
  updated_at: '2017-06-04T06:00:46Z'
}

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
