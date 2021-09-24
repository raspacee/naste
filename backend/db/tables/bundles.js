const db = require('../');

// title, syntax,
const table_name = 'bundles';

let query_text = `
CREATE TABLE bundles (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL
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