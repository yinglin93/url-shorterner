const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

const urls = require('./public/jsons/url.json')
const urlPath = './public/jsons/url.json'
const fs = require('fs')

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/shorten', (req, res) => {
  const inputedURL = req.query.inputedURL

  if (!inputedURL) {
    res.render('err')
    // 若使用者沒有輸入內容，防止表單送出
  } else {
    const shortURL = shortenURL(inputedURL, urls)
    res.render('results', {shortURL})
    console.log('收到連結')
  }
})

app.get('/shorten/:id', (req, res) => {
  const id = req.params.id
  const url = urls.find((item) => item.id === id)

  if (!url) {
    return res.render('err')
  }

  res.redirect(url.originalURL)
})

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})

// FUNCTION
function randomId() {
  const character = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYS0123456789'
  let id = ''

  for (let i = 0; i < 5; i++) {
    id += character[Math.floor(Math.random() * 62)]
  }

  // 確認是否有相同的短網址
  if (urls.some((url) => url.id === id)) {
    return randomId()
  }
  
  return id
}

function shortenURL(inputedURL, data) {
  let id = ''

  // 讓原始網址統一去掉尾端的'/'
  if (inputedURL[inputedURL.length-1] === '/'){
    inputedURL = inputedURL.slice(0, -1)
  }

  // 輸入相同網址時，產生一樣的縮址
  if (data.some((item) => item.originalURL === inputedURL)){
    id = data.find((item) => item.originalURL === inputedURL).id
  } else {
    id = randomId()
    data.push({
      id:id,
      originalURL:inputedURL
    })
  }

  fs.writeFile(urlPath,JSON.stringify(data), function(err){
    if (err){
      return console.error(err)
    }
    console.log("Data written successfully!")
  })

  return `http://localhost:3000/shorten/${id}`
}
