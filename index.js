const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const path = require('path')
const hbs = require('express-handlebars');
app.set('views', path.join(__dirname,'views'))
app.set('view engine','hbs')
app.engine('hbs', hbs.engine({
    extname:'hbs',
    defaultlayout: 'main',
    layoutsDir: __dirname +'/views/layouts',
}));

app.use(express.static(path.join(__dirname,'/public/')))

app.listen(3003, () => {
    console.log('web server is started')
})

const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});

app.get('/',(req, res) => {
    let sql = "SELECT * FROM article"
    con.query(sql, (err,result)=> {
        if(err) throw err;
        console.log(result)
        res.render('index', {
            articles: result
        })
    })

})

app.get('/article/:slug', (req, res) => {
    const slug = req.params.slug;

    const sql = `SELECT a.*, au.name AS author FROM article a, author au WHERE slug = "${req.params.slug}"AND a.author_id = au.id`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        const article = result;
        console.log(article)

        res.render('article', { article });
    });
});

app.get('/author/:author_id', (req, res) => {
    const author_id = req.params.author_id;

    let sql = `SELECT * FROM article WHERE author_id = ${author_id}`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        const articles = result;
        sql = `SELECT * FROM author WHERE id = ${author_id}`
        con.query(sql, (err, result) => {
            let author = result
            console.log(articles)
            console.log(author)
            res.render('author', {
                articles: articles,
                author: author
            });
        })
    });
});







