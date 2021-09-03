
productoBuscar = new IndexProducto();


function IndexProducto() {

	this.filtrar = function(stCodigo) {

		let stDatos = stCodigo
		let urls = '/productoDetalle/' + stDatos;

		$(location).attr('href',urls);
	}
}