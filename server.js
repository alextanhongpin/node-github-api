const request = require('request')
const debug = require('debug')('app:github')
const fs = require('fs')


const config = require('./config.js')

const {
  // Year in which the github account is created
  year,
  // Country where the github user resides
  country,
  // No of users fetched per call
  per_page: perPage,
  // Personal access token to reduce the rate-limit
  access_token: accessToken
} = config


// A util helper to calculate the number of pages required for fetching all results
function numberOfPages (totalPages, perPage) {
  return Math.floor(totalPages / perPage)
}

// Fetch the users data from a particular country
function fetchUsersFromCountry (country, page) {
  const startYear = year
  const endYear = year + 1
  const url = `https://api.github.com/search/users?q=location:${country} created:${startYear}-01-01..${endYear}-01-01&page=${page}`

  return new Promise((resolve, reject) => {
    request({
      url,
      headers: {
        'User-Agent': 'request',
        'Authorization': `token ${accessToken}`
      },
      json: true
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body)
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

  return Promise.all(mapPromises).then((data) => {
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
