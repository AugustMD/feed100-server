var app = require('./config/express')();
var conn = require('./config/db')(app);

var authMiddleware = require('./middlewares/auth');

var auth = require('./routes/auth')(conn);
var api = require('./routes/api')(conn);

var cors = require('cors')();

app.use(cors);

app.use('/auth/', auth);
app.use('/api/', authMiddleware);
app.use('/api/', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
