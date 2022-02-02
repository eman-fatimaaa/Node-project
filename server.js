const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
var PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Started`)
});





MongoClient.connect("mongodb+srv://emanfatima:eman2003@cluster0.mj5gi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
        app.use(bodyParser.urlencoded({
            extended: true
        }))
        app.use(bodyParser.json())
        app.use(express.static('public'))





        app.get('/', (req, res) => {
            // res.sendFile(__dirname + '/index.html')
            db.collection('quotes').find().toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                    console.log(results)
                })
                .catch(error => console.error(error))

        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                { name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
                .then(result => res.json('Success')
                )
                .catch(error => console.error(error))
            // console.log(req.body)
        })
        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name }
            )
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json('Deleted Darth Vadar\'s quote')
                })
                .catch(error => console.error(error))
        })



    })
    .catch(error => console.error(error))


