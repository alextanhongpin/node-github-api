const request = require('request')
const debug = require('debug')('app:github')
const fs = require('fs')

const access_token = ''

// min 2008
const year = 2015

// Fetch users from malaysia only
const country = 'malaysia'

// Only 30 users are fetched from the github each time
const perPage = 30

function fetchUserRepos (username) {
  request({
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      'User-Agent': 'request'
    }
  }, (error, response, body) => {
    console.log(response, body)
    if (!error && response.statusCode === 200) {
      const repos = JSON.parse(body)
      console.log(repos.length)
    } else {
      console.log(error)
    }
  })
}

// Number of pages
function numberOfPages (totalPages, perPage) {
  return Math.floor(totalPages / perPage)
}

function fetchUsersFromCountry (country, page) {
  const url = `https://api.github.com/search/users?q=location:${country} created:${year}-01-01..${year + 1}-01-01&page=${page}`
 // &page=12

  return new Promise((resolve, reject) => {
    request({
      url,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${access_token}`
      }
      // qs: {
      //   client_id: ,
      //   client_secret: ,
      // },
      // json: true
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        // const { total_count, items } = users
        // body is a json string
        resolve(JSON.parse(body))
      } else {
        debug(`error fetching data user ${body}`)
        reject(error)
      }
    })
  })
}

fetchUsersFromCountry(country, 1).then((data) => {
  const { total_count, items } = data
  debug(`Total users found => ${total_count}`)
  // Need to fetch item from pages, max 1000 search results
  const pages = numberOfPages(total_count, perPage)
  debug(`Scraping data from ${pages} pages`)

  const mapPromises = Array(pages).fill(0).map((_, index) => {
    // debug(`At page ${index}`)
    return fetchUsersFromCountry(country, index)
  })
  debug(`${mapPromises.length} items to fetch`)

  return Promise.all(mapPromises)
  .then((data) => {
    let users = []

    debug('Fetching users')
    data.forEach((d) => {
      users = users.concat(d.items)
      debug(`Constructing user array => ${users.length} users total`)
    })
    return writeToJson(`${year}.json`, users)
  }).then((success) => {
    if (success) {
      debug('Successfully wrote to file')
    }
  }).catch((error) => {
    debug(`Error resolving all: ${error}`)
  })
}).catch((error) => {
  debug(`An error has occured: ${error}`)
})

function writeToJson (name = 'data.json', json) {
  return new Promise((resolve, reject) => {
    fs.writeFile(name, JSON.stringify(json), 'utf8', (err) => {
      err ? reject(err) : resolve(true)
    })
  })
}
