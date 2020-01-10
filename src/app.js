const { analyze } = require("./controllers/analyzeController");
const { writeReport } = require("./controllers/reportController");
const { time } = require("./config/analyze");

setInterval(async () => {
  let data = await analyze();
  if (data) {
    await writeReport(data);
  }
}, time);
