#! /usr/bin/env node

let content = ''
process.stdin.resume()
process.stdin.setEncoding('utf8')

process.stdin.on('data', function (buf) {
  content += buf.toString()
})

process.stdin.on('end', function (data) {
  process.stdout.write(JSON.stringify(JSON.parse(content), null, 2) + '\n')
  process.exit(0)
})
