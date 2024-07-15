const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  // "*.{js,jsx,ts,tsx}": [buildEslintCommand],
  "*.{js, jsx,ts,tsx}": ["eslint --quiet --fix"],
  "*.{json,js,ts,jsx,tsx,html}": ["prettier --write --ignore-unknown"]
};
