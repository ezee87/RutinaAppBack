const axios = require('axios');

const token = process.env.TEST_JWT || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGRjNDI0ZTNhNTM0MmJmODc2MWZiYzYiLCJpYXQiOjE3NTk0Mzg5MjQsImV4cCI6MTc2MDA0MzcyNH0.rPUcliMoe5dITZm3O9IGjsDIVDopqHy9WHXu1Y1mWPA';

const ids = ['68def53858cee67fe7723601', '68def6a13b19367d0cf4fdab'];

(async () => {
  for (const id of ids) {
    try {
      const res = await axios.delete(`https://rutinaappback.onrender.com/api/metas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Deleted', id, 'status', res.status);
    } catch (err) {
      if (err.response) {
        console.error('Failed', id, 'status', err.response.status, err.response.data);
      } else {
        console.error('Request error for', id, err.message);
      }
    }
  }
})();
