const path = require('path');

const PATHS = {
    cdn: {
        src: path.join(__dirname, '../src/cdn'),
        public: path.join(__dirname, '../dist/cdn'),
    },
    demo: {
        src: path.join(__dirname, '../demo'),
        public: path.join(__dirname, '../public-demo'),
        assets: 'assets/',
    },
};

exports.PATHS = PATHS;
