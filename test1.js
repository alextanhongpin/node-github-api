#!/usr/bin/env node

console.log('hello world')
var args = process.argv.slice(2)
console.log(args)

// if (err) {
//   process.exit(1);
// } else {
//   process.exit(0);
// }

process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', function (data) {
  process.stdout.write(data)
})
