const db = require('./');

let query_text = `
DROP TABLE IF EXISTS pastes, bundles, jobs CASCADE;
`;

console.log('Dropping tables:');
db.query(query_text, [], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
})

