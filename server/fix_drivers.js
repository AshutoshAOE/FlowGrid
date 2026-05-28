const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  const DriverSchema = new mongoose.Schema({}, { strict: false });
  const Driver = mongoose.model('Driver', DriverSchema, 'drivers');
  await Driver.updateMany({ vehicleType: { $exists: false } }, { $set: { vehicleType: 'Truck' } });
  
  // Let's also fix the driver status for the shipment that got orphaned!
  const ShipmentSchema = new mongoose.Schema({}, { strict: false });
  const Shipment = mongoose.model('Shipment', ShipmentSchema, 'shipments');
  const orphanedShipments = await Shipment.find({ status: 'driver_assigned' });
  for (const s of orphanedShipments) {
    if (s.assignedDriver) {
      await Driver.updateOne({ _id: s.assignedDriver }, { $set: { status: 'ASSIGNED' } });
    }
  }

  console.log('Fixed drivers and orphaned shipments');
  process.exit();
});
