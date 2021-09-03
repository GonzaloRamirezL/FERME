$(document).ready(function() {  
 	formularioRegistro();
 	ingresarCuentaUusarios();	
 	cambiarComunaPorRegion();
 	abrirModalLoginUsuarios();
 	usuarioSesion = new IndexUsuariosSesion();	
 	recuperarPassword();
 	completarCambioDePassword();
 	limpiarCamposRegistrosCliente();
});

function recuperarPassword() {
	$("#btnResetPassword").click(function (e) {
		e.preventDefault()


		var stDatos = "email=" + $('#email').val()

		$.ajax({
			type: 'POST',
			url: '/resetPasswordMail',
			data: stDatos,
			dataType: 'JSON',
			success: function (data) {
			    
			    if(data.ok == 'false') {
			    	alertify.error(data.msg)
			    } else {
			    	alertify.success(data.msg)
			    	$('#areaReset').attr("hidden", false);
					$('#areaReset1').attr("hidden", false);
					$('#areaReset2').attr("hidden", false);
					$('#areaReset3').attr("hidden", false);
					$('#areaSendMail').attr("hidden", true);
			    }
				  
			},
			error: function () {
			    alertify.error("Datos de usuario no válidos")
			}
	    });

	});
}

function completarCambioDePassword() {
	$("#btnCambiarPassword").click(function () {

		var password1 = $('#password').val();
		var password2 = $('#password2').val()
		var folio = $('#codigo').val() 

		var errorValidacionDatos = false;

		if(folio == "") {
			$("#spCodigoValidar").show();
			$("#spCodigoValidar").html("Debe ingresar un codigo");
			$("#spCodigoValidar").css("color", "#dc3545");
			errorValidacionDatos = true;
		} else {
			$("#spCodigoValidar").hide();
			$("#spCodigoValidar").hide();
		}	

		if (password1 == "" || password1.length < 8) {
			$("#spPassword1Nueva").show();
			$("#spPassword1Nueva").html(" Contraseña no válida");
			$("#spPassword1Nueva").css("color", "#dc3545");
			errorValidacionDatos = true;

		} else {

			if(password2 != password1) {
					$("#spPassword1Nueva").show();
					$("#spPassword1Nueva").html(" Contraseñas no coinciden");
					$("#spPassword1Nueva").css("color", "#dc3545");

					$("#spPassword2Nueva").show();
					$("#spPassword2Nueva").html(" Contraseñasno coinciden");
					$("#spPassword2Nueva").css("color", "#dc3545");
					errorValidacionDatos = true;
			} else {
					$("#spPassword2Nueva").hide();
					$("#spPassword1Nueva").hide();
			}				
		}

		if(errorValidacionDatos) {
			alertify.error('Error cambio de contraseña no valido')
		} else {
			
			var stDatos = "mail=" + $('#email').val() +
					  "&codigo=" + $('#codigo').val() +
					  "&password=" + $('#password').val()

			$.ajax({
					type: 'POST',
					url: '/ConfirmarPasswordMail',
					data: stDatos,
					dataType: 'JSON',
					success: function (data) {    
					    
						if(data.ok == 'false') {
							alertify.error(data.msg)
						} else {
							alertify.success(data.msg)
							$('#areaReset').attr("hidden", true);
					    	$('#areaReset1').attr("hidden", true);
					    	$('#areaReset2').attr("hidden", true);
					    	$('#areaSendMail').attr("hidden", false);
					    	$('#email').val("")
						}

					},
					error: function () {
					    alertify.error("Datos de usuario no válidos")
					}
			});
		}
	});
}

function abrirModalLoginUsuarios() {
	
	$("#abrirModalLogin").click(function () {
		if($("#txtUsuarioName").val() != "") {
			$('#modalLoginRegister').modal('show');	
		}
		
	});
}


function formularioRegistro() {

	$("#btnRegistros").click(function (e) {
		e.preventDefault()
	
		var rutCliente = $('#txtRut').val();
		var nombres = $('#txtNombres').val();
		var paterno = $('#txtApellidoPat').val();
		var materno = $('#txtApellidoMat').val();
		var email1 = $('#txtEmailUser').val();
		var email2 = $('#txtEmailUser2').val();
		var password1 = $('#txtPasswordUser').val();
		var password2 = $('#txtPasswordUser2').val();
		var telefono = $('#txtTelefono').val();
		var fecha = $('#txtFecha').val();
		var region = $('#idRegion').val();
		var comuna = $('#idComuna').val();
		var direccion = $('#txtDireccion').val();

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
		if (telefono == "" || telefono.length < 9) {
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

			if(email1 != email2) {
				$("#spCorreo1").show();
				$("#spCorreo1").html(" Los correos no coinciden");
				$("#spCorreo1").css("color", "#dc3545");
				$("#spCorreo2").show();
				$("#spCorreo2").html(" Los correos no coinciden");
				$("#spCorreo2").css("color", "#dc3545");
			errorValidacionDatos = true;	
			} else {
				$("#spCorreo1").hide();
				$("#spCorreo2").hide();
			}
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


		if(errorValidacionDatos) {
			alertify.error("datos no validos")
		} else {

			var stDatos = $('#frmClientes').serializeArray();
			$.ajax({
				type: 'POST',
				url: 'registroClienteFrm',
				data: stDatos,
				dataType: 'JSON',
				success: function (data) {

					if(data.ok == 'false' || data.ok == 'falso') {
						alertify.error(data.msg)
					} else {
						var datos = "txtUsuario=" + email1 +
									"&txtPassword=" + password1
						limpiarCamposRegistrosCliente()
					    loginAutomaticoUsers(datos) 	
					}
					

				},
				error: function () {
				    console.log("no funciona")
				}
		    });

		}

	});

}

function ingresarCuentaUusarios() {

	$("#btnIngresar").click(function (e) {
		e.preventDefault()

		var stDatos = $('#frmIngresarCliente').serializeArray();
		console.log(stDatos)
		$.ajax({
			type: 'POST',
			url: '/negocio',
			data: stDatos,
			success: function (data) {
			    location.reload(); 	
			    
			},
			error: function () {
			    alertify.error("Datos de usuario no válidos")
			}
	    });

	});
}

function loginAutomaticoUsers(stDatos) {

	$.ajax({
			type: 'POST',
			url: '/negocio',
			data: stDatos,
			success: function (data) {
			swal("Usuario registrado en el sistema", {
					icon: "success",
			});	
			location.reload();	    
		},
		error: function () {
			alertify.error("Datos de usuario no válidos")
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

function IndexUsuariosSesion() {

	this.logout = function(stCodigo) {

		var stDatos = "nomUser=" + stCodigo
		console.log(stDatos)
		$.ajax({
			type: 'POST',
			url: '/logoutUser',
			data: stDatos,
			success: function (data) {
			   	location.reload(); 			    
			},
			error: function () {
			    console.log("no funciona")
			}
	    });	
	}

	this.carroCompra = function(stCodigo, stUsuario) {

		var stDatos = "IdProducto=" + stCodigo +
					"&idUsuario=" + stUsuario +
					"&cantidad=" + $('#cantidadProductos').val()

		$.ajax({
			type: 'POST',
			url: '/carritoAdd',
			data: stDatos,
			dataType: 'JSON',
			success: function (data) {
				$('#cantidadProductos').val(1);
			   	if(data.ok == 'false') {
			   		alertify.set('notifier','position', 'top-right');
			   		alertify.error(data.msg)
			   	} else {
			   		alertify.set('notifier','position', 'top-right');
			   		alertify.success(data.msg)	
			   	}	    
			},
			error: function () {
			    console.log("no funciona")
			}
	    });	
	}

	this.loadComboCarrito = function(idUser){
		
		var stDatos = "IdUsuario=" + idUser
		ventana.getPostHtml("contenedor","/carroCargar",stDatos)

	}

	this.loadDetalleCarro = function(stCodigo) {
		var stDatos = "IdUsuario=" + stCodigo
		ventana.showHTML('containerRight','/carrito')
		cargarDatosTablasDetallesCompra(stCodigo)		
	}

	this.eliminar = function (stCodigo, stUser) {
		var stDatos = "IdProducto=" + stCodigo +
					"&IdUsuario=" + stUser


        	$.ajax({
		        type: 'POST',
		        url: '/eliminarProductoCarro',
		        data: stDatos,
		        success: function (data) {
		        	destruirTablaDetallesCompra(stUser);
		        	ventana.getPostHtml("contenedor","/carroCargar",stDatos)	
		        },
		        error: function () {
		            console.log("no funciona")
		        }
    		});	    
	}

	this.loadHistorialCompras = function(stCodigo) {
		ventana.showHTML('containerRight','/historialCliente')
		mostrarHistorialCliente(stCodigo)
	}

	this.detalleCompraHistorial = function(stCodigo, stVenta) {
		destruirTablaDetalleVentaCliente()
		$('#ModalDetalleVentaCliente').modal('show');
		tablaDetalleVentaCliente(stCodigo, stVenta)	
	}
}

function completarCompraCliente(stCodigo) {

	swal({
		title: "¿Está seguro?",
		text: "¿Desea completar la compra?",
		icon: "warning",
		buttons: true,
		dangerMode: false,
	})
	.then((willDelete) => {
	if (willDelete) {

		var doc;
		var despacho;
		var direccion;

	   	if($('#payment-4').is(':checked')) { 
	   		doc = 4; 
	   	} 
	   	else if($('#payment-3').is(':checked')) {
	   		doc = 3;
	   	}
	   	else if($('#payment-2').is(':checked')) {
	   		doc = 2;
	   	}
	   	else {
	   		doc = 0;
	   	}

	   	if($('#despachar').is(':checked')) {
	   		despacho = 1;
	   		direccion = $('#direccionDespacho').val()
	   	}
	   	else {
	   		despacho = 2;
	   		direccion = 'Nada'
	   	}
	 
		var stDatos = "IdUsuario=" + stCodigo +
					"&documento=" + $('#documentoId').val() +
					"&tipo=" + doc +
					"&despacho=" + despacho +
					"&direccion=" + direccion 
		$.ajax({
			type: 'POST',
			url: '/completarPagoCliente',
			data: stDatos,
			    success: function (data) {
			        destruirTablaDetallesCompra(stCodigo);
			        ventana.getPostHtml("contenedor","/carroCargar",stCodigo)	
			        alertify.success('Compra Completada con exito')
			        swal('Compra Completada', {
						icon: "success",
					});
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



function detalleBaucherCliente(stCodigo) {

	var stDatos = "IdUsuario=" + stCodigo

	$.ajax({
	        type: 'POST',
	        url: '/detalleBaucherCliente',
	        cache: false,
	        data: stDatos,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {	

	        	$('#subTotalBaucher').html("")
	        	$.each(data, function (index, value) {
	        		let fila = '<h3>'+ 'TOTAL:   ' + value[5] + '</h3>';
	        		fila += '<h5>'+ 'SUBTOTAL:   ' + value[0] + '</h5>';
	        		fila += '<h5>'+ 'Cantidad:   ' + value[2] + '</h5>';
	        		fila += '<h5>'+ 'Email:   ' + value[3] + '</h5>';
	        		fila += '<h5>'+ 'Rut:   ' + value[4] + '</h5>';
		        	$('#subTotalBaucher').append(fila);
	        	});	        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});
}

function cargarDatosTablasDetallesCompra(stCodigo) {

	var stDatos = "IdUsuario=" + stCodigo

	$.ajax({
	        type: 'POST',
	        url: '/carroCargarDetalle',
	        cache: false,
	        data: stDatos,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
				$('#tablaDetalleCompra tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' +'<img src="/media/static/' + (value[5]) + '" class="img-fluid" width="60px">' + (value[3] )+'</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila+= "<td><a class='btn btn-danger' href='javascript:usuarioSesion.eliminar("+'"'+value[0]+'"'+","+value[2]+")'>X</a></td>";
		        		//NO BORRAR ESTE APUNTE 
		        		//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        	$('#tablaDetalleCompra tbody').append(fila);		        	
				});
				$("#tablaDetalleCompra").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false, "searching": false
			    })
			        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
		detalleBaucherCliente(stCodigo)

		$('#btnCompletarCompraCliente').click(function () {
			completarCompraCliente(stCodigo)	
		});	
}

function destruirTablaDetallesCompra(stUser) {
	$("#tablaDetalleCompra").DataTable().destroy()
	cargarDatosTablasDetallesCompra(stUser);
}

function mostrarHistorialCliente(stCodigo) {
	var stDatos = "IdUsuario=" + stCodigo

	$.ajax({
	        type: 'POST',
	        url: '/cargarDatosHistorialCompras',
	        cache: false,
	        data: stDatos,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
				$('#tablaHistorialCompras tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+'</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila += '<td>' + (value[5] )+ '</td>';
		        		fila += '<td>' + (value[6] )+ '</td>';
		        		fila += "<td><a class='btn btn-success' href='javascript:usuarioSesion.detalleCompraHistorial("+value[7]+", "+value[0]+")'>Detalles</a></td>";

		        	$('#tablaHistorialCompras tbody').append(fila);		        	
				});
				$("#tablaHistorialCompras").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false
			    })      	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    });	
}

function tablaDetalleVentaCliente(stCodigo, stVenta) {

	var stDatos = "IdUsuario=" + stCodigo +
				  "&idVenta=" + stVenta

	$.ajax({
	        type: 'POST',
	        url: '/cargarDetalleVentaCliente',
	        cache: false,
	        data: stDatos,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
				$('#tablaDetalleVenta tbody').html("")

				$.each(data, function (index, value) {

		        		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+'</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        	$('#tablaDetalleVenta tbody').append(fila);		        	
				});
				$("#tablaDetalleVenta").DataTable({
			     "responsive": true, "lengthChange": true, "autoWidth": false, "searching": false
			    })      	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    });	

    $.ajax({
	        type: 'POST',
	        url: '/cargarDetalleVentaInfo',
	        data: stDatos,
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {


	        	$('#DatosProveedor').html("")
				$.each(data, function (index, value) {	
	
	               	
		        	let fila = '<address>'+ "Para" + '<br>';
		        	fila += '<strong>'+ value[1] + '</strong><br>';
		        	fila +=  "Rut: "+ value[2] + '<br>';
		        	fila +=  "Teléfono: "+ value[3] + '<br>';
		        	fila +=  "Email: "+ value[4] + '<br>';
		        	fila +=  "Modo Pago: " + value[5] + '<br>';
		        	fila +=  "Documento: " + value[6] + '<br>';
		        	fila += '<strong>'+ "SubTotal: "+ value[8] + '</strong><br>';
		        	fila += '<strong>'+ "Total Pagado: "+ value[7] + '</strong><br>';
		        	fila += '</address>';
		        	$('#DatosProveedor').append(fila);  	
				});
	        	
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});	

    	
}

function destruirTablaDetalleVentaCliente() {
	$("#tablaDetalleVenta").DataTable().destroy()
}

function limpiarCamposRegistrosCliente() {
	$('#txtRut').val("");
	$('#txtNombres').val("");
	$('#txtApellidoPat').val("");
	$('#txtApellidoMat').val("");
	$('#txtEmailUser').val("");
	$('#txtEmailUser2').val("");
	$('#txtPasswordUser').val("");
	$('#txtPasswordUser2').val("");
	$('#txtTelefono').val("");
	$('#txtFecha').val("");
	$('#idRegion').val("");
	$('#idComuna').val("");
	$('#txtDireccion').val("");	
}


