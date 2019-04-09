module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    jest: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "import/extensions": 0,
		"global-require": 0,
		"eol-last": 0,
		"no-param-reassign": 0,
		"object-curly-newline": 0,
		"no-plusplus": 0,
		"max-len": [
			2,
			{
				"code": 160
			}
		],
		"prefer-destructuring": [
			2,
			{
				"object": true,
				"array": false
			}
		]
  },
  parserOptions: {
    parser: "@typescript-eslint/parser"
  }
};
