const CSVToJSON = require("csvtojson");
const fs = require("fs");

// This script will turn a CSV into a JSON file.
// Headers: Generic, Brand, Brand1, Brand2, Brand3, Brand4, Brand5
// Output: object with brands as keys and generic and values

CSVToJSON()
  .fromFile("book.csv")
  .then((drugs) => {
    const drugMap = {};
    for (const drug of drugs) {
      const { Generic, Brand, Brand1, Brand2, Brand3, Brand4, Brand5 } = drug;
      if (Brand) {
        drugMap[Brand] = Generic;
      }
      if (Brand1) {
        drugMap[Brand1] = Generic;
      }
      if (Brand2) {
        drugMap[Brand2] = Generic;
      }
      if (Brand3) {
        drugMap[Brand3] = Generic;
      }
      if (Brand4) {
        drugMap[Brand4] = Generic;
      }
      if (Brand5) {
        drugMap[Brand5] = Generic;
      }
    }

    fs.writeFile("book.json", JSON.stringify(drugMap, null, 2), (err) => {
      if (err) {
        throw err;
      }
      console.log("JSON array is saved.");
    });
  })
  .catch((err) => {
    // log error if any
    console.log(err);
  });
