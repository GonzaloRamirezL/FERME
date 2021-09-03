$(document).ready(function() {  
 	insertarMarca(); 
 	cargarDatosTablasMarcas();
	marcaBuscar = new IndexmarcaBuscar();	
	cerrarModalMarca();
});

function cerrarModalMarca() {

	$("#cerrarModalMarca").click(function () {
		$('#modalMarcas').modal('toggle');
	})
}


function insertarMarca() {

	$("#btnAgregarMarca").click(function () {
		$("#txtNomMarca").val("");
		$('#modalMarcas').modal('show');
		$('#btnIngresarMarca').attr("hidden",false);
		$('#btnModificarMarca').attr("hidden",true);
		$('#lblModalMarcas').html("Agregar Marca");
			
		$("#btnIngresarMarca").click(function () {
			var stDatos = "nomMarca=" + $("#txtNomMarca").val();

			var errorValidacionDatos = false;
			if($('#txtNomMarca').val() == "") {
				$("#spNomMarca").addClass("has-error");
				$("#spNomMarca").show();
				$("#spNomMarca").html("Debe ingresar una marca");
				$("#spNomMarca").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spNomMarca").hide();
				$("#spNomMarca").removeClass("has-error");
			}

			if(errorValidacionDatos) {
				alertify.error("Error en algunos campos")
			} else {

				swal({
					title: "¿Está seguro?",
					text: "¿Desea agregar esta nueva marca?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
				if (willDelete) {
	            	$.ajax({
				        type: 'POST',
				        url: 'marcaInsertar',
				        data: stDatos,
				        dataType: 'JSON',
				        success: function (data) {
				           	
				        	if (data.ok == 'true') {
				        		$('#modalMarcas').modal('toggle');
					           	swal(data.msg, {
							          icon: "success",
						        });
					           	destruirTablaMarcas();
				        	} else {
				        		alertify.error(data.msg)
				        	}

				        },
				        error: function () {
				            console.log("no funciona")
				        }
		    		});        	
	            } else {
					swal("Operación cancelada!");
					}
				}); 
			}
    	});

	});	
}

function actualizarMarca(stCodigo, stNombre) {

	var stDatos = "IdMarca=" + stCodigo
				+ "&nombreMarca=" + stNombre
		$.ajax({
	        type: 'POST',
	        url: 'actualizarMarca',
	        data: stDatos,
	        dataType: 'JSON',
	        success: function (data) {
	        	swal("La marca ha sido modificada!", {
			          icon: "success",
		        });

	        	$('#modalMarcas').modal('toggle');
				alertify.success('Marca actualizada correctamente');
				destruirTablaMarcas();
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});
    	
}

function IndexmarcaBuscar() {

	this.editar = function(stCodigo) {

		$('#btnIngresarMarca').attr("hidden",true);
		$('#btnModificarMarca').attr("hidden",false);
		$('#lblModalMarcas').html("Modificar Marca");

		var stDatos = "IdMarca=" + stCodigo
		$('#modalMarcas').modal('show');

		$.ajax({
	        type: 'POST',
	        url: 'marcaBuscar',
	        data: stDatos,
	        dataType: 'JSON',
	        success: function (data) {
	        	
	     		$.each(data, function (index, value) {
	     			console.log(value)
                    $('#txtIdMarca').val(value[0])
                    $('#txtNomMarca').val(value[1])
                })

                $("#btnModificarMarca").click(function () {
                	swal({
				        title: "¿Está seguro?",
				        text: "¿Desea modificar esta marca?",
				        icon: "warning",
				        buttons: true,
				        dangerMode: false,
			      	})
			      	.then((willDelete) => {
			        if (willDelete) {
                    	var nombre = $('#txtNomMarca').val()
                    	actualizarMarca(stCodigo, nombre)	
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

	this.eliminar = function(stCodigo) {

		var stDatos = "IdMarca=" + stCodigo

		swal({
	        title: "¿Está seguro?",
	        text: "Una vez eliminado, no podrá recuperar esta marca!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {

			
        	$.ajax({
		        type: 'POST',
		        url: 'marcaEliminar',
		        data: stDatos,
		        success: function (data) {
		        	swal("La marca ha sido eliminado!", {
			          icon: "success",
		        	});
		        	destruirTablaMarcas();
		        },
		        error: function () {
		            console.log("no funciona")
		        }
    		});	     	       	        

        } else {
	        swal("Operación cancelada!");
	        }
      	}); 
		
	}

}

function cargarDatosTablasMarcas() {

	$.ajax({
	        type: 'POST',
	        url: 'listarMarcas',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {

	        	/*var uno, uro; WARD

	        	for (let i = 0; i < data.length; i++) {

					
	        		if(data[i][1] == 'CONMETAL') {
	        			uno = data[i][1]
	        		}
	        		if(data[i][1] == 'URO') {
	        			uro = data[i][1]
	        		}

	        		

				}	
	        	console.log(uno)
	        	console.log(uro)*/


				$('#tablaMarcas tbody').html("")

				$.each(data, function (index, value) {
						
		        		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+ '</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila+= "<td><a class='btn btn-success' href='javascript:marcaBuscar.editar("+value[0]+")'>Editar</a>"+ 
		        				" <a class='btn btn-danger' href='javascript:marcaBuscar.eliminar("+value[0]+")'>Eliminar</a></td>";
		        		//NO BORRAR ESTE APUNTE 
		        		//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        	$('#tablaMarcas tbody').append(fila);		        	
				});
				$("#tablaMarcas").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false,
			      "buttons": ["pdf", "excel"]
			    }).buttons().container().appendTo('#tablaMarcas_wrapper .col-md-6:eq(0)');
			        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
}

function destruirTablaMarcas() {
	$("#tablaMarcas").DataTable().destroy()
	cargarDatosTablasMarcas();
}
