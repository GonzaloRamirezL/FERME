$(document).ready(function() {
	productoBuscar = new IndexProductoBuscar();
	cargarDatosTablaProductos();
	actualizarProducto();
	validarFormularioProducto();
	limpiarErroresFormularioProducto();
	cerrarModalProducto();
});


function cerrarModalProducto() {
	$("#cerrarModalProducto").click(function() {	
		$('#modalProductos').modal('toggle');
	})
}

function insertarProductos(stDatos) {

	swal({
		title: "¿Está seguro?",
		text: "¿Desea ingresar este producto?",
		icon: "warning",
		buttons: true,
		dangerMode: false,
	})
	.then((willDelete) => {
		if (willDelete) {

			var filename = $('#fotoProd[type=file]').val().split('\\').pop();

			subirFoto()
			$.ajax({
			type: 'POST',
			url: 'productoAgregar',
			data: stDatos,
			success: function(data) {
				swal("El producto agregado correctamente!", {
					icon: "success",
				});
				$('#modalProductos').modal('toggle');
					alertify.success('Producto agregada correctamente');
					destruirTablaProductos();
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

function limpiarErroresFormularioProducto() {
	$("#rutProveedor").keyup(function () {
		$("#spRutProveedor").hide();
		$("#spRutProveedor").removeClass("has-error");
	});
	$("#nombreProducto").keyup(function () {
		$("#spNomProducto").hide();
		$("#spNomProducto").removeClass("has-error");
	});
	$("#precioUnitario").keyup(function () {
		$("#spPrecio").hide();
		$("#spPrecio").removeClass("has-error");
	});
	$("#inputStock").keyup(function () {
		$("#spStock").hide();
		$("#spStock").removeClass("has-error");
	});
	$("#inputStockcritico").keyup(function() {
		$("#spStockCritico").hide();
		$("#spStockCritico").removeClass("has-error");
	});
	$("#idCategoria").change(function() {
		$("#spCategoria").hide();
		$("#spCategoria").removeClass("has-error");
	});
	$("#idSubcat").change(function() {
		$("#spSubCategoria").hide();
		$("#spSubCategoria").removeClass("has-error");
	});
	$("#idMarca").change(function() {
		$("#spMarca").hide();
		$("#spSubMarca").removeClass("has-error");
	});
	


}

function validarFormularioProducto() {

	$("#abrirModalAgregar").click(function() {
		$('#modalProductos').modal('show');
		limpiarCamposModalProductos();
		$('#btnAgregarProducto').attr("hidden",false);
		$('#btnModificarProducto').attr("hidden",true);
		$('#modalProductosLabel').html("Agregar Producto")
		$("#codigoProducto").prop('readonly', false);
		$("#rutProveedor").prop('readonly', false);
		$("#fechaVencimiento").prop('readonly', false);
		$("#codigoProducto").prop('readonly', true);
		

		$("#btnAgregarProducto").click(function() {
			var rut = $('#rutProveedor').val();
			var nombreProducto = $('#nombreProducto').val();
			var precio = $('#precioUnitario').val();
			var stock = $('#inputStock').val();
			var critico = $('#inputStockcritico').val();
			var categoria = $('#idCategoria').val();
			var subCategoria = $('#idSubcat').val();
			var marca = $('#idMarca').val();
			var foto = $('#fotoProd').val();
			var descripcion = $('#descripcionProd').val();

			var errorValidacionDatos = false;
			//var foto = $('#fotoProd').val();

			//var hola = validaRut(rut)


			if (rut == "") {
				$("#spRutProveedor").addClass("has-error");
				$("#spRutProveedor").show();
				$("#spRutProveedor").html(" RUT NO VÁLIDO");
				$("#spRutProveedor").css("color", "#dc3545");
				errorValidacionDatos = true;

			} else {
				$("#spRutProveedor").hide();
				$("#spRutProveedor").removeClass("has-error");
			}
			if(nombreProducto == "" ) {
				$("#spNomProducto").addClass("has-error");
				$("#spNomProducto").show();
				$("#spNomProducto").html(" Debe ingresar un PRODUCTO");
				$("#spNomProducto").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spNomProducto").hide();
				$("#spNomProducto").removeClass("has-error");
			}
			if(marca == null ) {
				$("#spMarca").addClass("has-error");
				$("#spMarca").show();
				$("#spMarca").html(" Debe ingresar una MARCA");
				$("#spMarca").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spMarca").hide();
				$("#spMarca").removeClass("has-error");
			}
			if(categoria == null ) {
				$("#spCategoria").addClass("has-error");
				$("#spCategoria").show();
				$("#spCategoria").html("Debe ingresar una CATEGORIA");
				$("#spCategoria").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spCategoria").hide();
				$("#spCategoria").removeClass("has-error");
			}
			if(subCategoria == null ) {
				$("#spSubCategoria").addClass("has-error");
				$("#spSubCategoria").show();
				$("#spSubCategoria").html("Seleccione una SUBCATEGORIA");
				$("#spSubCategoria").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spSubCategoria").hide();
				$("#spSubCategoria").removeClass("has-error");
			}
			if(stock == 0 ) {
				$("#spStock").addClass("has-error");
				$("#spStock").show();
				$("#spStock").html("Seleccione STOCK");
				$("#spStock").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spStock").hide();
				$("#spStock").removeClass("has-error");
			}
			if(critico == 0 ) {
				$("#spStockCritico").addClass("has-error");
				$("#spStockCritico").show();
				$("#spStockCritico").html("Seleccione STOCK CRITICO");
				$("#spStockCritico").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spStockCritico").hide();
				$("#spStockCritico").removeClass("has-error");
			}
			if(precio == 0 ) {
				$("#spPrecio").addClass("has-error");
				$("#spPrecio").show();
				$("#spPrecio").html("Ingrese PRECIO");
				$("#spPrecio").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spPrecio").hide();
				$("#spPrecio").removeClass("has-error");
			}
			if(foto == "" ) {
				$("#spFoto").addClass("has-error");
				$("#spFoto").show();
				$("#spFoto").html("Ingrese una FOTO");
				$("#spFoto").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spFoto").hide();
				$("#spFoto").removeClass("has-error");
			}
			
			



			//si es true hay errores se muestra mensaje
			if(errorValidacionDatos) {
				alertify.error('Errores en el formulario');	
			//si no hay errores se ingresa el proveedor
			} else {
				var filename = $('#fotoProd[type=file]').val().split('\\').pop();

				var checkDestacar = '0';

				if($('#chbDestacar').is(':checked')) {
					checkDestacar = '1';
				}

				var stDatos = "rutProveedor=" + $('#rutProveedor').val() +
							  "&nombreProducto=" + $('#nombreProducto').val() +
							  "&fechaVencimiento=" + $('#fechaVencimiento').val() +
							  "&precioUnitario=" + $('#precioUnitario').val() +
							  "&inputStock=" + $('#inputStock').val() +
							  "&inputStockcritico=" + $('#inputStockcritico').val() +
							  "&idSubcat=" + $('#idSubcat').val() +
							  "&idMarca=" + $('#idMarca').val() +
							  "&img=" + filename +
							  "&descripcionProd=" + $('#descripcionProd').val() +
							  "&check=" + checkDestacar
				insertarProductos(stDatos)
			}

		});
	});

}

function subirFoto() {

	var datos = new FormData();
	//Guardar todo
	var selectFile = ($("#fotoProd"))[0].files[0];

	datos.append("fotoProd", selectFile);

	//console.log(selectFile)

	$.ajax({
		type: 'POST',
		url: 'retornar',
		dataType: 'html',
		cache: false,
		processData: false,
		contentType: false,
		data: datos,
		success: function(data) {
			console.log("funciona")
		},
		error: function() {
			console.log("no funciona")
		}
	});

}


function IndexProductoBuscar() {

	this.editar = function(stCodigo) {
		var stDatos = "IdProducto=" + stCodigo

		$('#modalProductos').modal('show');
		limpiarCamposModalProductos();
		$('#btnAgregarProducto').attr("hidden",true);
		$('#btnModificarProducto').attr("hidden",false);
		$('#modalProductosLabel').html("Modificar Producto")
		$("#codigoProducto").prop('readonly', true);
		$("#rutProveedor").prop('readonly', true);
		$("#fechaVencimiento").prop('readonly', true);

		$.ajax({
			type: 'POST',
			url: 'productoBuscar',
			data: stDatos,
			dataType: 'JSON',
			success: function(data) {
				console.log(data)
				$.each(data, function(index, value) {

					$('#codigoProducto').val(value[0])
					$('#rutProveedor').val(value[6])
					$('#nombreProducto').val(value[1])
					$("#fechaVencimiento").val(value[2])
					$("#idMarca").prop('value', value[9]);
					$('#idCategoria').val(value[8])
					$('#precioUnitario').val(value[3])
					$('#inputStock').val(value[4])
					$('#inputStockcritico').val(value[5])
					$('#descripcionProd').val(value[11])

					if(value[12] == '1') {
						$('#chbDestacar').prop('checked', true)
					}

					let categoria = $("#idCategoria").val()
					let url = 'subCategoriaCmb/?categoria=' + categoria;

					fetch(url)
						.then(function(result) {
							return result.text();
						})
						.then(function(result) {
							$("#idSubcat").html(result)
							$("#idSubcat").prop('value', value[7]);
						})

					$('#output').attr("src", "/media/static/" + value[10]);
				});

			},
			error: function() {
				console.log("no funciona")
			}
		});

	}

	this.eliminar = function(stCodigo, stActivo) {
		
		swal({
			title: "¿Está seguro?",
			text: "¿Desea eliminar este producto?",
			icon: "warning",
			buttons: true,
			dangerMode: false,
		})
		.then((willDelete) => {
			if (willDelete) {

				var stDatos = "IdProducto=" + stCodigo +
							  "&activo=" + stActivo

				$.ajax({
					type: 'POST',
					url: 'eliminarProductos',
					data: stDatos,
					dataType: 'JSON',
					success: function(data) {
						swal("El producto ha sido eliminado correctamente!", {
					        icon: "success",
				        });
						destruirTablaProductos();
					},
					error: function() {
						console.log("no funcionaaaa")
					}
				});

			} else {
				swal("Operación cancelada!");
			}
		});
	}
}

function actualizarProducto() {
	$("#btnModificarProducto").click(function() {

		swal({
			title: "¿Está seguro?",
			text: "¿Desea modificar este producto?",
			icon: "warning",
			buttons: true,
			dangerMode: false,
		})
		.then((willDelete) => {
			if (willDelete) {

				var checkDestacar = '0';

				if($('#chbDestacar').is(':checked')) {
					checkDestacar = '1';
				}

				var filename = $('#fotoProd[type=file]').val().split('\\').pop();

				var stDatos = "IdProducto=" + $('#codigoProducto').val() +
					"&nombreProducto=" + $('#nombreProducto').val() +
					"&precioUnitario=" + $('#precioUnitario').val() +
					"&inputStockcritico=" + $('#inputStockcritico').val() +
					"&idSubcat=" + $('#idSubcat').val() +
					"&idMarca=" + $('#idMarca').val() +
					"&img=" + filename +
					"&descripcionProd=" + $('#descripcionProd').val() +
					"&check=" + checkDestacar +
					"&stock=" + $('#inputStock').val()

				if (filename != "") {
				subirFoto()
				}

				$.ajax({
					type: 'POST',
					url: 'productoActualizar',
					data: stDatos,
					dataType: 'JSON',
					success: function(data) {
						swal("El producto ha sido modificado correctamente!", {
					          icon: "success",
				        	});
						$('#modalProductos').modal('toggle');
						alertify.success('Producto modificado correctamente');
						destruirTablaProductos();
					},
					error: function() {
						console.log("no funcionaaaa")
					}
				});

			} else {
				swal("Operación cancelada!");
			}
		});
	});
}


function limpiarCamposModalProductos() {
	$('#codigoProducto').val("")
	$('#rutProveedor').val("")
	$('#nombreProducto').val("")
	$("#idMarca").prop('selectedIndex', 0)
	$('#idCategoria').prop('selectedIndex', 0)
	$('#precioUnitario').val("")
	$('#inputStock').val("")
	$('#inputStockcritico').val("")
	$("#idSubcat").empty();
	$('#fotoProd[type=file]').val("")
	$("#output").attr("src", "")
	$('#descripcionProd').val("")
	$("#fechaVencimiento").val("")
	$('#chbDestacar').prop('checked',false);

	$("#spRutProveedor").hide();
	$("#spNombres").hide();
	$("#spPaterno").hide();
	$("#spMaterno").hide();
	$("#spTelefono").hide();
	$("#spRegion").hide();
	$("#spTipo").hide();
	$("#idComuna").hide();
	$("#spCorreo1").hide();
	$("#spFecha").hide();
	$("#spDireccion").hide();
	$("#spPassword1").hide();
	$("#spPassword2").hide();
}

function cargarDatosTablaProductos() {

	$.ajax({
		type: 'POST',
		url: 'listarProductos',
		cache: false,
		processData: false,
		dataType: 'JSON',
		success: function(data) {

			$('#tablaProductos tbody').html("")

			$.each(data, function(index, value) {

				let fila = '<tr>';
				fila += '<td>' + (value[0]) + '</td>';
				fila += '<td>' + (value[1]) + '</td>';
				fila += '<td>' + (value[2]) + '</td>';
				fila += '<td>' + (value[3]) + '</td>';
				fila += '<td>' + (value[4]) + '</td>';
				fila += '<td>' + (value[5]) + '</td>';
				fila += '<td>' + (value[6]) + '</td>';
				fila += '<td><img src="/media/static/' + (value[7]) + '" class="img-fluid" width="60px"></td>';
				if(value[9] == '1') {
					fila += "<td><a class='btn btn-success' href='javascript:productoBuscar.editar(" + '"' + value[0] + '"' + ")'>Editar</a>" +
					" <a class='btn btn-danger' href='javascript:productoBuscar.eliminar(" + '"' + value[0] + '"' + ","+'"'+'0'+'"'+")'>Deshabilitar</a></td>";
				} else {
					fila += "<td><a class='btn btn-success'>Editar</a>" +
					" <a class='btn btn-primary' href='javascript:productoBuscar.eliminar(" + '"' + value[0] + '"' + ","+'"'+'1'+'"'+")'>Habilitar</a></td>";	
				}
			
				fila += '</tr>';

				$('#tablaProductos tbody').append(fila);
			});
			$("#tablaProductos").DataTable({
					"responsive": true,
					"lengthChange": true,
					"autoWidth": false,
					"buttons": ["excel", "pdf", "colvis"]
				}).buttons().container().appendTo('#tablaProductos_wrapper .col-md-6:eq(0)');

		},
		error: function() {
			console.log("no funca")
		}
	});
}

function destruirTablaProductos() {
	$("#tablaProductos").DataTable().destroy()
	cargarDatosTablaProductos();
}