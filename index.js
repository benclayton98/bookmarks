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

app.get('/comment/:id', async (req, res) => {
    const commentUrl = await models.Bookmark.findAll({
        where: {
            id: req.params.id}
        })
    const comments = await models.Comment.findAll({})
    res.render('comment.ejs', {
        id: req.params.id,
        url: commentUrl,
        comments: comments
    })
})

app.post('/comment/:id', async (req, res) => {
    const comments = await models.Comment.create({ comment: req.body.comments})
    id = req.params.id
    res.redirect(`/comment/${id}`)
})

// app.put('/comment/:id', async (req, res) =>{

//     await models.Bookmark.update({
//         url: req.body.url,
//         comment: req.body.comment},
//         {where: {id: req.params.id}
//     })
//     res.redirect('/comment')
// })


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })