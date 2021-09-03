$(document).ready(function() {
	insertarPreventa();
	preventaBuscar = new IndexProductoPreventa();
	cargarDatosPreventa();
	insertarVenta();
	cancelarVenta();
});

function insertarPreventa() { 

	$("#btnAgregarProdVenta").click(function () {
		var formularioVentaProd = "codProducto=" + $('#codProducto').val() +
								"&cantProducto=" + $('#cantProducto').val() +
								"&descuento=" + $('#descuento').val() +
								"&idTipoPago=" + $('#idTipoPago').val() +
								"&idTipoVenta=" + $('#idTipoVenta').val() +
								"&rutCliente=" + $('#rutCliente').val() +
								"&idUsusario=" + $('#idUsusario').val();

		console.log(formularioVentaProd)

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
	        url: 'agregarPreventa',
	        data: formularioVentaProd,
	        dataType: 'JSON',
	        success: function (data) {
	           	$('#modalAgregarProductos').modal('toggle');
					destruirTablaVenta();

					if(data.ok == 'false') {
						alertify.error(data.msg)
					} else {
						alertify.success(data.msg)
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
    });	
}

function insertarVenta() { 

	 

	$("#btnCompletarVenta").click(function () {
		var formularioVentaPrev ="idTipoPago=" + $('#idTipoPago').val() +
								"&idTipoVenta=" + $('#idTipoVenta').val() +
								"&rutCliente=" + $('#rutCliente').val() +
								"&idUsusario=" + $('#idUsusario').val();

		console.log(formularioVentaPrev)

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
	        url: 'agregarVenta',
	        data: formularioVentaPrev,
	        success: function (data) {
	           	alertify.success('Venta agregada correctamente');
				destruirTablaVenta();
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

function cancelarVenta() {
	$("#btnCancelarVenta").click(function (e) {	
		swal({
			title: "¿Está seguro?",
			text: "¿Desea cancelar esta preventa?",
			icon: "warning",
			buttons: true,
			dangerMode: true,
		})
		.then((willDelete) => {
		if (willDelete) {
	
		$.ajax({
	        type: 'POST',
	        url: 'cancelarPreventa',
	        success: function (data) {
	           	alertify.success('Preventa eliminada con exito');
	           	$('#idTipoPago').prop('selectedIndex', 0)
	           	$('#idTipoVenta').prop('selectedIndex', 0)
		        $('#rutCliente').val("")
				destruirTablaVenta();
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

/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/


function IndexProductoPreventa() {

	this.eliminar = function(stCodigo) { 

		var stDatos = "idVenta=" + stCodigo

		var validar = true;

		swal({
	        title: "¿Está seguro?",
	        text: "Una vez eliminado, no podrá recuperar este pedido!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {

			
        	$.ajax({
		        type: 'POST',
		        url: 'eliminarPreventa',
		        data: stDatos,
		        success: function (data) {
		        	swal("La marca ha sido eliminado!", {
			          icon: "success",
		        	});
					destruirTablaVenta();
		        	
		        },
		        error: function () {
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

function cargarDatosPreventa() {

	$.ajax({
			type: 'POST',
			url: 'listarPreventa',
			cache: false,
			processData: false,
			dataType: 'JSON',
	        success: function(data) {
	        	
				$('#tablaVenta tbody').html("")
				$.each(data, function(index, value) {
						
		        		let fila = '<tr>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[5] )+ '</td>';
						fila += '<td>' + (value[4] )+ '</td>';
		        		//fila+= "<td><a class='btn btn-danger' href='javascript:productoBuscar.deleteDetalle('"+value[2]+"')'>X</a></td>";
		        		fila+= "<td><a class='btn btn-danger' href='javascript:preventaBuscar.eliminar("+value[0]+")'>X</a></td>";
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:productoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:productoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        		$('#tablaVenta tbody').append(fila);		        	
				});
	        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
	detalleBaucherPreventa()
}

function destruirTablaVenta() {
	$('#tablaVenta').DataTable().destroy();
	cargarDatosPreventa();
}

function detalleBaucherPreventa() {

	$.ajax({
	        type: 'POST',
	        url: '/totalesPreventa',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {	

	        	$('#totalPreventaBaucher').html("")
	        	$.each(data, function (index, value) {
	        		let fila = '<h3>'+ 'TOTAL:   ' + value[1] + '</h3>';
	        		fila += '<h5>'+ 'SUBTOTAL:   ' + value[0] + '</h5>';
		        	$('#totalPreventaBaucher').append(fila);

		        	$('#idTipoPago').val(value[2])
		        	$('#idTipoVenta').val(value[3])
		        	$('#rutCliente').val(value[4])
	        	});        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    });
}