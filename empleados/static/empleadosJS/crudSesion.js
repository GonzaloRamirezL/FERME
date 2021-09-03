$(document).ready(function() {  
 	empleadoSesion = new IndexSesionEmpleado();	
});

function IndexSesionEmpleado() {

	this.logout = function(stCodigo) {

		var stDatos = "nomUser=" + stCodigo

		$.ajax({
			type: 'POST',
			url: '/empleadosLogout',
			data: stDatos,
			success: function (data) {
			   	location.reload(); 			    
			},
			error: function () {
			    console.log("no funciona")
			}
	    });	
	}
}