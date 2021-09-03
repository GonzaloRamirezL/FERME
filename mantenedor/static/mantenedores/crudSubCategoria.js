$(document).ready(function() {
	insertarSubCategoria();
	cambiarComboBox();
	cargarDatosTablasSubCategorias();
	subCategoria = new IndexSubCategorias();
	cerrarModalCategorias();
});

function cerrarModalCategorias() {

	$("#btnCerrarModalSubCat").click(function () {
		$('#modalSubCategorias').modal('toggle');
	})
}


function insertarSubCategoria() {

	$('#abrirModalAgregarCategoria').click(function() {
		limpiarCamposSubCategoria();
		$('#modalSubCategorias').modal('show');
		$('#btnAgregarSubCategoria').attr("hidden", false);
		$('#btnModificarSubCategoria').attr("hidden", true);
		$('#labelModalSubCat').html("Agregar SubCategoria");

		$("#btnAgregarSubCategoria").click(function() {
			var formularioSubCat = $("#FrmSubCategoria").serializeArray()

			swal({
					title: "¿Está seguro?",
					text: "¿Desea agregar esta nueva subcategoria?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
					if (willDelete) {
						$.ajax({
							type: 'POST',
							url: 'insertSubCategoria',
							data: formularioSubCat,
							success: function(data) {
								$('#modalSubCategorias').modal('toggle');
								alertify.success('Sub-Categoria agregada correctamente');
								swal("La subCategoria ha sido ingresada!", {
									icon: "success",
								});
								limpiarCamposSubCategoria();
								destruirTablaSubCategorias();
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
	});
}

function cambiarComboBox() {

	$("#idCategoria").change(function() {

		let categoria = $("#idCategoria").val()
		let url = 'subCategoriaCmb/?categoria=' + categoria;

		fetch(url)
			.then(function(result) {
				return result.text();
			})
			.then(function(result) {
				$("#idSubcat").html(result)
					//console.log(result)
			})
	});
}

function IndexSubCategorias() {

	this.editar = function(stCodigo) {

		var stDatos = "idSubCat=" + stCodigo
		$('#modalSubCategorias').modal('show');
		$('#btnAgregarSubCategoria').attr("hidden", true);
		$('#btnModificarSubCategoria').attr("hidden", false);
		$('#labelModalSubCat').html("Modificar SubCategoria");

		$.ajax({
			type: 'POST',
			url: 'buscarSubCategoria',
			data: stDatos,
			dataType: 'JSON',
			success: function(data) {
				console.log(data)
				$.each(data, function(index, value) {
					$('#idCategoria').val(value[0])
					$('#txtSubCategoria').val(value[1])
				})

			},
			error: function() {
				console.log("no funciona")
			}
		});

		$("#btnModificarSubCategoria").click(function() {
			swal({
					title: "¿Está seguro?",
					text: "¿Desea modificar esta subcategoria?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
					if (willDelete) {
						var nombre = $('#txtSubCategoria').val()
						actualizarSubCategoria(stCodigo, nombre);
					} else {
						swal("Operación cancelada!");
					}
				});

		});
	}
}

function actualizarSubCategoria(stSubCategoria, stNombre) {


	var stDatos = "txtIdSub=" + stSubCategoria +
		"&txtSubCategoria=" + stNombre

	$.ajax({
		type: 'POST',
		url: 'actualizarSubCat',
		data: stDatos,
		dataType: 'JSON',
		success: function(data) {
			$('#modalSubCategorias').modal('toggle');
			destruirTablaSubCategorias();
		},
		error: function() {
			console.log("no funciona")
		}
	});
}

function cargarDatosTablasSubCategorias() {

	$.ajax({
		type: 'POST',
		url: 'listarSubCategorias',
		cache: false,
		processData: false,
		dataType: 'JSON',
		success: function(data) {

			$('#tablaSubCategorias tbody').html("")

			$.each(data, function(index, value) {

				let fila = '<tr>';
				fila += '<td>' + (value[0]) + '</td>';
				fila += '<td>' + (value[1]) + '</td>';
				fila += '<td>' + (value[2]) + '</td>';
				fila += "<td><a class='btn btn-success' href='javascript:subCategoria.editar(" + value[0] + ")'>Editar</a>" +
					" <a class='btn btn-danger' href='javascript:subCategoria.eliminar(" + value[0] + ")'>Eliminar</a></td>";
				//NO BORRAR ESTE APUNTE 
				//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
				// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
				// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
				fila += '</tr>';

				$('#tablaSubCategorias tbody').append(fila);
			});
			$("#tablaSubCategorias").DataTable({
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

function destruirTablaSubCategorias() {
	$("#tablaSubCategorias").DataTable().destroy()
	cargarDatosTablasSubCategorias();
}

function limpiarCamposSubCategoria() {
	$('#txtSubCategoria').val("")
	$('#idCategoria').prop('selectedIndex', 0)
	$('#txtIdSub').val("")
}