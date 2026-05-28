const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  const ShipmentSchema = new mongoose.Schema({}, { strict: false });
  const Shipment = mongoose.model('Shipment', ShipmentSchema, 'shipments');
  const shipments = await Shipment.find().sort({ createdAt: -1 }).lean();
  
  for (const s of shipments) {
    if (s.optimizationMetadata) {
      console.log('Shipment ID:', s._id, s.status);
      console.log(JSON.stringify(s.optimizationMetadata, null, 2));
      console.log('---');
    }
  }
  process.exit();
});
