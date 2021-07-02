const path = require('path');

exports.PATHS = {
    src: {
        path: path.join(__dirname, '..', 'src'),
        ts: path.join(__dirname, '..', 'src/ts'),
        cdn: path.join(__dirname, '..', 'src/cdn'),
    },
    build: {
        cdn: path.join(__dirname, '..', 'build/cdn'),
    },
};
