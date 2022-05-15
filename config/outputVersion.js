const fs = require('fs');
const { PATHS } = require('../paths');
const { version } = require('../package.json');

let contents = `const version = '${version}';`;
contents += '\nexport default version;';
contents += '\n';

fs.writeFileSync(`${PATHS.src.ts}/version.ts`, contents);
