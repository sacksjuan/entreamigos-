document.addEventListener('DOMContentLoaded', function() {
    const mesas = [
        { id: 1, estado: 'ocupada', mozo: 'Juan', subtotal: 1500 },
        { id: 2, estado: 'libre', mozo: 'María', subtotal: 0 },
        { id: 3, estado: 'finalizada', mozo: 'Carlos', subtotal: 2300 },
    ];

    const pedidos = [
        { id: 1, inicio: '12:00', fin: '13:30', mozo: 'Juan', subtotal: 1500, formaPago: 'Efectivo' },
        { id: 2, inicio: '14:00', fin: '15:45', mozo: 'María', subtotal: 2300, formaPago: 'Tarjeta' },
    ];

    const comandas = {
        1: [
            { descripcion: '2 x Milanesa con puré', estado: 'pendiente' },
            { descripcion: '1 x Ensalada César', estado: 'en cocina' },
            { descripcion: '2 x Gaseosa', estado: 'entregada' },
        ],
        2: [
            { descripcion: '1 x Pizza Margherita', estado: 'entregada' },
            { descripcion: '2 x Cerveza', estado: 'entregada' },
        ],
    };

    function renderizarMesas() {
        const gridMesas = document.getElementById('gridMesas');
        gridMesas.innerHTML = '';

        mesas.forEach(mesa => {
            const mesaElement = document.createElement('div');
            mesaElement.className = 'mesa';
            mesaElement.setAttribute('data-estado', mesa.estado);

            let contenido = `
                <h3>Mesa ${mesa.id}</h3>
                <p>Estado: ${mesa.estado}</p>
                <p>Mozo: ${mesa.mozo}</p>
            `;

            if (mesa.estado === 'ocupada') {
                contenido += `
                    <div class="comandas">
                        <h4>Comandas Pendientes</h4>
                        <ul>
                            ${comandas[mesa.id].filter(c => c.estado === 'pendiente').map(c => `<li>${c.descripcion}</li>`).join('')}
                        </ul>
                        <button class="enviar-cocina">Enviar a Cocina</button>
                        
                        <h4>Comandas en Cocina</h4>
                        <ul>
                            ${comandas[mesa.id].filter(c => c.estado === 'en cocina').map(c => `<li>${c.descripcion}</li>`).join('')}
                        </ul>
                        <button class="entregar-mozo">Entregar a Mozo</button>
                        
                        <h4>Comandas Entregadas</h4>
                        <ul>
                            ${comandas[mesa.id].filter(c => c.estado === 'entregada').map(c => `<li>${c.descripcion}</li>`).join('')}
                        </ul>
                    </div>
                    <p class="subtotal">Subtotal: $${mesa.subtotal}</p>
                `;
            } else if (mesa.estado === 'finalizada') {
                contenido += `
                    <button class="descargar-ticket">Descargar Ticket</button>
                    <button class="marcar-pagado">Marcar como Pagado</button>
                `;
            }

            mesaElement.innerHTML = contenido;
            gridMesas.appendChild(mesaElement);
        });
    }

    function actualizarResumenDia() {
        document.getElementById('totalPedidos').textContent = pedidos.length;
        document.getElementById('totalEfectivo').textContent = '$' + pedidos.filter(p => p.formaPago === 'Efectivo').reduce((sum, p) => sum + p.subtotal, 0);
        document.getElementById('totalTarjeta').textContent = '$' + pedidos.filter(p => p.formaPago === 'Tarjeta').reduce((sum, p) => sum + p.subtotal, 0);
    }

    function renderizarPedidos() {
        const tablaPedidos = document.getElementById('tablaPedidos').getElementsByTagName('tbody')[0];
        tablaPedidos.innerHTML = '';

        pedidos.forEach(pedido => {
            const row = tablaPedidos.insertRow();
            row.innerHTML = `
                <td>${pedido.inicio}</td>
                <td>${pedido.fin}</td>
                <td>${pedido.mozo}</td>
                <td>$${pedido.subtotal}</td>
                <td>${pedido.formaPago}</td>
                <td><button class="ver-comandas" data-pedido-id="${pedido.id}">Ver Comandas</button></td>
            `;
        });
    }

    function mostrarComandas(pedidoId) {
        const listaComandas = document.getElementById('listaComandas');
        listaComandas.innerHTML = '';

        comandas[pedidoId].forEach(comanda => {
            const li = document.createElement('li');
            li.textContent = `${comanda.descripcion} - ${comanda.estado}`;
            listaComandas.appendChild(li);
        });

        document.getElementById('modalComandas').style.display = 'block';
    }

    // Event Listeners
    document.getElementById('verPedidosBtn').addEventListener('click', function() {
        document.getElementById('modalPedidos').style.display = 'block';
    });

    document.querySelectorAll('.cerrar').forEach(function(btn) {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('ver-comandas')) {
            const pedidoId = e.target.getAttribute('data-pedido-id');
            mostrarComandas(pedidoId);
        }
    });

    // Inicialización
    renderizarMesas();
    actualizarResumenDia();
    renderizarPedidos();
});