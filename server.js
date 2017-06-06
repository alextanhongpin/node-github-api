const request = require('request')

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

function fetchUsersFromCountry (country) {
  const url = `https://api.github.com/search/users?q=location:${country}`
 // &page=12
  request({
    url,
	  headers: {
	    	'User-Agent': 'request'
	  	}
  }, (error, response, body) => {
	  console.log(response, body)
	  if (!error && response.statusCode === 200) {
	  	const users = JSON.parse(body)
	  	console.log(users, users.items.length)
	  } else {
	  	console.log(error)
	  }
  })
}

fetchUsersFromCountry('malaysia')
