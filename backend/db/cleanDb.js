const db = require('./');

let query_text = `
TRUNCATE TABLE pastes, bundles, jobs CASCADE;
`;

console.log('Clearing tables:');
db.query(query_text, [], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
})

