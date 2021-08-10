require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const methodOverride = require('method-override')

const { models } = require('./models/models.js');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static("public"));

app.get('/', async (req, res) => {
    const bookmarks = await models.Bookmark.findAll({
        order:['id']
    })
    const comment = await models.Comment.findAll({})
    const tag = await models.Tag.findAll({})
    res.render('index.ejs',{
        bookmark: bookmarks,
        comment: comment,
        tag: tag
    })
})

app.post('/', async (req, res) => {
    await models.Bookmark.create({
        url: req.body.url
    })
    res.redirect('/')
})

app.delete('/:id', async (req, res) => {
    await models.Bookmark.destroy({
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

    await models.Bookmark.update({
        url: req.body.url},
        {where: {id: req.params.id}
    })
    res.redirect('/')
})


app.post('/comment:id', async (req, res) => {
    await models.Comment.create({ 
        comment: req.body.comment, 
        UrlId: req.params.id 
    })
    res.redirect('/')
})

app.post('/tag:id', async (req, res) => {
    await models.Tag.create({
        name: req.body.tag,
        BookmarkId: req.params.id
    })
    res.redirect('/')
})

app.get('/tag/:name', async (req, res) => {
    const tags = await models.Tag.findAll({
        where:{
            name: req.params.name
        }
    })
    const comment = await models.Comment.findAll({})
    res.render('tags.ejs', {
        tag: tags,
        comment: comment,
        bookmarks: bookmarks

    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })