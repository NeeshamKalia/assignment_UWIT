const mongoose = require('mongoose');

//checking validation
const isValid = function (value) {
    if(value === "") {return false}
    if( typeof value === 'undefined' || value === null) { return false; }
    if( typeof value    === 'string' && value.trim().length === 0) { return false; }
    return true;
}

const isValidObjectId = function (value) {
    return mongoose.isValidObjectId(value);
}

const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0;
}



module.exports = {isValid, isValidRequestBody, isValidObjectId,};
