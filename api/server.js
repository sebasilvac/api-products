import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';

const app = express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
    message: 'Welcome to this API.'
}));

const port = process.env.PORT || 8000;

app.listen(port, () => {
   console.log(`Server is running on PORT ${port}`);
});

export default app;