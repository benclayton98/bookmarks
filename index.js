require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000

const { models } = require('./models/models.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))

app.get('/', async (req, res) => {
    const bookmarks = await models.Bookmark.findAll({})
    res.render('index.ejs',{
        bookmark: bookmarks
    })
})

app.post('/', async (req, res) => {
    await models.Bookmark.create({
        url: req.body.url
    })
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })