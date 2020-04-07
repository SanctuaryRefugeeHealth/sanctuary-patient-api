import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import api from './api';
import config from './config';
import initializeDb from './db';
import middleware from './middleware';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

// connect to db
initializeDb(db => {

	// internal middleware
	app.use(middleware({ config, db }));

	// api router
	app.use('/api', api({ config, db }));

	app.server.listen(config.port, () => {
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
