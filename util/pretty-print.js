#!/usr/bin/env node
// pretty-print.js prints the output of a json file in the terminal
// usage:
// From the root folder:
// $ node util/pretty-print --file config.json

const flags = require('flags')
const path = require('path')

flags.defineString('file', '', 'The path to the file you want to pretty print')
flags.parse()

try {
	// Go up one level
  const filePath = path.join('..', flags.get('file'))
  const file = require(filePath, null, 2)
  if (file) {
    console.log(JSON.stringify(file, null, 2))
  }
} catch (error) {
  console.log(error)
}
