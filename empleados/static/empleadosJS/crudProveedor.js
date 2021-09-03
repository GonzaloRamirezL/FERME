$(document).ready(function() {
	cargarDatosPedidos()	
	pedidoBuscarProv = new IndexPedidoBuscarProv();
});

function cargarDatosPedidos() {

	$.ajax({
		type: 'POST',
		url: 'proveedoresListaPedidos',
		cache: false,
		processData: false,
		dataType: 'JSON',
		success: function(data) {
			console.log(data)
			$('#tablaProveedorPedidos tbody').html("")

			$.each(data, function(index, value) {

				if (value[2] == 2) {
					let fila = '<tr>';
					fila += '<td>' + (value[0]) + '</td>';
					fila += '<td>' + (value[1]) + '</td>';
					fila += '<td>' + (value[3]) + '</td>';
					fila += "<td><a class='btn btn-success' href='javascript:pedidoBuscarProv.detalles("+value[0]+","+'"'+value[4]+'"'+")'>Detalle</a>" +
						" <a class='btn btn-danger' href='javascript:pedidoBuscarProv.eliminar(" + '"' + value[0] + '"' + ")'>Anular</a></td>";
					fila += '</tr>';

					$('#tablaProveedorPedidos tbody').append(fila);
				}
			});
			$("#tablaProveedorPedidos").DataTable({
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

function IndexPedidoBuscarProv() {

	this.detalles = function(stCodigo, stRut) {
		cargarDatosDetallePedido(stCodigo)
		modificarEstdoPedidoProv(stCodigo)
		$('#ModalOrdenCompraProveedos').modal('show');

		var stProveedor = "rutProv=" + stRut

		$.ajax({
	        type: 'POST',
	        url: 'detalleProveedor',
	        data: stProveedor,
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {



	        	$('#DatosProveedor').html("")
				$.each(data, function (index, value) {	
	
	               	
		        	let fila = '<address>'+ "Para" + '<br>';
		        	fila += '<strong>'+ value[0] + '</strong><br>';
		        	fila +=  value[1] + '<br>';
		        	fila +=  value[2] + '<br>';
		        	fila +=  "Teléfono: " + value[3] + '<br>';
		        	fila +=  "Email: " + value[4] + '<br>';
		        	fila += '</address>';
		        	$('#DatosProveedor').append(fila);  	
				});
	        	
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});	
	}
}

function cargarDatosDetallePedido(stCodigo) {

	var stDatos = "idPedido=" + stCodigo

	$.ajax({
	        type: 'POST',
	        url: 'buscarPedido',
	        data: stDatos,
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
	        	console.log(data)
	        	
				$('#tablaPedidosProveedor tbody').html("")
				$.each(data, function (index, value) {
						
		        		let fila = '<tr>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila += '</tr>';

		        		$('#tablaPedidosProveedor tbody').append(fila);		        	
				});
	        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	

	$.ajax({
	        type: 'POST',
	        url: 'detalleCompraPedido',
	        data: stDatos,
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {

	        	$('#tablaDetalleCompra tbody').html("")
				$.each(data, function (index, value) {

		        	let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+ '</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td><strong>' + (value[2] )+ '</strong></td>';
		        	fila += '</tr>';

		        	$('#tablaDetalleCompra').append(fila); 		
				});
	        	
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});	
}

function modificarEstdoPedidoProv(stCodigo) {

	$("#btnAprobarCompra").click(function () {

		var stDatos = "idPedido=" +stCodigo+
					  "&accion=" + 3
		console.log(stDatos)
		swal({
	        title: "¿Está seguro?",
	        text: "Desea aprobar esta orden de compra!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {
			$.ajax({
		        type: 'POST',
		        url: 'modificarEstadoPedido',
		        data: stDatos,
		        dataType: 'JSON',
		        success: function (data) {
					swal(data.msg, {
				        icon: "success",
			        });
			        $('#ModalOrdenCompraProveedos').modal('toggle');
			        destruirTablaListadoPedidosProv()
			        //destruirTablaDetallePedidos(stCodigo)			
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

	$("#btnAnularPedido").click(function () {

		var stDatos = "idPedido=" +stCodigo+
					  "&accion=" + 4
		console.log(stDatos)
		swal({
	        title: "¿Está seguro?",
	        text: "Desea anular esta orden de compra!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {
			$.ajax({
		        type: 'POST',
		        url: 'modificarEstadoPedido',
		        data: stDatos,
		        dataType: 'JSON',
		        success: function (data) {
					swal('orden de compra anulada', {
				        icon: "success",
			        });
			        $('#ModalOrdenCompraProveedos').modal('toggle');
			        destruirTablaListadoPedidosProv()
			        //destruirTablaDetallePedidos(stCodigo)			
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

function destruirTablaListadoPedidosProv() {
	$("#tablaProveedorPedidos").DataTable().destroy()
	cargarDatosPedidos(); //SE VUELVE A CARGAR
}
