$(document).ready(function() {  
	productoBuscar = new IndexProducto();
	alert(123)
});

function IndexProducto() {

	this.filtrar = function(stCodigo) {

		let stDatos = stCodigo
		let urls = '/productoDetalle/' + stDatos;

		$(location).attr('href',urls);
	}
}
