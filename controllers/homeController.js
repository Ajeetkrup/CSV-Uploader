const fs = require("fs");
const { parse } = require("csv-parse");
const CSVUpload = require("../models/csvfile");
const { default: mongoose } = require("mongoose");

//home controller -shows list of file
module.exports.home = async function (req, res) {
  try {
    const files = await CSVUpload.find({});
    return res.render("home", {
      title: "Home",
      data: files || [],
    });
  } catch (err) {
    console.log("Error while finding files - ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/*
    Function for upload csv file using csv-parse and multer middleware
*/
module.exports.UploadCsv = function (req, res) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: "File not found" });
  }

  //file size limit check
  const fileSize = file.size;
  if (fileSize > 1024 * 1024 * 8) {
    return res
      .status(400)
      .json({ success: false, message: "Maximum file size limit reached" });
  }

  const parser = parse({ columns: true }, async (err, records) => {
    if (err) {
      console.error(err);
      return res
        .status(400)
        .json({ success: false, message: "An error occurred" });
    }

    if (records) {
      const currDate = new Date().toLocaleDateString();
      const fileName = file.originalname;
      const newCSVFile = new CSVUpload({
        name: fileName,
        data: records,
      });

      //saving file to db
      try {
        await newCSVFile.save();
        return res.status(200).json({ success: true, message: "Success" });
      } catch (err) {
        console.log("Error while saving file - ", err);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No data in CSV file" });
    }
  });

  fs.createReadStream(file.path).pipe(parser);
};

/*
send csv files to show csv files in tabular form
It takes file id from params and searches in db and send the required file.
*/
module.exports.showCSV = async function (req, res) {
  const fileId = req.params["fileId"];
  console.log(fileId);
  if (fileId) {
    try {
      const file = await CSVUpload.find({
        _id: new mongoose.Types.ObjectId(fileId),
      });

      return res.render("showCSV", {
        title:file[0].name,
        fileName: file[0].name,
        data: file[0].data || [],
      });
    } catch (err) {
      console.log("Error while finding file - ", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "File id not present" });
  }
};
