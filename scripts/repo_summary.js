const fs = require('fs')
class RepoCollection {
  constructor (collection) {
    this._collection = collection
  }
  printUsers () {
    this._collection.forEach((model) => model.printUser())
  }
  printLanguages () {
    this._collection.forEach((model) => model.printLanguages())
  }
  getAllLanguages () {
    return this._collection.map((model) => model.languages).reduce((prev, next) => {
      return prev.concat(next)
    }, [])
  }
}
class RepoModel {
  constructor ({ user, repos }) {
    this._user = user
    this._repos = repos
  }
  get user () {
    return this._user
  }
  get repos () {
    return this._repos
  }
  printUser () {
    console.log('user =>', this._user)
  }

  printForkedRepos () {
    return this._repos.filter((repo) => repo.fork)
  }
  getNonForkedRepos () {
    return this._repos.filter((repo) => !repo.fork)
  }
  printRepos () {
    this._repos.forEach(this.printRepo)
  }
  printRepo ({
  stargazers_count = '',
  language = '',
  name = '',
  full_name = '',
  html_url = '',
  description = ''
}) {
    console.log('\n')
    console.log('stargazers count:', stargazers_count)
    console.log('language:', language)
    console.log('name:', name)
    console.log('full name:', full_name)
    console.log('html url:', html_url)
    console.log('description:', description)
    console.log('\n')
  }
  uniqueLanguages () {
    const languages = this._repos.map(({ language }) => language).filter(l => l)
    const uniqueLanguages = [...new Set(languages)]
    return uniqueLanguages
  }
  get languages () {
    // For non-forked repo only
    return this.getNonForkedRepos().map(({ language }) => language).filter(l => l)
  }
  printUniqueLanguages () {
    const languages = this._repos.map(({ language }) => language).filter(l => l)
    const uniqueLanguages = [...new Set(languages)]
    console.log('languages for', this._user, uniqueLanguages.join(', '))
  }
  printLanguages () {
    const languages = this._repos.map(({ language }) => language).filter(l => l)
    console.log('languages for', this._user, uniqueLanguages.join(', '))
  }
}

function getLanguagesByYear (year) {
  const data = require(`../data/repo/${year}.json`)
  const collection = data.map((d) => new RepoModel(d))
  const repoCollection = new RepoCollection(collection)

  return repoCollection.getAllLanguages()
}

const startYear = 2008
const presentYear = new Date().getFullYear() + 1

const years = Array(presentYear - startYear).fill(0).map((_, year) => {
  return startYear + year
})

const allLanguages = years.map(getLanguagesByYear).reduce((prev, next) => {
  return prev.concat(next)
}, [])

fs.writeFile('data/languages.txt', allLanguages.join(', '), (err) => {
  if (err) throw err
  console.log('The file has been saved!')
})
