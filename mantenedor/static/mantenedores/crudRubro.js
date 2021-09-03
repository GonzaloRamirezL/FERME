$(document).ready(function() {  
	rubroBuscar = new IndexRubroBuscar();	
	//insertarRubro();
	cargarDatosTablasRubro();
	validarFormularioRubro();
	cerrarModalRubro();
});

function cerrarModalRubro() {

	$("#btnCerrarModalRubro").click(function () {
		$('#modalRubros').modal('toggle');
	})
}



function insertarRubro(stDatos) {

			swal({
				title: "¿Está seguro?",
				text: "¿Desea agregar este nuevo rubro?",
				icon: "warning",
				buttons: true,
				dangerMode: false,
			})
			.then((willDelete) => {
			if (willDelete) {
				$.ajax({
			        type: 'POST',
			        url: 'rubroAgregar',
			        data: stDatos,
			        success: function (data) {
			           	$('#modalRubros').modal('toggle');
			           	swal("El rubro ha sido ingresado!", {
					          icon: "success",
				        });

			           	alertify.success('Rubro agregada correctamente');
			           	destruirTablaRubros();
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

function validarFormularioRubro() {

	$("#btnAbrirModalRubro").click(function () {
		$('#txtNomRubro').val("")	
		$('#modalRubros').modal('show');
		$('#btnAgregarRubro').attr("hidden",false);
		$('#btnModificarRubro').attr("hidden",true);
		$('#labelModalRubro').html("Agregar Rubro");

		
		$("#btnAgregarRubro").click(function () {
			var rubro= $('#txtNomRubro').val()

	
			var errorValidacionDatos = false;
			//var foto = $('#fotoProd').val();

			//var hola = validaRut(rut)


			if (rubro == "") {
				$("#spNomRubro").addClass("has-error");
				$("#spNomRubro").show();
				$("#spNomRubro").html(" Debe ingresar un NOMBRE RUBRO");
				$("#spNomRubro").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spNomRubro").hide();
				$("#spNomRubro").removeClass("has-error");
			}
			
			

			//si es true hay errores se muestra mensaje
			if(errorValidacionDatos) {
				alertify.error('Errores en el formulario');	
			//si no hay errores se ingresa 
				
			}
			else{
				var stDatos = "nomRubro=" + $('#txtNomRubro').val()
				insertarRubro(stDatos)
			}

		});
	});

}

function IndexRubroBuscar() {

	this.editar = function(stCodigo) {

		var stDatos = "IdRubro=" + stCodigo
		$('#modalRubros').modal('show');
		$('#btnAgregarRubro').attr("hidden",true);
		$('#btnModificarRubro').attr("hidden",false);
		$('#labelModalRubro').html("Modificar Rubro");

		$.ajax({
		        type: 'POST',
		        url: 'rubroBuscar',
		        data: stDatos,
		        dataType: 'JSON',
		        success: function (data) {
		        	//console.log(data)
		     		$.each(data, function (index, value) {
		     			$('#txtNomRubro').val(value[0])
	                });

	                $("#btnModificarRubro").click(function () {
	                	swal({
					        title: "¿Está seguro?",
					        text: "¿Desea modificar esta marca?",
					        icon: "warning",
					        buttons: true,
					        dangerMode: false,
				      	})
				      	.then((willDelete) => {
				        if (willDelete) {
	                    	var nombre = $('#txtNomRubro').val()
	                    	modificarRubro(stCodigo, nombre)	
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
		var stDatos = "IdRubro=" + stCodigo

		swal({
	        title: "¿Está seguro?",
	        text: "Una vez eliminado, no podrá recuperar este registro!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {

			
        	$.ajax({
		        type: 'POST',
		        url: 'eliminarRubro',
		        data: stDatos,
		        success: function (data) {
		        	swal("el rubro ha sido eliminado!", {
			          icon: "success",
		        	});
		        	destruirTablaRubros();
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

function modificarRubro(id, stRubro) {

	var stDatos = "IdRubro=" + id
				+ "&nomRubro=" + stRubro

	//alert(stDatos)
	$.ajax({
		   	type: 'POST',
		    url: 'modificarBuscar',
		    data: stDatos,
		    dataType: 'JSON',
			success: function (data) {
				$('#modalRubros').modal('toggle');
				swal("el rubro ha sido modificado!", {
			          icon: "success",
		        });
		        alertify.success('Rubro modificado correctamente');
		        destruirTablaRubros();
                    
			},
			error: function () {
		   		console.log("no funciona")
			}
	});
}

function cargarDatosTablasRubro() {

	$.ajax({
	        type: 'POST',
	        url: 'listarRubros',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
	        	
				$('#tablaRubros tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+ '</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila+= "<td><a class='btn btn-success' href='javascript:rubroBuscar.editar("+value[0]+")'>Editar</a>"+ 
		        				" <a class='btn btn-danger' href='javascript:rubroBuscar.eliminar("+value[0]+")'>Eliminar</a></td>";
		        		//NO BORRAR ESTE APUNTE
		        		//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        	$('#tablaRubros tbody').append(fila);		        	
				});
				$("#tablaRubros").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false,
			      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
			    })//.buttons().container().appendTo('#tablaMarcas_wrapper .col-md-6:eq(0)');
			        	
	        },
	        error: function () {
	          console.log("no funca")
	    }
   	});	
}

function destruirTablaRubros() {
	$("#tablaRubros").DataTable().destroy()
	cargarDatosTablasRubro();
}

