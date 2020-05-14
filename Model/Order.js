const mongoose = require('mongoose');
const orderschema = new mongoose.Schema({
    Array: { type: Array, required: true },
    UserName: { type: String, required: true },
    Date: { type: Date, default: Date.now() },
    processing: { type: String, default: 'processing' }

},
    { collection: 'Order' });
module.exports = mongoose.model('Order', orderschema);









