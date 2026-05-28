const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  const ShipmentSchema = new mongoose.Schema({}, { strict: false });
  const Shipment = mongoose.model('Shipment', ShipmentSchema, 'shipments');
  const shipments = await Shipment.find({ "optimizationMetadata.factors": { $exists: true } }).sort({ createdAt: -1 }).limit(1).lean();
  
  if (shipments.length > 0) {
    const s = shipments[0];
    console.log(JSON.stringify(s.optimizationMetadata, null, 2));
    console.log('Shipment ID:', s._id);
    console.log('Status:', s.status);
    console.log('UpdatedAt:', s.updatedAt);
  } else {
    console.log('No metadata found.');
  }
  process.exit();
});
