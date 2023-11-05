/*
    Model for CSV file
*/
const mongoose = require("mongoose");

const csvFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data:{
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

const CSVFileModel = mongoose.model("CSVFile", csvFileSchema);

module.exports = CSVFileModel;