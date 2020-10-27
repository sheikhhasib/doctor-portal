const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const fileUpload = require('express-fileupload');

require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1hh0e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('doctors'));
app.use(fileUpload());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const appointmentCollection = client.db("doctorsPortal").collection("appointments");

    app.post("/addAppointment", (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
            .then(result => {
                res.send(result)
            })
    })

    app.post("/appointmentsByDate", (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({date:date.date})
            .toArray((err, documents) => {
                res.send(documents);
                // console.log(documents);
            })
    })

    app.post('/addADoctor',(req, res)=>{
        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;

        console.log(name ,email,file);

        file.mv(`${__dirname}/doctors/${file.name}`,err=>{
            if(err){
                console.log(err);
                return res.status(500).send({msg: 'Failed to upload Image'})
            }
            return res.send({name:file.name,path:`/${file.name}`})
        })

    })

    
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(5000)