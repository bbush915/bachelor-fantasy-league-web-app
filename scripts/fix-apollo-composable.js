const fs = require("fs");
const path = require("path");

const useQueryPath = path.resolve(
  __dirname,
  "../node_modules/@vue/apollo-composable/dist/useQuery.js"
);

fs.writeFileSync(
  useQueryPath,
  fs
    .readFileSync(useQueryPath, "utf8")
    .replace(/onServerPrefetch,/, "")
    .replace(/\:\sonServerPrefetch\(/, ": (")
    .replace(/onServerPrefetch/, "null")
    .replace(/(.* require\("vue"\);)/m, "")
);
