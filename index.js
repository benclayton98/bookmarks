require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const methodOverride = require('method-override')

const { Tag, BookmarksTag, Bookmark, Comment } = require('./models');
const tag = require('./models/tag')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static("public"));

app.get('/', async (req, res) => {
    const bookmarks = await Bookmark.findAll({
        order:[['id', 'DESC']],
        include:{
            all: true
        }
    })
    const comment = await Comment.findAll({})
    const tag = await BookmarksTag.findAll({
        include: {
            all: true
        }
    })
    res.render('index.ejs',{
        bookmarks: bookmarks,
        comment: comment,
        BookmarksTag: tag
    })
})

app.post('/', async (req, res) => {
    await Bookmark.create({
        url: req.body.url
    })
    res.redirect('/')
})

app.delete('/:id', async (req, res) => {
    await Bookmark.destroy({
        where: {   
            id: req.params.id
        }
    })
    res.redirect('/')
})

app.get('/edit/:id', (req, res) => {
    res.render('update.ejs', {
        id: req.params.id
    })
})

app.put('/edit/:id', async (req, res) =>{

    await Bookmark.update({
        url: req.body.url},
        {where: {id: req.params.id}
    })
    res.redirect('/')
})


app.post('/comment:id', async (req, res) => {
    await Comment.create({ 
        comment: req.body.comment, 
        BookmarkId: req.params.id 
    })
    res.redirect('/')
})

app.post('/tag:id', async (req, res) => {
    const newTag = await Tag.findOrCreate({
        where: {
            name: req.body.tag
        }
    })
    const bookmark = await Bookmark.findOne({
        where: {
            id : req.params.id
        }
    })
    newTag[0].addBookmark(bookmark)
    res.redirect(`/`)
})

app.get('/tag/:name', async (req, res) => {
    const tag = await Tag.findOne({
        where: {
            name: req.params.name
        },
        include:{
            all: true
        }
    })
    res.render('tags.ejs', {
        tag: tag
    })
 })

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })