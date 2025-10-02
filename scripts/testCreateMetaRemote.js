const axios = require('axios');

const token = process.env.TEST_JWT || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGRjNDI0ZTNhNTM0MmJmODc2MWZiYzYiLCJpYXQiOjE3NTk0Mzg5MjQsImV4cCI6MTc2MDA0MzcyNH0.rPUcliMoe5dITZm3O9IGjsDIVDopqHy9WHXu1Y1mWPA';

(async () => {
  try {
    const res = await axios.post('https://rutinaappback.onrender.com/api/metas', {
      nombre: 'PruebaRemote',
      tipo: 'numerica',
      frecuencia: 'diaria',
      objetivoDiario: 1
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Status:', res.status);
    console.log('Body:', res.data);
  } catch (err) {
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error body:', err.response.data);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(1);
  }
})();
