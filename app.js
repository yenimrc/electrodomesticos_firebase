import { db, collection, getDocs } from './firebase-config.js';

class TiendaElectrodomesticos {
    constructor() {
        this.productos = [];
        this.categoriaFiltro = 'todos';
        this.init();
    }

    async init() {
        await this.cargarProductos();
        this.setupEventListeners();
    }

    async cargarProductos() {
        try {
            const querySnapshot = await getDocs(collection(db, "electrodomesticos"));
            this.productos = [];
            
            querySnapshot.forEach((doc) => {
                this.productos.push({ id: doc.id, ...doc.data() });
            });

            this.mostrarProductos();
        } catch (error) {
            console.error("Error cargando productos:", error);
            document.getElementById('productos-container').innerHTML = 
                '<div class="error">Error al cargar los productos</div>';
        }
    }

    mostrarProductos() {
        const container = document.getElementById('productos-container');
        
        const productosFiltrados = this.categoriaFiltro === 'todos' 
            ? this.productos 
            : this.productos.filter(producto => producto.categoria === this.categoriaFiltro);

        if (productosFiltrados.length === 0) {
            container.innerHTML = '<div class="loading">No hay productos en esta categoría</div>';
            return;
        }

        container.innerHTML = productosFiltrados.map(producto => `
            <div class="producto-card" data-categoria="${producto.categoria}">
                <div class="producto-imagen">
                    ${producto.imagen ? 
                        `<img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 100%; max-height: 200px;">` : 
                        '📺 Imagen no disponible'
                    }
                </div>
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-marca">Marca: ${producto.marca}</div>
                <div class="producto-precio">$${producto.precio}</div>
                <div class="producto-stock">Stock: ${producto.stock} unidades</div>
                <div class="producto-descripcion">${producto.descripcion}</div>
                <button class="btn-agregar" onclick="tienda.agregarAlCarrito('${producto.id}')">
                    🛒 Agregar al Carrito
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Filtros por categoría
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.categoriaFiltro = e.target.dataset.categoria;
                this.mostrarProductos();
            });
        });
    }

    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (producto) {
            alert(`✅ ${producto.nombre} agregado al carrito!\nPrecio: $${producto.precio}`);
            // Aquí puedes agregar la lógica para el carrito de compras
        }
    }
}

// Inicializar la tienda
const tienda = new TiendaElectrodomesticos();
