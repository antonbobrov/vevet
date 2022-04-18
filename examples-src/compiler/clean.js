const fs = require('fs');
const path = require('path');
const { PATHS } = require('../../paths');

// create html dir
if (!fs.existsSync(PATHS.pages.html)) {
    fs.mkdirSync(PATHS.pages.html);
}

// remove html files
fs.readdirSync(PATHS.pages.html).forEach((name) => {
    const fullPath = path.resolve(PATHS.pages.html, name);
    fs.unlink(fullPath, () => {});
});
