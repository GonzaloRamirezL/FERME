$(document).ready(function() {  
	cargarDatosTablasDespachos();
	despachoBuscar = new IndexDespachoBuscar();
	cerrarModalDespachos();
});

function cerrarModalDespachos() {

	$("#btnCerrarModalDespachos").click(function () {
		$('#modalDespachos').modal('toggle');
	})
}

function IndexDespachoBuscar() {

	this.editar = function(stCodigo, email, venta) {

		$('#lblModalDespachoss').html("Modificar Despacho");
		$('#modalDespachos').modal('show');

		var stDatos = "idDespacho=" + stCodigo
			
		$.ajax({
	        type: 'POST',
	        url: 'buscarDespachoCliente',
	        data: stDatos,
	        dataType: 'JSON',
	        success: function (data) {
	        	
	     		$.each(data, function (index, value) {
                    $('#txtDireccionDespacho').val(value[5])
                  	$('#txtFechaEnvio').val(value[1])
                  	$('#txtEstadoDespacho').val(value[6])  
                })

                $("#btnConfirmarDespacho").click(function () {
                	swal({
				        title: "¿Está seguro?",
				        text: "¿Desea modificar este despacho?",
				        icon: "warning",
				        buttons: true,
				        dangerMode: false,
			      	})
			      	.then((willDelete) => {
			        if (willDelete) {
                    	var data = "idDespacho=" + stCodigo +
							          "&direccion=" + $('#txtDireccionDespacho').val() +
							          "&fecha=" + $('#txtFechaEnvio').val() +
							          "&estado=" + $('#txtEstadoDespacho').val() +
							          "&idVenta=" + venta +
							          "&correo=" + email	
						cambiarEstadoDespacho(data)
                    } else {
				        swal("Operación cancelada!");
				        }
			      	}); 
						
                })
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});

	}

	this.eliminar = function(stCodigo, mail) {
		$('#lblModalDespachosAnular').html("Anular Despacho");
		$('#modalDespachosAnular').modal('show');

		$("#btnAnularDespacho").click(function () {
			var stDatos = "idDespacho=" + stCodigo +
			  			  "&estado=" + '3' +
			  			  "&motivos=" + $('#motivosAnular').val() +
			  			  "&correo=" + mail

			swal({
		        title: "¿Está seguro?",
		        text: "Se le notificará mediante correo al usuario los motivos!",
		        icon: "warning",
		        buttons: true,
		        dangerMode: true,
	      	})
	      	.then((willDelete) => {
	        if (willDelete) {
				
	        	$.ajax({
			        type: 'POST',
			        url: 'cambiarEstadoDespachoAnular',
			        data: stDatos,
			        success: function (data) {
			        	swal("El despacho ha sido anulado!", {
				          icon: "success",
			        	});
			        	$('#modalDespachosAnular').modal('hide');
			        	destruirTablaDespachos();
			        },
			        error: function () {
			            console.log("no funciona")
			        }
	    		});	     	       	        

	        } else {
		        swal("Operación cancelada!");
		    }
	      	}); 
		});	
	}

}

function cargarDatosTablasDespachos() {

	$.ajax({
	        type: 'POST',
	        url: 'listaDespachosCliente',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
	        	
				$('#tablaDespachos tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+ '</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila += '<td>' + (value[5] )+ '</td>';
		        		fila += '<td>' + (value[7] )+ '</td>';

		        		if(value[6] == '4') {
		        			fila+= "<td><a class='btn btn-danger' href='javascript:despachoBuscar.delete("+value[0]+","+'"'+value[4]+'"'+","+value[2]+")'>Eliminar</a></td>";
		        		} else {
		        			fila+= "<td><a class='btn btn-success' href='javascript:despachoBuscar.editar("+value[0]+","+'"'+value[4]+'"'+","+value[2]+")'>Editar</a>"+ 
		        				" <a class='btn btn-danger' href='javascript:despachoBuscar.eliminar("+value[0]+","+'"'+value[4]+'"'+")'>Anular</a></td>";
		        		}

		   
		        		//NO BORRAR ESTE APUNTE 
		        		//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        	$('#tablaDespachos tbody').append(fila);		        	
				});
				$("#tablaDespachos").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false,
			      "buttons": ["pdf", "excel"]
			    }).buttons().container().appendTo('#tablaMarcas_wrapper .col-md-6:eq(0)');
			        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
}

function modificarDespachoCliente(stDatos) {

	$.ajax({
	type: 'POST',
		url: 'cambiarEstadoDespacho',
		data: stDatos,
		success: function (data) {
			swal("El despacho ha sido modificado!", {
				icon: "success",
			});
			$('#modalDespachos').modal('hide');
			destruirTablaDespachos();
		},
		error: function () {
			console.log("no funciona")
		}
	});
}

function destruirTablaDespachos() {
	$("#tablaDespachos").DataTable().destroy()
	cargarDatosTablasDespachos();
}

function cambiarEstadoDespacho(stDatos) {
			
			$.ajax({
				type: 'POST',
				url: 'cambiarEstadoDespachoConfirmar',
				data: stDatos,
				success: function (data) {
					swal("El despacho ha sido modificado!", {
						icon: "success",
					});
					$('#modalDespachos').modal('hide');
					destruirTablaDespachos();
				},
				error: function () {
					console.log("no funciona")
				}
			});	     	       	        

}