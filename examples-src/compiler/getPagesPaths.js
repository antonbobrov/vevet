const path = require('path');
const fs = require('fs');
const { PATHS } = require('../../config/paths');

const rootDir = PATHS.pages.pages;

module.exports = function getPagesPaths () {
    return processDir(rootDir);
};

/**
 * @typedef {object} Page
 * @property {string} pug
 * @property {string} html
 * @property {string} filename
 */

/**
 * @param {string} dir
 * @param {Page} arr
 * @returns {Page[]}
 */
function processDir (dir, arr = []) {
    fs.readdirSync(dir).forEach((name) => {
        const fullPath = path.resolve(dir, name);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            if (name !== '_layout') {
                processDir(fullPath, arr);
            }
            return;
        }

        if (path.extname(fullPath) !== '.pug') {
            return;
        }

        // get paths
        const additionalPaths = fullPath.replace(`${rootDir}\\`, '').replace(name, '');
        const htmlPath = path.resolve(PATHS.pages.html, additionalPaths, name)
            .replace('.pug', '.html');

        // create directory if it doesn't exist
        const targetHtmlDir = path.resolve(PATHS.pages.html, additionalPaths);
        if (!fs.existsSync(targetHtmlDir)) {
            fs.mkdirSync(targetHtmlDir, {
                recursive: true,
            });
        }

        // get file name with short path
        const shortPathName = additionalPaths + name.replace('.pug', '');

        // add to stack
        arr.push({
            pug: fullPath,
            html: htmlPath,
            filename: shortPathName,
        });
    });
    return arr;
}
