$(document).ready(function() {  
 	insertarMarca(); 
 	IndexmarcaBuscar();
	marcaBuscar = new IndexmarcaBuscar();
});

function insertarMarca() {

	$("#btnMarcaInsertar").click(function () {
		var formularioMarca = $("#formularioMarca").serializeArray();
		//console.log(formularioMarca);

		$.ajax({
	        type: 'POST',
	        url: 'marcaInsertar',
	        data: formularioMarca,
	        success: function (data) {
	           	console.log(data)
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});	 

	});	
}

function eliminar(codigo) {
	$("#bntEliminar").click(function () {
			alert(codigo)
	});
}

function IndexmarcaBuscar() {

	this.editar = function(stCodigo) {

		var stDatos = "IdMarca=" + stCodigo

		$.ajax({
	        type: 'POST',
	        url: 'marcaFrm',
	        data: stDatos,
	        success: function (data) {
	           	console.log(stDatos)
	           	$(location).attr('href','marcaFrm');
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});

		
	}

	this.eliminar = function(stCodigo) {
		 /*
 * @title {String or DOMElement} The dialog title.
 * @message {String or DOMElement} The dialog contents.
 * @onok {Function} Invoked when the user clicks OK button or closes the dialog.
 *
 * alertify.alert(title, message, onok);
 *
 */
		var notification = alertify.notify('sample', 'success', 5, function(){  console.log('dismissed'); });		

	}

}


/*$.ajax({
	        type: 'POST',
	        url: 'insertSubCategoria',
	        success: function () {
	           	console.log("funciona")
	        },
	        error: function () {
	            console.log("no funciona")$.ajax({
	        type: 'POST',
	        url: 'marcaBuscar',
	        data: stDatos,
	        dataType: 'JSON',
	        success: function (data) {
	           	alert(data[0])
	           	$(location).attr('href','marcaFrm', stDatos);
	           	console.log(stDatos)
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});
	        }
    	});*/