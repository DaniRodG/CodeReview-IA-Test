// Función de ejemplo para calcular el área de un rectángulo
function calcularArea(largo, ancho) {
    // Sin validación de entrada
    var resultado = largo * ancho;
    return resultado;
}

// Función para obtener datos de usuario
function obtenerUsuario(id) {
    // Simulación de llamada a API
    const url = "https://api.ejemplo.com/users/" + id;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            return data;
        });
    // No hay manejo de errores
}

// Función con código duplicado
function procesarPedido(pedido) {
    if (pedido.tipo === "urgente") {
        console.log("Procesando pedido urgente");
        pedido.prioridad = 1;
        pedido.estado = "en proceso";
    } else {
        console.log("Procesando pedido normal");
        pedido.prioridad = 2;
        pedido.estado = "en proceso";
    }
    return pedido;
}

// Exportar funciones
module.exports = {
    calcularArea,
    obtenerUsuario,
    procesarPedido
};
