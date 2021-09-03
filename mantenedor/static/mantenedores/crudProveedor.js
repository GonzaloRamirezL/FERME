$(document).ready(function() {
	//insertarProveedor();
	validarFormularioProveedor();
	limpiarErroresFormularioProveedor();
	actualizarProveedor();
	cargarDatosTablasProveedor();
	proveedorBuscar = new IndexProveedorBuscar();
	limpiarDatosProveedorCloseModal();
	cambiarComunaPorRegion();
	cerrarModalProveedor();
});

function cerrarModalProveedor() {

	$("#btnCerrarModalProv").click(function () {
		$('#modalProveeedor').modal('toggle');
	})
}


function limpiarDatosProveedorCloseModal() {

	$('#modalProveeedor').on('hidden.bs.modal', function(e) {
		limpiarCamposProveedor();
	})
}

function insertarProveedor(stDatos) {

			swal({
					title: "¿Está seguro?",
					text: "¿Desea agregar este nuevo proveedor?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
					if (willDelete) {
						$.ajax({
							type: 'POST',
							url: 'agregarProveedor',
							data: stDatos,
							success: function(data) {
								swal("Proveedor Registrado!", {
									icon: "success",
								});
								$('#modalProveeedor').modal('toggle');
								alertify.success('Proveedor agregado correctamente');
								destruirTablaProveedores();
							},
							error: function() {
								console.log("no funciona")
							}
						});
					} else {
						swal("Operación cancelada!");
					}
				});

}

function validarFormularioProveedor() {

	$("#btnAbrirModalProveedor").click(function() {
		$('#modalProveeedor').modal('show');
		$('#btnAgregarProveedor').attr("hidden", false);
		$('#btnModificarProveedor').attr("hidden", true);
		$('#lbModalProveedor').html("Agregar Proveedor");
		$('#txtRutProveedor').prop('readonly', false);

		$("#btnAgregarProveedor").click(function() {
			var rut = $('#txtRutProveedor').val();
			var nomProveedor = $('#txtNomProveedor').val();
			var representante = $('#txtNomRepresentante').val();
			var direccion = $('#txtDireccion').val();
			var telefono = $('#txtTelefono').val();
			var email = $('#txtEmail').val();
			var comuna = $('#idComuna').val();
			var rubro = $('#idRubro').val();
			var region = $('#idRegion').val();
			var errorValidacionDatos = false;
			//var foto = $('#fotoProd').val();

			//var hola = validaRut(rut)


			if (rut == "") {
				$("#spRut").addClass("has-error");
				$("#spRut").show();
				$("#spRut").html(" Debe ingresar un RUT PROVEEDOR");
				$("#spRut").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spRut").hide();
				$("#spRut").removeClass("has-error");
			}
			if (nomProveedor == "") {
				$("#spNomProveedor").addClass("has-error");
				$("#spNomProveedor").show();
				$("#spNomProveedor").html(" Debe ingresar un PROVEEDOR");
				$("#spNomProveedor").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spNomProveedor").hide();
				$("#spNomProveedor").removeClass("has-error");
			}
			if (representante == "") {
				$("#spRepresentante").addClass("has-error");
				$("#spRepresentante").show();
				$("#spRepresentante").html(" Debe ingresar un REPRESENTANTE");
				$("#spRepresentante").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spRepresentante").hide();
				$("#spRepresentante").removeClass("has-error");
			}
			if (direccion == "") {
				$("#spDireccion").addClass("has-error");
				$("#spDireccion").show();
				$("#spDireccion").html(" Debe ingresar una DIRECCIÓN");
				$("#spDireccion").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spDireccion").hide();
				$("#spDireccion").removeClass("has-error");
			}
			if (telefono == 0) {
				$("#spTelefono").addClass("has-error");
				$("#spTelefono").show();
				$("#spTelefono").html(" Debe ingresar un TELEFONO");
				$("#spTelefono").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spTelefono").hide();
				$("#spTelefono").removeClass("has-error");
			}
			if (email == "") {
				$("#spEmail").addClass("has-error");
				$("#spEmail").show();
				$("#spEmail").html(" Debe ingresar un EMAIL");
				$("#spEmail").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spEmail").hide();
				$("#spEmail").removeClass("has-error");
			}
			if(comuna == null ) {
				$("#spComuna").addClass("has-error");
				$("#spComuna").show();
				$("#spComuna").html("Debe ingresar una CATEGORIA");
				$("#spComuna").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spComuna").hide();
				$("#spComuna").removeClass("has-error");
			}
			if(region == null ) {
				$("#spRegion").addClass("has-error");
				$("#spRegion").show();
				$("#spRegion").html("Debe ingresar una CATEGORIA");
				$("#spRegion").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spRegion").hide();
				$("#spRegion").removeClass("has-error");
			}
			if(rubro == null ) {
				$("#spRubro").addClass("has-error");
				$("#spRubro").show();
				$("#spRubro").html("Debe ingresar una CATEGORIA");
				$("#spRubro").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spRubro").hide();
				$("#spRubro").removeClass("has-error");
			}
			
			

			//si es true hay errores se muestra mensaje
			if(errorValidacionDatos) {
				alertify.error('Errores en el formulario');	
			//si no hay errores se ingresa 
				
			}
			else{
				var stDatos = "txtRutProveedor=" + $('#txtRutProveedor').val()+
							  "&txtNomProveedor=" + $('#txtNomProveedor').val()+
							  "&txtNomRepresentante=" + $('#txtNomRepresentante').val()+
							  "&txtDireccion=" + $('#txtDireccion').val()+
							  "&txtTelefono=" + $('#txtTelefono').val()+
							  "&txtEmail=" + $('#txtEmail').val()+
							  "&idComuna=" + $('#idComuna').val()+
							  "&idRegion=" + $('#idRegion').val()+
							  "&idRubro=" + $('#idRubro').val()
							  
				insertarProveedor(stDatos)
			}

		});
	});

}

function limpiarErroresFormularioProveedor() {
	$("#txtRutProveedor").keyup(function () {
		$("#spRut").hide();
		$("#spRut").removeClass("has-error");
	});
	$("#txtNomProveedor").keyup(function () {
		$("#spNomProveedor").hide();
		$("#spNomProducto").removeClass("has-error");
	});
	$("#txtNomRepresentante").keyup(function () {
		$("#spRepresentante").hide();
		$("#spRepresentante").removeClass("has-error");
	});
	$("#txtTelefono").keyup(function () {
		$("#spDireccion").hide();
		$("#spDireccion").removeClass("has-error");
	});
	$("#txtTelefono").keyup(function() {
		$("#spTelefono").hide();
		$("#spTelefono").removeClass("has-error");
	});
	$("#txtEmail").keyup(function() {
		$("#spEmail").hide();
		$("#spCategoria").removeClass("has-error");
	});
	$("#idComuna").change(function() {
		$("#spComuna").hide();
		$("#spComuna").removeClass("has-error");
	});
	$("#idRegion").change(function() {
		$("#spRegion").hide();
		$("#spRegion").removeClass("has-error");
	});
	$("#idRubro").change(function() {
		$("#spRubro").hide();
		$("#spRubro").removeClass("has-error");
	});



}

function actualizarProveedor() {

	let vld = false;
	$("#btnModificarProveedor").click(function() {

		var stDatos = $("#frmDatosProveedor").serializeArray();

		swal({
				title: "¿Está seguro?",
				text: "¿Desea modificar el proveedor?",
				icon: "warning",
				buttons: true,
				dangerMode: false,
			})
			.then((willDelete) => {
				if (willDelete) {

					$.ajax({
						type: 'POST',
						url: 'actualizarProveedor',
						data: stDatos,
						success: function(data) {
							swal("Proveedor modificado!", {
								icon: "success",
							});
							$('#modalProveeedor').modal('toggle');
							alertify.success('Proveedor modificado correctamente');
							destruirTablaProveedores();
						},
						error: function() {
							console.log("no funciona")
						}
					});
				} else {
					swal("Operación cancelada!");
				}
			});
	});
}

function IndexProveedorBuscar() {

	this.editar = function(stCodigo) { //stCodigo = {'{i.0}'}
		var optComunas = $('#idComuna')
		var stDatos = "rute=" + stCodigo

		$('#modalProveeedor').modal('show');
		$('#btnAgregarProveedor').attr("hidden", true);
		$('#btnModificarProveedor').attr("hidden", false);
		$('#lbModalProveedor').html("Modificar Proveedor")
		$('#txtRutProveedor').prop('readonly', true);

		$.ajax({
			type: 'POST',
			url: 'proveedorBuscar',
			data: stDatos,
			dataType: 'JSON',
			success: function(data) {

				$.each(data, function(index, value) {

					$('#txtRutProveedor').val(value[0])
					$('#txtNomProveedor').val(value[1])
					$('#txtNomRepresentante').val(value[2])
					$('#txtDireccion').val(value[3])
					$('#txtTelefono').val(value[4])
					$('#txtEmail').val(value[5])
					$('#idRubro').val(value[6])
					$('#idRegion').val(value[9])

					var comuna = value[7]
					var region = value[9]
					seleccionarComunaPorRegion(region, comuna)


				})
			},
			error: function() {
				console.log("no funciona")
			}
		});


	}

	this.eliminar = function(stCodigo) {

		var stDatos = "rute=" + stCodigo

		var validar = true;

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
						url: 'proveedorEliminar',
						data: stDatos,
						success: function(data) {
							swal("El proveedor ha sido eliminado!", {
								icon: "success",
							});
							destruirTablaProveedores();
						},
						error: function() {
							console.log("no funciona")
						}
					});

				} else {
					swal("Operación cancelada!");
				}
				validar = false;
			});

	}

}

function cargarDatosTablasProveedor() {

	$.ajax({
		type: 'POST',
		url: 'proveedorListado',
		cache: false,
		processData: false,
		dataType: 'JSON',
		success: function(data) {

			$('#tablaProveedores tbody').html("")

			$.each(data, function(index, value) {

				let fila = '<tr>';
				fila += '<td>' + (value[0]) + '</td>';
				fila += '<td>' + (value[1]) + '</td>';
				fila += '<td>' + (value[2]) + '</td>';
				fila += '<td>' + (value[3]) + '</td>';
				fila += "<td><a class='btn btn-success' href='javascript:proveedorBuscar.editar(" + '"' + value[0] + '"' + ")'>Editar</a>" +
					" <a class='btn btn-danger' href='javascript:proveedorBuscar.eliminar(" + '"' + value[0] + '"' + ")'>Eliminar</a></td>";
				fila += '</tr>';

				$('#tablaProveedores tbody').append(fila);
			});
			$("#tablaProveedores").DataTable({
					"responsive": true,
					"lengthChange": true,
					"autoWidth": false,
					"buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
				}) //.buttons().container().appendTo('#tablaMarcas_wrapper .col-md-6:eq(0)');

		},
		error: function() {
			console.log("no funca")
		}
	});
}

function seleccionarComunaPorRegion(stRegion, stComuna) {
	var optComunas = $('#idComuna')

	var stDatos = "IdRegion=" + stRegion

	$.ajax({
		type: 'POST',
		url: 'filtroComunas',
		data: stDatos,
		dataType: 'JSON',
		success: function(data) {
			$.each(data, function(index, value) {
				optComunas.append("<option class='text-primary' value=" + value[0] + ">" + value[1] + "</option>");
			});

			if (stComuna != undefined) {
				$('#idComuna').val(stComuna)
			} else {
				$("#idComuna").prop('selectedIndex', 0);
			}

		},
		error: function() {
			console.log("no funciona")
		}
	});

}

function cambiarComunaPorRegion() {
	$('#idRegion').change(function() {
		$('#idComuna').empty();
		var region = $('#idRegion').val()
		seleccionarComunaPorRegion(region);
	});

}

function limpiarCamposProveedor() {
	$('#txtRutProveedor').val("")
	$('#txtNomProveedor').val("")
	$('#txtNomRepresentante').val("")
	$('#txtDireccion').val("")
	$('#txtTelefono').val("")
	$('#txtEmail').val("")
	$('#idRubro').prop('selectedIndex', 0)
	$('#idRegion').prop('selectedIndex', 0)
	$('#idComuna').val("")
}

function destruirTablaProveedores() {
	$("#tablaProveedores").DataTable().destroy()
	cargarDatosTablasProveedor();
}