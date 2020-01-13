const fs = require('fs');

const fileName = 'dist/types/types.d.ts';
const str = 'export = Vevet;\n\r';

const data = fs.readFileSync(fileName);
const fd = fs.openSync(fileName, 'w+');
const insert = new Buffer(str);
fs.writeSync(fd, insert, 0, insert.length, 0);
fs.writeSync(fd, data, 0, data.length, insert.length);
fs.close(fd, (err) => {
    if (err) throw err;
});