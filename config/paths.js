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
    pages: {
        pages: path.join(__dirname, '..', 'examples-src', 'pages'),
        html: path.join(__dirname, '..', 'examples-src', 'html'),
        ts: path.join(__dirname, '..', 'examples-src', 'ts'),
        static: path.join(__dirname, '..', 'examples-src', 'static'),
        build: path.join(__dirname, '..', 'examples-build'),
    },
};
