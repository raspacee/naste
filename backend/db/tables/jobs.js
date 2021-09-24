const db = require('../');

// title, syntax,
const table_name = 'jobs';

let query_text = `
CREATE TABLE jobs (
    id UUID PRIMARY KEY REFERENCES pastes(id),
    created_date TIMESTAMP NOT NULL,
    finished BOOLEAN NOT NULL
);
`;

console.log('Creating table:', table_name);
db.query(query_text, [], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
});

module.exports = table_name;