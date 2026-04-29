require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const storage = multer.diskStorage({
    destination: '../src/assets',
    filename: function (req, file, cb){
    cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});
const app = express();
app.use(cors());
app.use(express.json());

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    allowExitOnIdle: true
}
const db = pgp(cn)
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(session({
    store: new pgSession({
        pgPromise: db
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000, secure: false }
}));

const authenticatenSession = (req, res, next) => {
    if (req.session.id_author) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

app.post('/login', upload.none(), (req, res) => {
    const { username, password } = req.body;

    db.oneOrNone("SELECT * FROM author WHERE username=$1", [username])
    .then((data) => {
        if (data != null) {
            if (data.password == password) {
                req.session.id_author = data.id_author;
                req.session.save(function (err) {
                    if (err) return next(err)
                })
                res.send(req.session);
            } else {
                res.status(401).send('Invalid email/password');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    })
    .catch((error) => console.log('ERROR: ', error));
});

app.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if (err) {
            res.status(500).json({ error: 'Failed to destroy session' });
        } else {
            res.json({ message: 'Logged out successfully' });
        }
    });
});

app.get('/session-info', (req, res) => {
    res.json(req.session );
});

app.get('/posts', (req, res) => {   
    db.any('SELECT post.*, author.name as author_name FROM public.post JOIN public.author ON post.id_author = author.id_author ORDER BY post.id_post ASC')
    .then((data) => res.json(data))
    .catch((error) => console.log('ERROR:', error));
});

app.get('/authors', (req, res) => {
    db.any('SELECT * FROM public.author ORDER BY name ASC')
    .then((data) => res.json(data))
    .catch((error) => {
        console.log('ERROR:', error);
        res.status(500).json({ error: error.message });
    });
});

app.get('/authors/:id_author', authenticatenSession, (req, res) => {
    db.one('SELECT *, TO_CHAR(dob, "DD/MM/YYYY") as dob FROM public.author WHERE id_author=$1', [req.params.id_author])
    .then((data) => res.json(data))
    .catch((error) => {
        console.log('ERROR:', error);
    });
});

app.post('/posts/new', upload.single('img'), function(req, res){
    db.none("INSERT INTO public.post (title, text, image, id_author) VALUES($1, $2, $3, $4)",
        [req.body.title, req.body.text, req.file.originalname, req.body.id_author])
    .then(() => res.json({ message: 'Post agregado correctamente' }))
    .catch((error) => {
        console.log('ERROR: ', error);
        res.status(500).json({ error: error.message });
    });
});

app.get('/posts/:id_post', (req, res) => {
    db.one(
        'SELECT post.*, author.name as author_name FROM public.post JOIN public.author ON post.id_author = author.id_author WHERE post.id_post=$1',
        [req.params.id_post]
    )
    .then((data) => res.json(data))
    .catch(
        (error) => {
            console.log('ERROR:', error);
            res.status(500).json({ error: error.message });
        }
    );
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriéndose en el puerto ${process.env.PORT}`);
});