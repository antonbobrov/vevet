const fs = require('fs');
const path = require('path');

module.exports = function readFile (
    fileName,
    dir = path.join(__dirname, '..'),
) {
    const filePath = path.join(dir, fileName);
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content;
    } catch (e) {
        throw new Error(`File ${filePath} does not exist`);
    }
};
