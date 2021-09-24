
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cron = require('node-cron');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);

cron.schedule('0 0-23 * * *', () => {
    let text = `
    SELECT j.id, p.expire_date FROM jobs AS j
    INNER JOIN pastes AS p ON p.id = j.id
    WHERE j.finished = false;
    `;

    db.query(text, [], (err, result) => {
        if (err) {
            console.log(err);
            return;
        }

        for (let i = 0; i < result.rows.length; i++) {
            row = result.rows[i];

            if (moment(new Date()).isSameOrAfter(row.expire_date)) {
                let text = `
                DELETE FROM jobs
                WHERE id = $1;

                DELETE FROM pastes
                WHERE id = $1;
                `
                db.query(text, [row.id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return;
                    }

                    console.log('Successfully deleted a expired paste');
                })
            }
        }
    });
});

module.exports = app;
