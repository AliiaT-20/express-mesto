module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "allow": ["_id"],
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "airbnb-base"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
};