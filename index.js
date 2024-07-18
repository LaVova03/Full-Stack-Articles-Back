import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js';
import { handleValidationErrors, CheckAuth } from './utils/index.js';
import multer from 'multer';
import fs from 'fs';
import cors from 'cors';


const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

mongoose
    .connect('mongodb+srv://davidvovchik:davidvovchik@cluster.ezvr4bo.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster')
    .then(() => {
        console.log("DB OK");
    })
    .catch((err) => {
        console.log('DB error', err)
    })

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());

app.use(cors());

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', CheckAuth, UserController.getMe);

app.post('/upload', CheckAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags);
app.post('/posts', CheckAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', CheckAuth, PostController.remove);
app.put('/posts/:id', CheckAuth, PostController.update);

// app.listen(8081, (err) => {
//     if (err) {
//         return console.log(err)
//     } else {
//         console.log('Serveer OK')
//     }
// });