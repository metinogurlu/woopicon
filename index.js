const fs = require('fs');
const emailParser = require('./src/emailParser');

fs.readFile('./table.html', null, (err, data) => {
    if(err)
        console.log(err);

    emailParser(data);
});