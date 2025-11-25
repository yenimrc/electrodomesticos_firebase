import { 
  db, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from './config_firebase.js';

class TiendaElectrodomesticos {
    constructor() {
        this.productos = [];
        this.categoriaFiltro = 'todos';
        this.productoEditando = null;
        this.init();
    }

    async init() {
        await this.cargarProductos();
        this.setupEventListeners();
        console.log("✅ CRUD inicializado correctamente");
    }

    // CREATE - Crear producto
    async crearProducto(productoData) {
        try {
            const docRef = await addDoc(collection(db, "electrodomesticos"), productoData);
            console.log("✅ Producto creado con ID:", docRef.id);
            
            this.productos.push({ id: docRef.id, ...productoData });
            this.mostrarProductos();
            this.limpiarFormulario();
            
            return docRef.id;
        } catch (error) {
            console.error("❌ Error creando producto:", error);
            
            // Si hay error con Firebase, usar datos locales
            const nuevoId = 'local-' + Date.now();
            this.productos.push({ id: nuevoId, ...productoData });
            this.mostrarProductos();
            this.limpiarFormulario();
            
            alert("✅ Producto creado localmente (Firebase no disponible)");
            return nuevoId;
        }
    }

    // READ - Cargar productos
    async cargarProductos() {
        try {
            console.log("📡 Intentando conectar con Firebase...");
            const querySnapshot = await getDocs(collection(db, "electrodomesticos"));
            this.productos = [];
            
            querySnapshot.forEach((doc) => {
                this.productos.push({ id: doc.id, ...doc.data() });
            });

            console.log(`📦 ${this.productos.length} productos cargados desde Firebase`);

            // Si no hay productos en Firebase, cargar datos de prueba
            if (this.productos.length === 0) {
                console.log("🔄 No hay productos en Firebase, cargando datos de prueba...");
                this.cargarDatosDePrueba();
            } else {
                this.mostrarProductos();
            }

        } catch (error) {
            console.error("❌ Error cargando productos:", error);
            console.log("🔄 Cargando datos de prueba debido a error...");
            this.cargarDatosDePrueba();
        }
    }

    // Cargar datos de prueba
    cargarDatosDePrueba() {
        this.productos = [
            {
                id: "1",
                nombre: "Refrigerador Samsung Side by Side",
                categoria: "refrigeracion",
                precio: 899.99,
                stock: 15,
                marca: "Samsung",
                descripcion: "Refrigerador side by side 500L con dispensador de agua y hielo, tecnología inverter"
            },
            {
                id: "2",
                nombre: "Lavadora LG Carga Frontal", 
                categoria: "lavado",
                precio: 599.99,
                stock: 8,
                marca: "LG",
                descripcion: "Lavadora carga frontal 18kg con tecnología Inverter y 6 motion"
            },
            {
                id: "3",
                nombre: "Microondas Panasonic Digital",
                categoria: "cocina",
                precio: 129.99,
                stock: 25,
                marca: "Panasonic", 
                descripcion: "Microondas 30L con panel digital, 10 niveles de potencia y funciones automáticas"
            },
            {
                id: "4",
                nombre: "Cocina Whirlpool 4 Hornillas",
                categoria: "cocina", 
                precio: 459.99,
                stock: 12,
                marca: "Whirlpool",
                descripcion: "Cocina de gas 4 hornillas con horno autolimpiante y encendido automático"
            },
            {
                id: "5",
                nombre: "Aire Acondicionado Split",
                categoria: "climatizacion",
                precio: 699.99,
                stock: 6,
                marca: "Mabe",
                descripcion: "Aire acondicionado split 12000 BTU con tecnología inverter y control wifi"
            },
            {
                id: "6",
                nombre: "Televisor LG 55\" 4K",
                categoria: "entretenimiento",
                precio: 799.99,
                stock: 10,
                marca: "LG",
                descripcion: "Smart TV 55 pulgadas 4K UHD con webOS, HDR y Alexa integrada"
            }
        ];

        console.log(`🎁 ${this.productos.length} productos de prueba cargados`);
        this.mostrarProductos();
    }

    // UPDATE - Actualizar producto
    async actualizarProducto(id, productoData) {
        try {
            // Si es un ID local, no intentar con Firebase
            if (id.startsWith('local-')) {
                const index = this.productos.findIndex(p => p.id === id);
                if (index !== -1) {
                    this.productos[index] = { id, ...productoData };
                }
                this.mostrarProductos();
                this.limpiarFormulario();
                alert('✅ Producto actualizado localmente');
                return;
            }

            const productoRef = doc(db, "electrodomesticos", id);
            await updateDoc(productoRef, productoData);
            console.log("✅ Producto actualizado:", id);
            
            const index = this.productos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.productos[index] = { id, ...productoData };
            }
            
            this.mostrarProductos();
            this.limpiarFormulario();
            alert('✅ Producto actualizado correctamente');
            
        } catch (error) {
            console.error("❌ Error actualizando producto:", error);
            
            // Si falla Firebase, actualizar localmente
            const index = this.productos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.productos[index] = { id, ...productoData };
            }
            this.mostrarProductos();
            this.limpiarFormulario();
            alert('✅ Producto actualizado localmente (Firebase no disponible)');
        }
    }

    // DELETE - Eliminar producto
    async eliminarProducto(id) {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            return;
        }
        
        try {
            // Si es un ID local, no intentar con Firebase
            if (!id.startsWith('local-')) {
                await deleteDoc(doc(db, "electrodomesticos", id));
            }
            
            console.log("✅ Producto eliminado:", id);
            this.productos = this.productos.filter(p => p.id !== id);
            this.mostrarProductos();
            alert('✅ Producto eliminado correctamente');
            
        } catch (error) {
            console.error("❌ Error eliminando producto:", error);
            
            // Si falla Firebase, eliminar localmente
            this.productos = this.productos.filter(p => p.id !== id);
            this.mostrarProductos();
            alert('✅ Producto eliminado localmente (Firebase no disponible)');
        }
    }

    // Mostrar productos en la interfaz
    mostrarProductos() {
        const container = document.getElementById('productos-container');
        
        const productosFiltrados = this.categoriaFiltro === 'todos' 
            ? this.productos 
            : this.productos.filter(producto => producto.categoria === this.categoriaFiltro);

        if (productosFiltrados.length === 0) {
            container.innerHTML = `
                <div class="loading" style="grid-column: 1 / -1;">
                    <h3>📭 No hay productos en esta categoría</h3>
                    <p>Usa el formulario de arriba para agregar nuevos productos</p>
                </div>
            `;
            return;
        }

        container.innerHTML = productosFiltrados.map(producto => `
            <div class="producto-card" data-categoria="${producto.categoria}">
                <div class="producto-imagen">
                    ${this.getIconoCategoria(producto.categoria)}
                </div>
                <div class="producto-nombre">${producto.nombre}</div>
                <div class="producto-marca">🏷️ ${producto.marca}</div>
                <div class="producto-precio">💰 $${producto.precio}</div>
                <div class="producto-stock">📦 ${producto.stock} unidades</div>
                <div class="categoria-icon">${this.getNombreCategoria(producto.categoria)}</div>
                <div class="producto-descripcion">${producto.descripcion}</div>
                <div class="producto-actions">
                    <button class="btn btn-warning" onclick="tienda.editarProducto('${producto.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="tienda.eliminarProducto('${producto.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `).join('');

        console.log(`🎯 Mostrando ${productosFiltrados.length} productos`);
    }

    // Obtener icono según categoría
    getIconoCategoria(categoria) {
        const iconos = {
            'refrigeracion': '❄️',
            'lavado': '🧼',
            'cocina': '🍳',
            'climatizacion': '🌡️',
            'entretenimiento': '📺'
        };
        return iconos[categoria] || '📦';
    }

    // Obtener nombre de categoría
    getNombreCategoria(categoria) {
        const nombres = {
            'refrigeracion': 'Refrigeración',
            'lavado': 'Lavado',
            'cocina': 'Cocina',
            'climatizacion': 'Climatización',
            'entretenimiento': 'Entretenimiento'
        };
        return nombres[categoria] || categoria;
    }

    // Editar producto (cargar datos en formulario)
    editarProducto(id) {
        const producto = this.productos.find(p => p.id === id);
        if (!producto) return;

        this.productoEditando = id;
        
        // Llenar formulario con datos del producto
        document.getElementById('producto-id').value = id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('marca').value = producto.marca;
        document.getElementById('descripcion').value = producto.descripcion;
        
        // Cambiar botón a "Actualizar"
        document.getElementById('btn-guardar').textContent = '💾 Actualizar Producto';
        document.getElementById('btn-guardar').className = 'btn btn-success';
        document.getElementById('btn-cancelar').classList.remove('hidden');
        
        // Scroll al formulario
        document.querySelector('.admin-panel').scrollIntoView({ behavior: 'smooth' });
    }

    // Cancelar edición
    cancelarEdicion() {
        this.productoEditando = null;
        this.limpiarFormulario();
    }

    // Limpiar formulario
    limpiarFormulario() {
        document.getElementById('producto-form').reset();
        document.getElementById('producto-id').value = '';
        document.getElementById('btn-guardar').textContent = '➕ Agregar Producto';
        document.getElementById('btn-guardar').className = 'btn btn-primary';
        document.getElementById('btn-cancelar').classList.add('hidden');
        this.productoEditando = null;
    }

    // Manejar envío del formulario
    async manejarSubmit(event) {
        event.preventDefault();
        
        const productoData = {
            nombre: document.getElementById('nombre').value,
            categoria: document.getElementById('categoria').value,
            precio: parseFloat(document.getElementById('precio').value),
            stock: parseInt(document.getElementById('stock').value),
            marca: document.getElementById('marca').value,
            descripcion: document.getElementById('descripcion').value
        };

        // Validación básica
        if (!productoData.nombre || !productoData.categoria || !productoData.marca || !productoData.descripcion) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        try {
            if (this.productoEditando) {
                await this.actualizarProducto(this.productoEditando, productoData);
            } else {
                await this.crearProducto(productoData);
            }
        } catch (error) {
            console.error('Error en operación:', error);
        }
    }

    // Configurar event listeners
    setupEventListeners() {
        // Formulario
        document.getElementById('producto-form').addEventListener('submit', (e) => {
            this.manejarSubmit(e);
        });

        // Botón cancelar
        document.getElementById('btn-cancelar').addEventListener('click', () => {
            this.cancelarEdicion();
        });

        // Filtros
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.categoriaFiltro = e.target.dataset.categoria;
                this.mostrarProductos();
            });
        });
    }
}

// Inicializar la tienda
const tienda = new TiendaElectrodomesticos();
