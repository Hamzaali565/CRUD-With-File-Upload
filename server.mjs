import express from 'express'
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import e from 'express';
mongoose.set('strictQuery', true)

const app = express()
const port = process.env.PORT || 5001;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', "*"],
    credentials: true,
}));

let NewUserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})
const userModels = mongoose.model('user', NewUserSchema)
// createData
app.post('/send-credentails', async (req, res) => {
    try {
        const body = await req.body
        if (!body.email || !body.password) throw new Error('Required Parameters are Missing')
        userModels.create({
            email: body.email,
            password: body.password
        },
            (err, saved) => {
                if (!err) {
                    res.send({
                        message: "Your Data is Submitted",
                        data: saved
                    })
                } else throw new Error('Server Error')
            })
    } catch (error) {
        res.status(404).send({
            message: `${error}`
        })
    }
})
// all users
app.get('/users', async (req, res) => {
    try {
        userModels.find({}, (err, data) => {
            if (!err) {
                res.send({
                    data: data,
                    message: "product Getted"
                })
            } else throw new Error("Error")
        })
    } catch (error) {
        res.status(500).send({
            message: `${error}`
        })
    }
})
// deleteData
app.delete('/user/:id', async (req, res) => {
    try {
        const id = req.params.id
        userModels.deleteOne({ _id: id }, (err, deletedData) => {
            if (!err) {
                if (deletedData.deletedCount !== 0) {
                    res.status(200).send({
                        message: "User deleted Successfully"
                    })
                } else throw new Error('Request Unsuccessful')
            } else throw new Error('Server Error')
        })
    } catch (error) {
        res.status(404).send({
            message: `${error}`
        })
    }
})

app.put('/user/:id', async (req, res) => {
    
    try {
        const body = req.body;
        const id = req.params.id;
        if (!body.email && !body.password) throw new Error('Required Parameters are missing');
        let data = await userModels.findByIdAndUpdate(id,
            {
                email: body.email,
                password: body.password
            },
            { new: true }
        ).exec();
        res.status(300).send({
            message: "Data Edited Successfully",
            // user: data
        })
    } catch (error) {
        res.send({
            message: `${error}`
        })
    }
})

// app.put('/user/:id', async (req, res) => {

//     const body = req.body;
//     const id = req.params.id;

//     if (
//         !body.email ||
//         !body.password 
       
//     ) {
//         res.status(400).send(` required parameter missing. example request body:
//         {
//             "name": "value",
//             "price": "value",
//             "category": "value",
//             "description": "value"
//         }`)
//         return;
//     }
//     try {
//         let data = await userModels.findByIdAndUpdate(id,
//             {
//                 email: body.email,
//                 password: body.password,
//             },
//             { new: true }
//         ).exec();
//         console.log('updated: ', data);
//         res.send({
//             message: "user modified successfully",
//             data: data
//         });
//     }
//     catch (error) {
//         console.log("error: ", error)
//         res.status(500).send({
//             message: "server error"
//         })
//     }
// })



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
const __dirname = path.resolve();
app.use('/', express.static(path.join(__dirname, './Frontend/build')))
app.use('*', express.static(path.join(__dirname, './Frontend/build')))

const mongodbURI = process.env.mongodbURI ||
    "mongodb+srv://CRUD:hamzaali565@cluster0.kh990zg.mongodb.net/postings?retryWrites=true&w=majority";
/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Database is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});