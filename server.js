const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON (para el formulario de agregar productos)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos simulada de productos
const productos = [
  { id: 1, nombre: "Laptop", precio: 14500, categoria: "Tecnología" },
  { id: 2, nombre: "Mouse Gamer", precio: 650, categoria: "Accesorios" },
  { id: 3, nombre: "Teclado Mecánico", precio: 1200, categoria: "Accesorios" },
  { id: 4, nombre: "Monitor 24 pulgadas", precio: 3200, categoria: "Tecnología" },
  { id: 5, nombre: "Audífonos Bluetooth", precio: 980, categoria: "Audio" }
];

// Endpoint para obtener todos los productos
app.get('/api/productos', (req, res) => {
  // Simulamos un retardo de red de 1.5 segundos
  setTimeout(() => {
    res.json(productos);
  }, 1500);
});

// Endpoint para agregar un nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio, categoria } = req.body;

  if (!nombre || !precio || !categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    precio: parseFloat(precio),
    categoria
  };

  productos.push(nuevoProducto);

  res.status(201).json(nuevoProducto);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
