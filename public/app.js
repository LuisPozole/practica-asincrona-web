// Referencias a los elementos del DOM
const btnCargar = document.getElementById('btnCargar');
const mensaje = document.getElementById('mensaje');
const listaProductos = document.getElementById('listaProductos');
const spinner = document.getElementById('spinner');
const controles = document.getElementById('controles');
const buscador = document.getElementById('buscador');
const filtroCategoria = document.getElementById('filtroCategoria');
const formularioContainer = document.getElementById('formularioContainer');
const formProducto = document.getElementById('formProducto');
const mensajeForm = document.getElementById('mensajeForm');

// Variable para almacenar los productos cargados
let productosGlobal = [];

// Evento para cargar productos
btnCargar.addEventListener('click', cargarProductos);

// Eventos para filtrar en tiempo real
buscador.addEventListener('input', filtrarProductos);
filtroCategoria.addEventListener('change', filtrarProductos);

// Evento para agregar un nuevo producto
formProducto.addEventListener('submit', agregarProducto);

/**
 * Función principal: Carga los productos desde la API usando Fetch + async/await
 */
async function cargarProductos() {
  // Mostrar spinner de carga
  spinner.style.display = 'flex';
  mensaje.textContent = '';
  listaProductos.innerHTML = '';
  controles.style.display = 'none';
  formularioContainer.style.display = 'none';

  try {
    // Se realiza la petición asíncrona al servidor usando Fetch API
    const respuesta = await fetch('/api/productos');

    // Verificamos que la respuesta sea exitosa
    if (!respuesta.ok) {
      throw new Error('No se pudo obtener la información');
    }

    // Se convierten los datos de JSON a un objeto JavaScript
    const productos = await respuesta.json();

    // Guardamos los productos para poder filtrarlos después
    productosGlobal = productos;

    // Ocultamos el spinner
    spinner.style.display = 'none';

    // Mostramos mensaje de éxito
    mensaje.textContent = `✅ ${productos.length} productos cargados correctamente`;
    mensaje.style.color = '#198754';

    // Mostramos los controles de búsqueda y filtro
    controles.style.display = 'flex';
    formularioContainer.style.display = 'block';

    // Poblamos el filtro de categorías
    llenarCategorias(productos);

    // Renderizamos los productos en el DOM
    renderizarProductos(productos);

  } catch (error) {
    spinner.style.display = 'none';
    mensaje.textContent = '❌ Ocurrió un error al cargar los productos';
    mensaje.style.color = '#dc3545';
    console.error(error);
  }
}

/**
 * Renderiza las tarjetas de productos en el DOM
 */
function renderizarProductos(productos) {
  listaProductos.innerHTML = '';

  // Mejora: Mensaje "sin resultados"
  if (productos.length === 0) {
    listaProductos.innerHTML = `
      <div class="sin-resultados">
        <span>🔍</span>
        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
      </div>
    `;
    return;
  }

  // Creamos y agregamos cada tarjeta de producto al DOM
  productos.forEach((producto, index) => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.style.animationDelay = `${index * 0.1}s`;

    // Se actualiza la interfaz (DOM) dinámicamente
    tarjeta.innerHTML = `
      <h3>${producto.nombre}</h3>
      <p><strong>Precio:</strong> $${producto.precio.toLocaleString('es-MX')}</p>
      <p><span class="categoria-badge">${producto.categoria}</span></p>
    `;

    listaProductos.appendChild(tarjeta);
  });
}

/**
 * Llena el select de categorías con las categorías únicas de los productos
 */
function llenarCategorias(productos) {
  const categorias = [...new Set(productos.map(p => p.categoria))];
  filtroCategoria.innerHTML = '<option value="todas">🗂 Todas las categorías</option>';
  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    filtroCategoria.appendChild(option);
  });
}

/**
 * Filtra los productos según el buscador y el filtro de categoría
 */
function filtrarProductos() {
  const textoBusqueda = buscador.value.toLowerCase().trim();
  const categoriaSeleccionada = filtroCategoria.value;

  let productosFiltrados = productosGlobal;

  // Filtro por texto de búsqueda (nombre)
  if (textoBusqueda) {
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(textoBusqueda)
    );
  }

  // Filtro por categoría
  if (categoriaSeleccionada !== 'todas') {
    productosFiltrados = productosFiltrados.filter(p =>
      p.categoria === categoriaSeleccionada
    );
  }

  renderizarProductos(productosFiltrados);
}

/**
 * Agrega un nuevo producto enviando una petición POST asíncrona
 */
async function agregarProducto(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombreProducto').value.trim();
  const precio = document.getElementById('precioProducto').value;
  const categoria = document.getElementById('categoriaProducto').value.trim();

  if (!nombre || !precio || !categoria) {
    mensajeForm.textContent = '⚠️ Todos los campos son obligatorios';
    mensajeForm.style.color = '#dc3545';
    return;
  }

  try {
    const respuesta = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio: parseFloat(precio), categoria })
    });

    if (!respuesta.ok) {
      throw new Error('Error al agregar el producto');
    }

    const nuevoProducto = await respuesta.json();

    // Agregamos el producto a la lista global y re-renderizamos
    productosGlobal.push(nuevoProducto);
    llenarCategorias(productosGlobal);
    filtrarProductos();

    // Limpiamos el formulario
    formProducto.reset();

    mensajeForm.textContent = `✅ Producto "${nuevoProducto.nombre}" agregado correctamente`;
    mensajeForm.style.color = '#198754';

  } catch (error) {
    mensajeForm.textContent = '❌ Error al agregar el producto';
    mensajeForm.style.color = '#dc3545';
    console.error(error);
  }
}
