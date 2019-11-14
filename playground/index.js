const express = require("express");
const app = express();
// const widthHeight = require("../functions/width-height/handler");

// widthHeight();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Playground is running on PORT ${PORT}`);
});
