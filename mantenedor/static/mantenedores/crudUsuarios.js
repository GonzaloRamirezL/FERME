$(document).ready(function() {  
 	cargarDatosTablasUsuarios();	
 	insertarUsuario();
 	usuarioBuscar = new IndexUsuarioBuscar();	
 	cerrarModalUsuarios();
});

function cerrarModalUsuarios() {

	$("#btnCerrarModalUser").click(function () {
		$('#modalUsuarios').modal('toggle');
	})
}


function insertarUsuario() {

	$("#btnAgregarUsuario").click(function () {
		$('#modalUsuarios').modal('show');
		$('#btnIngresarUsuario').attr("hidden",false);
		$('#btnModificarUsuario').attr("hidden",true);
		$('#lblFrmUsuarios').html("Registrar Usuarios");
		limpiarCamposFormularioUsurio();
		$("#btnIngresarUsuario").click(function (e) {
			e.preventDefault()
			var stDatos = $('#frmDatosUsuario').serializeArray()

			var validar = validarFormularioUsuarios()

			if(validar) {
				alertify.error('Error en algunos campos')
				alertify.closeAll()

			} else {

				swal({
					title: "¿Está seguro?",
					text: "¿Desea registrar este usuario?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
				if (willDelete) {
		            $.ajax({
					    type: 'POST',
					    url: 'registrarUsuarioMantenedor',
					    data: stDatos,
					    dataType: 'JSON',
					    success: function (data) {
					        $('#modalUsuarios').modal('toggle');
						    swal('Usuario registrado', {
								icon: "success",
							});
						    destruirTablaUsuarios();
						    limpiarCamposFormularioUsurio();
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

function actualizarUsuarioMantenedor(stUsuario, stRut) {

	$("#btnModificarUsuario").click(function () {
		
		var validar = validarFormularioUsuarios()

		if(validar) {
			alertify.error('Error en algunos campos')
		} else {
			var stDatos = "idUsuario=" + stUsuario +
							"&txtRutUsuario=" + stRut +
							"&txtNomUsuario=" + $('#txtNomUsuario').val() +
							"&txtPaternoUsuario=" + $('#txtPaternoUsuario').val() +
							"&txtMaternoUsuario=" + $('#txtMaternoUsuario').val() +
							"&txtTelefono=" + $('#txtTelefono').val() +
							"&txtNomEmpresa=" + $('#txtNomEmpresa').val() +
							"&idTipoUsusario=" + $('#idTipoUsusario').val() +
							"&idComuna=" + $('#idComuna').val() +
							"&txtEmail=" + $('#txtEmail').val() +
							"&txtNacimiento=" + $('#txtNacimiento').val() +
							"&txtDireccion=" + $('#txtDireccion').val() +	
							"&password1=" + $('#password1').val()

			swal({
				title: "¿Está seguro?",
				text: "¿Desea modificar este usuario?",
				icon: "warning",
				buttons: true,
				dangerMode: false,
			})
			.then((willDelete) => {
			if (willDelete) {

				$.ajax({
			        type: 'POST',
			        url: 'modificarUsuario',
			        data: stDatos,
			        dataType: 'JSON',
			        success: function (data) {
			        	swal("Usuario modificado!", {
					          icon: "success",
				        });

			        	$('#modalUsuarios').modal('toggle');
						destruirTablaUsuarios();
						limpiarCamposFormularioUsurio();
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
}

function IndexUsuarioBuscar() {

	this.editar = function(stCodigo) {
		$('#modalUsuarios').modal('show');
		$('#btnIngresarUsuario').attr("hidden",true);
		$('#btnModificarUsuario').attr("hidden",false);
		$('#lblFrmUsuarios').html("Modificar Usuarios");
		limpiarCamposFormularioUsurio();

		var stDatos = "idUsuario=" + stCodigo

		$.ajax({
	        type: 'POST',
	        url: 'listarDeUsuariosFiltro',
	        cache: false,
	        processData: false,
	        data: stDatos,
	        dataType: 'JSON',
	        success: function (data) {

				$.each(data, function (index, value) {
					$('#txtRutUsuario').val(value[1]);
					$('#txtNomUsuario').val(value[2]);
					$('#txtPaternoUsuario').val(value[3]);
					$('#txtMaternoUsuario').val(value[4]);
					$('#txtTelefono').val(value[5]);
					$('#txtNomEmpresa').val(value[6]);
					$('#idRegion').val(value[7]);
					$('#idTipoUsusario').val(value[8]) 
					var comuna = value[9]
					var region = value[7]
					seleccionarComunaPorRegion(region, comuna)
					$('#idComuna').val(value[9]);
					$('#txtEmail').val(value[10]);
					$('#txtNacimiento').val(value[11]);
					$('#txtDireccion').val(value[12]);
					$('#password1').val(value[13]);
					$('#password2').val(value[13]);	

					actualizarUsuarioMantenedor(value[0], value[1]);
				}); 

	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
	}

	this.eliminar = function(stCodigo) {

		var stDatos = "idUsuario=" + stCodigo +
					  "&idActivo=" + '0' 
			swal({
				title: "¿Está seguro?",
				text: "¿Desea deshabilitar el acceso a este usuario?",
				icon: "warning",
				buttons: true,
				dangerMode: false,
			})
			.then((willDelete) => {
			if (willDelete) {

				$.ajax({
			        type: 'POST',
			        url: 'activarDescativarUsuario',
			        data: stDatos,
			        dataType: 'JSON',
			        success: function (data) {
			        	swal("Usuario descativado!", {
					          icon: "success",
				        });
						destruirTablaUsuarios();
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
	this.activar = function(stCodigo) {

		var stDatos = "idUsuario=" + stCodigo +
					  "&idActivo=" + '1' 
			swal({
				title: "¿Está seguro?",
				text: "¿Desea reactivar el acceso a este usuario?",
				icon: "warning",
				buttons: true,
				dangerMode: false,
			})
			.then((willDelete) => {
			if (willDelete) {

				$.ajax({
			        type: 'POST',
			        url: 'activarDescativarUsuario',
			        data: stDatos,
			        dataType: 'JSON',
			        success: function (data) {
			        	swal("Usuario activado!", {
					          icon: "success",
				        });
						destruirTablaUsuarios();
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

function cargarDatosTablasUsuarios() {

	$.ajax({
	        type: 'POST',
	        url: 'listarDeUsuarios',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
	        	
				$('#tablaUsuarios tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila += '<td>' + (value[5] )+ '</td>';
		        		if(value[7] == '1') {
			        		fila+= "<td><a class='btn btn-success' href='javascript:usuarioBuscar.editar("+value[0]+")'>Editar</a>"+ 
			        				" <a class='btn btn-danger' href='javascript:usuarioBuscar.eliminar("+value[0]+")'>Deshabilitar</a></td>";
			        		fila += '</tr>';
		        		}
		        		else {
		        			fila+= "<td><a class='btn btn-success' href='javascript:usuarioBuscar.editar("+value[0]+")'>Editar</a>"+ 
			        				" <a class='btn btn-primary' href='javascript:usuarioBuscar.activar("+value[0]+")'>Activar</a></td>";
			        		fila += '</tr>';	
		        		}
		        	$('#tablaUsuarios tbody').append(fila);		        	
				});
				$("#tablaUsuarios").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false,
			      "buttons": ["copy", "csv", "excel", "pdf", "print", "colvis"]
			    })//.buttons().container().appendTo('#tablaMarcas_wrapper .col-md-6:eq(0)');
			        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
}

function validarFormularioUsuarios() {

	var rutCliente = $('#txtRutUsuario').val();
	var nombres = $('#txtNomUsuario').val();
	var paterno = $('#txtPaternoUsuario').val();
	var materno = $('#txtMaternoUsuario').val();
	var email1 = $('#txtEmail').val();
	var password1 = $('#password1').val();
	var password2 = $('#password2').val();
	var telefono = $('#txtTelefono').val();
	var fecha = $('#txtNacimiento').val();
	var region = $('#idRegion').val();
	var comuna = $('#idComuna').val();
	var direccion = $('#txtDireccion').val();
	var tipo = $('#idTipoUsusario').val()

	var errorValidacionDatos = false;	

	if (validaRut(rutCliente) == false) {
			$("#spRutCLiente").show();
			$("#spRutCLiente").html(" RUT NO VÁLIDO");
			$("#spRutCLiente").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spRutCLiente").hide();
		}
		if (nombres == "") {
			$("#spNombres").show();
			$("#spNombres").html(" Debe ingresar un nombre");
			$("#spNombres").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spNombres").hide();
		}
		if (paterno == "") {
			$("#spPaterno").show();
			$("#spPaterno").html(" Debe ingresar un apellido paterno");
			$("#spPaterno").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spPaterno").hide();
		}
		if (materno == "") {
			$("#spMaterno").show();
			$("#spMaterno").html(" Debe ingresar un apellido materno");
			$("#spMaterno").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spMaterno").hide();
		}
		if (telefono == "") {
			$("#spTelefono").show();
			$("#spTelefono").html(" Teléfono no válido");
			$("#spTelefono").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spTelefono").hide();
		}
		if (email1 == "") {
			$("#spCorreo1").show();
			$("#spCorreo1").html(" Debe ingresar correo válido");
			$("#spCorreo1").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spCorreo1").hide();
		}
		if (fecha == "") {
			$("#spFecha").show();
			$("#spFecha").html(" Fecha no válida");
			$("#spFecha").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spFecha").hide();
		}
		if (region == null) {
			$("#spRegion").show();
			$("#spRegion").html(" Fecha no válida");
			$("#spRegion").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spRegion").hide();

			if(comuna == null) {
				$("#spComuna").show();
				$("#spComuna").html(" Fecha no válida");
				$("#spComuna").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spComuna").hide();
			}
		}
		if (password1 == "" || password1.length < 8) {
			$("#spPassword1").show();
			$("#spPassword1").html(" Contraseña no válida");
			$("#spPassword1").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {

			if(password2 != password1) {
					$("#spPassword1").show();
					$("#spPassword1").html(" Contraseñas no coinciden");
					$("#spPassword1").css("color", "#dc3545");

					$("#spPassword2").show();
					$("#spPassword2").html(" Contraseñasno coinciden");
					$("#spPassword2").css("color", "#dc3545");
					errorValidacionDatos = true;
			} else {
					$("#spPassword2").hide();
					$("#spPassword1").hide();
			}				
		}

		if (direccion == "") {
			$("#spDireccion").show();
			$("#spDireccion").html(" Fecha no válida");
			$("#spDireccion").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {
			$("#spDireccion").hide();
		}

		if(tipo == null) {
			$("#spTipo").show();
			$("#spTipo").html(" Tipo de usuario no valido");
			$("#spTipo").css("color", "#dc3545");
			errorValidacionDatos = true;	
		} else {
			$('#spTipo').hide()
		}
		


	return errorValidacionDatos;
}

function limpiarCamposFormularioUsurio() {
	$('#txtRutUsuario').val("");
	$('#txtNomUsuario').val("");
	$('#txtPaternoUsuario').val("");
	$('#txtMaternoUsuario').val("");
	$('#txtEmail').val("");
	$('#password1').val("");
	$('#password2').val("");
	$('#txtTelefono').val("");
	$('#txtNacimiento').val("");
	$('#idRegion').prop('selectedIndex', 0)
	$('#idComuna').val("")
	$('#txtDireccion').val("");
	$('#idTipoUsusario').val("")	

	$("#spRutCLiente").hide();
	$("#spNombres").hide();
	$("#spPaterno").hide();
	$("#spMaterno").hide();
	$("#spTelefono").hide();
	$("#spRegion").hide();
	$("#spTipo").hide();
	$("#spComuna").hide();
	$("#spCorreo1").hide();
	$("#spFecha").hide();
	$("#spDireccion").hide();
	$("#spPassword1").hide();
	$("#spPassword2").hide();
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

function destruirTablaUsuarios() {
	$("#tablaUsuarios").DataTable().destroy()
	cargarDatosTablasUsuarios();
}