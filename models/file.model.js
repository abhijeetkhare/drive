const mogoose = require('mongoose');
const user = require('./user');
const fileSchema = new mogoose.Schema({
    path: { type: String, required: [true , 'File path is required'] },
    orginalname: { type: String, required: [true , 'File original name is required'] },
    user: { type: mogoose.Schema.Types.ObjectId, ref: 'users', required: [true , 'User ID is required'] },
});

module.exports = mogoose.model('file', fileSchema);
