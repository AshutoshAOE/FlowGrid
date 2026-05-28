const axios = require('axios');
require('dotenv').config({ path: '.env' });

async function run() {
  try {
    const locations = [
      [73.8567, 18.5204], // Driver 1
      [72.8777, 19.076],  // Warehouse
    ];
    
    const body = {
      locations,
      metrics: ['distance', 'duration'],
      sources: [0],
      destinations: [1]
    };
    
    console.log('API Key:', process.env.ORS_API_KEY ? 'Present' : 'Missing');
    
    const response = await axios.post('https://api.openrouteservice.org/v2/matrix/driving-car', body, {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (e) {
    console.error('Matrix failed:', e.message);
    if (e.response) {
      console.error(e.response.data);
    }
  }
}

run();
