document.addEventListener("DOMContentLoaded", () => {
    const mesas = [
      { id: 1, estado: "ocupada", mozo: "Juan", subtotal: 1500 },
      { id: 2, estado: "libre", mozo: "María", subtotal: 0 },
      { id: 3, estado: "finalizada", mozo: "Carlos", subtotal: 2300 },
    ]
  
    const pedidos = [
      { id: 1, inicio: "12:00", fin: "13:30", mozo: "Juan", subtotal: 1500, formaPago: "Efectivo" },
      { id: 2, inicio: "14:00", fin: "15:45", mozo: "María", subtotal: 2300, formaPago: "Tarjeta" },
    ]
  
    const comandas = {
      1: [
        { descripcion: "2 x Milanesa con puré", estado: "pendiente" },
        { descripcion: "1 x Ensalada César", estado: "en cocina" },
        { descripcion: "2 x Gaseosa", estado: "entregada" },
      ],
      2: [
        { descripcion: "1 x Pizza Margherita", estado: "entregada" },
        { descripcion: "2 x Cerveza", estado: "entregada" },
      ],
    }
  
    function renderizarMesas() {
      const gridMesas = document.getElementById("gridMesas")
      gridMesas.innerHTML = ""
  
      mesas.forEach((mesa) => {
        const mesaElement = document.createElement("div")
        mesaElement.className = "mesa"
        mesaElement.setAttribute("data-estado", mesa.estado)
  
        let contenido = `
                  <h3><i class="fas fa-chair"></i> Mesa ${mesa.id}</h3>
                  <p><strong>Estado:</strong> ${mesa.estado}</p>
                  <p><strong>Mozo:</strong> ${mesa.mozo}</p>
              `
  
        if (mesa.estado === "ocupada") {
          contenido += `
                      <div class="comandas">
                          <h4><i class="fas fa-clock"></i> Comandas Pendientes</h4>
                          <ul>
                              ${comandas[mesa.id]
                                .filter((c) => c.estado === "pendiente")
                                .map((c) => `<li>${c.descripcion}</li>`)
                                .join("")}
                          </ul>
                          <button class="enviar-cocina"><i class="fas fa-utensils"></i> Enviar a Cocina</button>
                          
                          <h4><i class="fas fa-fire"></i> Comandas en Cocina</h4>
                          <ul>
                              ${comandas[mesa.id]
                                .filter((c) => c.estado === "en cocina")
                                .map((c) => `<li>${c.descripcion}</li>`)
                                .join("")}
                          </ul>
                          <button class="entregar-mozo"><i class="fas fa-hand-holding"></i> Entregar a Mozo</button>
                          
                          <h4><i class="fas fa-check"></i> Comandas Entregadas</h4>
                          <ul>
                              ${comandas[mesa.id]
                                .filter((c) => c.estado === "entregada")
                                .map((c) => `<li>${c.descripcion}</li>`)
                                .join("")}
                          </ul>
                      </div>
                      <p class="subtotal"><i class="fas fa-dollar-sign"></i> Subtotal: $${mesa.subtotal}</p>
                  `
        } else if (mesa.estado === "finalizada") {
          contenido += `
                      <button class="descargar-ticket"><i class="fas fa-file-invoice"></i> Descargar Ticket</button>
                      <button class="marcar-pagado"><i class="fas fa-check-circle"></i> Marcar como Pagado</button>
                  `
        }
  
        mesaElement.innerHTML = contenido
        gridMesas.appendChild(mesaElement)
      })
    }
  
    function actualizarResumenDia() {
      document.getElementById("totalPedidos").textContent = pedidos.length
      document.getElementById("totalEfectivo").textContent =
        "$" + pedidos.filter((p) => p.formaPago === "Efectivo").reduce((sum, p) => sum + p.subtotal, 0)
      document.getElementById("totalTarjeta").textContent =
        "$" + pedidos.filter((p) => p.formaPago === "Tarjeta").reduce((sum, p) => sum + p.subtotal, 0)
    }
  
    function renderizarPedidos() {
      const tablaPedidos = document.getElementById("tablaPedidos").getElementsByTagName("tbody")[0]
      tablaPedidos.innerHTML = ""
  
      pedidos.forEach((pedido) => {
        const row = tablaPedidos.insertRow()
        row.innerHTML = `
                  <td>${pedido.inicio}</td>
                  <td>${pedido.fin}</td>
                  <td>${pedido.mozo}</td>
                  <td>$${pedido.subtotal}</td>
                  <td>${pedido.formaPago}</td>
                  <td><button class="ver-comandas" data-pedido-id="${pedido.id}"><i class="fas fa-eye"></i> Ver Comandas</button></td>
              `
      })
    }
  
    function mostrarComandas(pedidoId) {
      const listaComandas = document.getElementById("listaComandas")
      listaComandas.innerHTML = ""
  
      comandas[pedidoId].forEach((comanda) => {
        const li = document.createElement("li")
        li.innerHTML = `<i class="fas fa-utensil-spoon"></i> ${comanda.descripcion} - <span class="estado-${comanda.estado}">${comanda.estado}</span>`
        listaComandas.appendChild(li)
      })
  
      document.getElementById("modalComandas").style.display = "block"
    }
  
    // Event Listeners
    document.getElementById("verPedidosBtn").addEventListener("click", () => {
      console.log('Botón "Ver Pedidos del Día" clickeado')
      renderizarPedidos() // Asegurarse de que la tabla esté actualizada
      document.getElementById("modalPedidos").style.display = "block"
    })
  
    document.querySelectorAll(".cerrar").forEach((btn) => {
      btn.addEventListener("click", function () {
        console.log("Botón cerrar clickeado")
        this.closest(".modal").style.display = "none"
      })
    })
  
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("ver-comandas")) {
        const pedidoId = e.target.getAttribute("data-pedido-id")
        console.log("Ver comandas clickeado para el pedido:", pedidoId)
        mostrarComandas(pedidoId)
      }
    })
  
    // Añadir efecto de hover a las mesas
    document.addEventListener("mouseover", (e) => {
      if (e.target.classList.contains("mesa")) {
        e.target.style.transform = "scale(1.03)"
      }
    })
  
    document.addEventListener("mouseout", (e) => {
      if (e.target.classList.contains("mesa")) {
        e.target.style.transform = "scale(1)"
      }
    })
  
    // Funcionalidad para los botones de acción
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("enviar-cocina")) {
        console.log("Enviando comanda a cocina...")
        alert("Enviando comanda a cocina...")
      } else if (e.target.classList.contains("entregar-mozo")) {
        console.log("Entregando comanda al mozo...")
        alert("Entregando comanda al mozo...")
      } else if (e.target.classList.contains("descargar-ticket")) {
        console.log("Descargando ticket...")
        alert("Descargando ticket...")
      } else if (e.target.classList.contains("marcar-pagado")) {
        console.log("Marcando mesa como pagada...")
        alert("Marcando mesa como pagada...")
      }
    })
  
    // Cerrar modales al hacer clic fuera de ellos
    window.onclick = (event) => {
      if (event.target.classList.contains("modal")) {
        console.log("Cerrando modal")
        event.target.style.display = "none"
      }
    }
  
    // Inicialización
    renderizarMesas()
    actualizarResumenDia()
    console.log("Aplicación inicializada")
  })
  
  