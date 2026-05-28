const mongoose = require('mongoose');

const WAREHOUSES = [
  { lat: 21.1458, lng: 79.0882 }, // Nagpur
  { lat: 18.5204, lng: 73.8567 }, // Pune
  { lat: 19.076,  lng: 72.8777 }, // Mumbai
  { lat: 28.7041, lng: 77.1025 }, // Delhi
  { lat: 12.8452, lng: 77.6602 }, // Bangalore
];

mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  const DriverSchema = new mongoose.Schema({}, { strict: false });
  const Driver = mongoose.model('Driver', DriverSchema, 'drivers');
  
  const drivers = await Driver.find({});
  for (const d of drivers) {
    if (!d.currentCoordinates || !d.currentCoordinates.lat) {
      const base = WAREHOUSES[Math.floor(Math.random() * WAREHOUSES.length)];
      const lat = base.lat + (Math.random() - 0.5) * 0.05;
      const lng = base.lng + (Math.random() - 0.5) * 0.05;
      
      await Driver.updateOne({ _id: d._id }, { $set: { currentCoordinates: { lat, lng } } });
    }
  }

  console.log('Added coordinates to existing drivers');
  process.exit();
});
