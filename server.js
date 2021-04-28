const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();
app.engine('hbs', hbs());
app.set('view engine', 'hbs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname)
    }
})
const upload = multer({storage: storage})

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', { layout: false, name: req.params.name });
});

app.get('/about', (req, res) => {
  res.render('about', {layout: 'dark'});
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/contact/send-message', upload.single('design'), (req, res) => {
  const { author, sender, title, message } = req.body;
  const design = req.file ? req.file : null;
  if(author && sender && title && message && design) {
    res.render('contact', {isSent: true, file_name: design.originalname});
  }
  else {
    res.render('contact', {isError: true});
  }
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
