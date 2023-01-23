import express from 'express'
import path from 'path';
import cors from 'cors'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import e from 'express';
import admin from 'firebase-admin'
mongoose.set('strictQuery', true)
import fs from 'fs'

var serviceAccount = {
    "type": "service_account",
    "project_id": "usingstoragebucket",
    "private_key_id": "1f0aa9632d1046aa9791fb872cb1d41f00626c9a",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQChNLzeRk3jtTtr\nkAqImmqaQN+72594fDClmR4ekauM3DtJ5F9HQZJUW+HbpZ9SDqtq17xSdjvYzQaG\nZEr5uuBy5yWeQ6qX77q5l7JijMWbJYmqYs1BsbJIq9qQJXhlQG7ho9G7/wiQXUWH\nnmimsW+l6wuVxgauzmzsq0rRlOl7+QPqNj4ydtEXiWCgch7E4XrHnQB2FU4qB5YR\nfSRkS8wfn+SFgLB9LEcJhncL4BCQP47v0vjV4lSL39Gn14bJgHwlshO24WpFKFfR\nBJQ+1Sr3BZ5Zms+P+IsgfU1JGQVBI/8ZeSAIXfw++dVbVRFJSbFA98GFoNP6+eEf\nrdMYQDW1AgMBAAECggEAHXovAgcBhZ6VYbcKUg3IafHsZ2XCvI2a+KDtysGwyJZZ\nygp2KKmzF/VgMKGRpzfS/Pu7bim8Ckn9RDRRKGaVVbVyIcU2S8eUkYzNW+tpU9QS\nnwMnjLhxRQwVsG+FmyAj1mM1/gYluv4vMVwUP0zpQUHgUbAO90Z8UO+GhBnScu5c\npIWgMf136qqSMoEg598vvsAh76otpg0xdpx3/M4XAHx1BhQWp3icIjREx6ypaSxj\nzXQRZOP8PH4C7uvfC0FgFhMOhrUV5dbqyIJ3zR+bmHWIFEs/lQZe0Dg+3OUpuss1\nRHqdtBzYdzeAsnVvcuT/+rKj7wgBdjnWRmIxGRpl6QKBgQDZQQK6jG0udQCkwxg8\nXCd2pgI260SX/wdZ3NYtFRAOu0GcXJjdrGIePanzu+C7z2wT+Puy5tporwusihow\nUsxZwQ83qQEwV59clyNra/I2XZvqTqEHjs6lPTl8ABitoIRmraHDe4BQaVDo2bAA\nfmzuAT8XoDjaVksCQBpLkX5ViQKBgQC99MqLz9RT6CCVxi1BVm7nZ9zFdKkAzYSI\nBka0oc1cG1DJOtTZTZfSgehF8J8Y/DIyHe5oC3d47GbeMIbLmHlI4jYPN22t+YB8\nuyR99K2hbeEV4WMW1K7gThB0njWiFMg0KKjQiYATfl/UUeA9tHL4AmzUhVYFNL0L\nYHzQ/YE/zQKBgD0xzq71NxvK4S+HtJ/r5UHKaP1HL78QmuV5CusP78H2hPiiLHzk\nPY7/F4wL87VzK6JEk8FEvWiXRdaH3/CUofL2Km8nL6qKQ900xUlQ0pz1qSFKnJkg\nZJyuri57aHgfqquxZMtHUlFUGPI9vxGkitJPj5H8E4eMnvw3SjDW/prhAoGAbvbs\nyzehBVL4lgWqshxXtP5LTV2UzE9COGPSMfrDCCc8zhB7/mUBZ4tTsGebyPCqMfSi\nLE1mgVE31lvqokxzrUvX4JO0kojJshNwgdPJCiAx+KItTEz5yzZPDpDNK92QBkgq\nNYfdNYYBXPpnUCR1dMOV55/sXCYuuNKolz0/n5ECgYBuKgSxAgT4xCxVTjB4d+a8\ngz/TTmOSKRrGyfDkpXqAz/kB9ihdwzkkU2e2FkUG1+vP8GwkbABuIDRbUcwrgm8R\nFCjU3LgKW6OBFGL1F0jFdL2E3HyFWcmezR1upn9ucBNkZ9M9YUt8CwccQZ/jKL0O\ngYDMAi5TjTEB0W71pXFHbA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-uq87i@usingstoragebucket.iam.gserviceaccount.com",
    "client_id": "112198917033342141451",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-uq87i%40usingstoragebucket.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://usingstoragebucket.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://usingstoragebucket.appspot.com");

const storageConfig = multer.diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {

        console.log("mul-file: ", file);
        cb(null, `${new Date().getTime()}-${file.originalname}`)
    }
})
let uploadmiddleware = multer({ storage: storageConfig })
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
    password: { type: String, required: true },
    imageUrl: {type: String}
})
const userModels = mongoose.model('user', NewUserSchema)
// createData
app.post('/send-credentails', uploadmiddleware.any(), async (req, res) => {
    try {
        const body = await req.body
        if (!body.email) throw new Error('Email Is required')
        if (!body.password) throw new Error('Password is required')
        if (body.password.length < 8) throw new Error('Password Should be greater than 8 Characters')
        // if (!body.imageUrl) throw new Error('Please select and Image')
        
        req.body.email = req.body.email.toLowerCase()
        console.log("req.body: ", req.body);
        console.log("req.files: ", req.files);

        console.log("uploaded file name: ", req.files[0].originalname);
        console.log("file type: ", req.files[0].mimetype);
        console.log("file name in server folders: ", req.files[0].filename);
        console.log("file path in server folders: ", req.files[0].path);

        bucket.upload(
            req.files[0].path, {
            destination: `image/${req.files[0].filename}`,
        },
            function (err, file, apiResponse) {
                if (!err) {
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then((urlData, err) => {
                        if (!err) {
                            // console.log("public downloadable url: ", urlData[0])
                            
                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                            userModels.findOne({ email: body.email }, (err, user) => {
                                if (!err) {
                                    if (user) {
                                        res.status(404).send({
                                            message: "user Already Exist"
                                        })
                                    } else {
                                        userModels.create({
                                            email: body.email,
                                            password: body.password,
                                            imageUrl: urlData[0]
                                        },
                                            (err, saved) => {
                                                if (!err) {
                                                    res.send({
                                                        message: "Your Data is Submitted",
                                                        // data: saved
                                                    })
                                                } else throw new Error('Server Error')
                                            })
                                    }



                                }
                            })
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send();
                }
            });


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
                    message: "Data Getted"
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
                } else res.status(404).send('Request Unsuccessful')
            } else res.status(404).send('Request Unsuccessful')
        })
    } catch (error) {
        res.status(404).send({
            message: `${error}`
        })
    }
})

// app.put('/user/:id', async (req, res) => {

//     try {
//         const body = req.body;
//         const id = req.params.id;
//         if (!body.email && !body.password) throw new Error('Required Parameters are missing');
//         let data = await userModels.findByIdAndUpdate(id,
//             {
//                 email: body.email,
//                 password: body.password
//             },
//             { new: true }
//         ).exec();
//         res.status(300).send({
//             message: "Data Edited Successfully",
//             // user: data
//         })
//     } catch (error) {
//         res.send({
//             message: `${error}`
//         })
//     }
// })

app.put('/user/:id', uploadmiddleware.any(), async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    try {
        if (!body.email) throw new Error('Email Is required')
        if (!body.password) throw new Error('Password is required')
        if (body.password.length < 8) throw new Error('Password Should be greater than 8 Characters')
        bucket.upload(
            req.files[0].path, {
            destination: `image/${req.files[0].filename}`,
        },
            function (err, file, apiResponse) {
                if (!err) {
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then((urlData, err) => {
                        if (!err) {
                            // console.log("public downloadable url: ", urlData[0])
                            
                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                            userModels.findByIdAndUpdate(id,
                                {
                                    email: body.email,
                                    password: body.password,
                                    imageUrl: urlData[0]
                                },
                                { new: true }
                            ).exec();
                            // console.log('updated: ', data);
                            res.send({
                                message: "user modified successfully",
                                
                            });
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send("server Error");
                }
            });

       
    }
    catch (error) {
        res.status(500).send({
            message: `${error}`
        })
    }
})



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