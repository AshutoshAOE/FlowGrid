const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/flowgrid').then(async () => {
  const { Driver } = require('./dist/modules/driver/driver.model.js');
  const { routingService } = require('./dist/modules/routing/routing.service.js');
  const { ORSProvider } = require('./dist/modules/routing/providers/ors.provider.js');
  
  const provider = new ORSProvider();

  const drivers = await Driver.find({ status: 'AVAILABLE', isActive: true });
  console.log(`Found ${drivers.length} available drivers.`);
  
  const driverCoordinates = drivers
    .filter(d => d.currentCoordinates && d.currentCoordinates.lat && d.currentCoordinates.lng)
    .map(d => d.currentCoordinates);
  
  console.log(`Extracted ${driverCoordinates.length} valid coordinates.`);
  console.log(driverCoordinates);

  if (driverCoordinates.length > 0) {
    try {
      const origin = { lat: 18.5204, lng: 73.8567 }; // Pune warehouse
      console.log('Calculating matrix...');
      const matrix = await provider.calculateMatrix(driverCoordinates, [origin]);
      console.log('Matrix result:', matrix);
    } catch (e) {
      console.error('Matrix failed:', e.message);
      if (e.response) {
        console.error('Response data:', e.response.data);
      }
    }
  }

  process.exit();
});
