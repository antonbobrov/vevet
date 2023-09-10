const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');

let contents = `const version = '${version}';`;
contents += '\nexport default version;';
contents += '\n';

fs.writeFileSync(path.resolve(__dirname, '../src/version.ts'), contents);
