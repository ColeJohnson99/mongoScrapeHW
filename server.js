//dependencies
const express = require('express'),
 mongoose = require('mongoose'),
 exphbs = require('express-handlebars'),
 bodyParser = require('body-parser'),
 logger = require('morgan'),
 path = require('path'),
 favicon = require('serve-favicon');

const app = express();

const config = require('./config/database');
mongoose.Promise = Promise;
mongoose
  .connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then( result => {
    console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
  })
  .catch(err => console.log('There was an error with your connection:', err));

app.use(logger('dev'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles',express.static(path.join(__dirname, 'public')));
app.use('/notes',express.static(path.join(__dirname, 'public')));

const index = require('./routes/index'),
      articles = require('./routes/articles'),
      notes = require('./routes/notes'),
      scrape = require('./routes/scrape');

app.use('/', index);
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);


const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});

