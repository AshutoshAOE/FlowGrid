const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  try {
    const { Driver } = require('./dist/modules/driver/driver.model.js');
    const { findNearestDriver } = require('./dist/modules/routing/routing.service.js');

    const drivers = await Driver.find({ status: 'AVAILABLE', isActive: true });
    console.log(`Found ${drivers.length} available drivers.`);
    
    const driverCoordinates = drivers
      .filter(d => d.currentCoordinates && d.currentCoordinates.lat && d.currentCoordinates.lng)
      .map(d => d.currentCoordinates);
    
    console.log(`Extracted ${driverCoordinates.length} valid coordinates.`);
    
    const origin = { lat: 18.5204, lng: 73.8567 }; // Pune warehouse
    console.log('Finding nearest driver...');
    const result = await findNearestDriver(origin, driverCoordinates);
    console.log('Result:', result);
  } catch (e) {
    console.error('Failed:', e.message);
    if (e.response) {
      console.error(e.response.data);
    }
  }
  process.exit();
});
