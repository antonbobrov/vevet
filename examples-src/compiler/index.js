const fs = require('fs');
const path = require('path');
const pug = require('pug');
const { PATHS } = require('../../config/paths');
const getPagesPaths = require('./getPagesPaths');
const readFile = require('./readFile');

// create html dir
if (!fs.existsSync(PATHS.pages.html)) {
    fs.mkdirSync(PATHS.pages.html);
}

// compile files
const pagesPaths = getPagesPaths();
pagesPaths.forEach((obj) => {
    // compile pug
    const html = pug.compileFile(obj.pug, {
        pretty: true,
        cache: false,
    });
    // pass data
    const result = html({
        readFile,
        dir: path.dirname(obj.pug),
    });

    // write into file
    fs.writeFile(obj.html, result, (err) => {
        if (err) {
            throw err;
        }
        console.log(`------ The file has been saved! ${obj.filename} ------`);
    });
});
