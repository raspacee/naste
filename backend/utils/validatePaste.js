
const rules = require('../db/tableRules.js');

const syntax_array = ['NONE', 'JS', 'C', 'C++', 'PY', 'RUBY', 'JAVA', 'GO', 'TS'];

// Check if the data of a paste are valid
// Returns true for valid and false for invalid
module.exports = function (data) {
    if (Object.keys(data).length === 0) {
        return false;
    }

    try {
        if (data.title === null || data.body === null || data.title === '' || data.body === '') {
            return false;
        }

        if (!(syntax_array.includes(data.syntax.toUpperCase()))) {
            return false;
        }

        if (data.title.length > rules.TITLE_LENGTH || data.body.length > rules.BODY_LENGTH || data.passwd.length > PASSWD_LENGTH || data.syntax.length > rules.SYNTAX_LENGTH) {
            return false;
        }
    } catch (err) {
        console.log('validatePaste.js: Some properties maybe null');
    }

    return true;
};