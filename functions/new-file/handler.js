"use strict";

module.exports = (event, context) => {
  try {
      if(event.body !== {}) {
          console.log(event);
      }
    context.status(200).succeed("TU vi");
  } catch (error) {
    console.log("TCL: error", error);
    context.status(400).fail(error);
  }
};
