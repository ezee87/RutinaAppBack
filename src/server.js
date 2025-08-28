const app = require('./app');

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Swagger docs disponibles en http://localhost:${PORT}/api-docs`);
});
