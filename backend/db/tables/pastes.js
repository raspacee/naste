const db = require('../');

// title, syntax,
const table_name = 'pastes';

let query_text = `
CREATE TABLE IF NOT EXISTS ${table_name} (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_date TIMESTAMP NOT NULL,
    expire_date TIMESTAMP,
    lock_passwd VARCHAR(20),
    syntax_hl VARCHAR(15) NOT NULL,
    views INTEGER NOT NULL,
    delete_on_views SMALLINT,
    bundle_id UUID REFERENCES bundles(id)
);`;

console.log('Creating table:', table_name);
db.query(query_text, [], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
})

module.exports = table_name;