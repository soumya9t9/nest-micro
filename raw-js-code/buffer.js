const buf1 = Buffer.from("Hello, welcome to Node.Js")
console.log(buf1) //<Buffer 48 65 6c 6c 6f 2c 20 77 65 6c 63 6f 6d 65 20 74 6f 20 4e 6f 64 65 2e 4a 73>
console.log(buf1.toString())
console.log(buf1)

console.log(buf1[0]) //72
console.log(buf1[1]) //101
console.log(buf1[2]) //108
console.log(buf1[3]) //108

const buf2 = Buffer.from([23,78,12,9,89])
console.log(buf2) //<Buffer 17 4e 0c 09 59>
console.log(buf2[0]) //23
console.log(buf2[1]) //78
console.log(buf2[2]) //12
console.log(buf2[3]) //9