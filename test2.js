#!/usr/bin/env node
// var args = process.argv.slice(2)

process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', function (data) {
  process.stdout.write(data + 'yohooo')
})
