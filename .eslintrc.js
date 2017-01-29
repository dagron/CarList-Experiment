module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "browser": true,
        "mocha": true
    },
    "parser": "babel-eslint",
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      "no-underscore-dangle": 0,
      "prefer-const": 0
    }
};
