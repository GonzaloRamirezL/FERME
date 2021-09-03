$(document).ready(function() {  
	catBuscar = new IndexCategoriaBuscas();
});


function IndexCategoriaBuscas() {

	this.editar = function(stCodigo) {

		//let stDatos = "idCat=" + stCodigo
		let categoria = stCodigo
		
		let url = '/subCategoriaLista/?categoria=' + categoria;

		fetch(url)
		.then(function(result) {
			return result.text();
		})
		.then(function(result) {
			$(".dropItems").html(result)
			//console.log(result)
		}) 
	}

	this.filtrar = function(stCodigo) {

		let stDatos = stCodigo
		let urls = '/categoriasidsub/' + stDatos;

		$(location).attr('href',urls);
	}

	

}