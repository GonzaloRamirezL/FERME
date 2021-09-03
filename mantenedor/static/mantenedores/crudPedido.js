$(document).ready(function() {  
	insertarPedido();
	pedidoBuscar = new IndexPedidoBuscar();
	cargarDatosTablasPedidos();
	cerrarModalPedido();
});
function cerrarModalPedido() {

	$("#cerrarModalPedido").click(function () {
		$('#modalAgregarProductos').modal('toggle');
	})

	$("#btnAbrirModalPedido22").click(function () {
		$('#modalGenerarPedido').modal('show');
	})
}


function insertarPedido() {

	$("#btnAgregarPedido").click(function () {

		var formularioPedidos = $("#FrmPedido").serializeArray()

		//console.log(formularioPedidos)
		swal({
			title: "¿Está seguro?",
			text: "¿Desea agregar este producto al pedido?",
			icon: "warning",
			buttons: true,
			dangerMode: false,
		})
		.then((willDelete) => {
		if (willDelete) {
			$.ajax({
		        type: 'POST',
		        url: 'agregarPedido',
		        data: formularioPedidos,
		        success: function (data) {
		           	console.log(data)
		           	$('#modalGenerarPedido').modal('toggle');
		           	alertify.success('Pedido agregada correctamente');
		           	destruirTablaListadoPedidos()
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

function IndexPedidoBuscar() {

	this.editar = function(stCodigo, stRut) { 

		$('#modalAgregarProductos').modal('show');
		$('#numPedido').val(stCodigo)
		listarProductosProveedorRut(stRut)
		$("#btnAgregarProdPedido").click(function () {

			var errorValidacionDatos = false;
			if($('#cantProducto').val() <= 0 || $('#cantProducto').val() == "") {
				$("#spCantidadProducto").addClass("has-error");
				$("#spCantidadProducto").show();
				$("#spCantidadProducto").html("Debe ingresar una cantidad");
				$("#spCantidadProducto").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spCantidadProducto").hide();
				$("#spCantidadProducto").removeClass("has-error");
			}
			if($('#codProducto').val() == null) {
				$("#spProductoProveedor").addClass("has-error");
				$("#spProductoProveedor").show();
				$("#spProductoProveedor").html("Debe seleccionar un producto");
				$("#spProductoProveedor").css("color", "#dc3545");
				errorValidacionDatos = true;
			} else {
				$("#spProductoProveedor").hide();
				$("#spProductoProveedor").removeClass("has-error");
			}
		
			var formularioPedidosProd = $("#FrmPedidoProductos").serializeArray()

			if(errorValidacionDatos) {
				alertify.error("Error en algunos campos")
			} else {
				swal({
					title: "¿Está seguro?",
					text: "¿Desea agregar este producto al pedido?",
					icon: "warning",
					buttons: true,
					dangerMode: false,
				})
				.then((willDelete) => {
				if (willDelete) {
				$.ajax({
			        type: 'POST',
			        url: 'agregarPedidoProducto',
			        data: formularioPedidosProd,
			        dataType: 'JSON',
			        success: function (data) {
			           	$('#modalAgregarProductos').modal('toggle');
			           	$('#modalMarcas').modal('toggle');
					           	swal(data.msg, {
							          icon: "success",
						        });
			           	alertify.success(data.msg);
			           	destruirTablaListadoPedidos(); //LLAMANDO AL METODO DESTRUIR TABLA
			           	//destruirTablaDetallePedidos(stCodigo);
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

	this.eliminar = function(stCodigo) { 

		var stDatos = "idPedido=" + stCodigo

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
		        url: 'eliminarPedido',
		        data: stDatos,
		        success: function (data) {
		        	swal("La marca ha sido eliminado!", {
			          icon: "success",
		        	});
		        	destruirTablaListadoPedidos()
		        	//destruirTablaDetallePedidos(stCodigo)
		        },
		        error: function () {
		            console.log("no funciona")
		        }
    		});	     
	        
	        

        } else {
	        swal("Operación cancelada!");
	        };
      	}); 
	}

	this.detalles = function(stCodigo, rutProv) {

		var stProveedor = "rutProv=" + rutProv
		$('#ModalOrdenCompra').modal('show');

	

		cargarDatosDetallePedido(stCodigo)
		modificarEstdoPedido(stCodigo)

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

	this.deleteDetalle = function(stNum, stCodigo) {
		var stDatos = "IdPedido=" + stNum
					  +"&IdProducto=" + stCodigo

		var validar = true;
		$('#btnAnularOrden').prop('hidden', true);
		$('#btnCompletarPago').prop('hidden', true);

		swal({
	        title: "¿Está seguro?",
	        text: "Desea eliminar este producto de la orden!",
	        icon: "warning",
	        buttons: true,
	        dangerMode: true,
      	})
      	.then((willDelete) => {
        if (willDelete) {

			
        	$.ajax({
		        type: 'POST',
		        url: 'eliminarProductoPedido',
		        data: stDatos,
		        success: function (data) {
		        	swal("El producto ha sido eliminado!", {
			          icon: "success",
		        	});
		        	cargarDatosDetallePedido(stNum)
		        	destruirTablaListadoPedidos()
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
	        	
				$('#tablaPedidos tbody').html("")
				$.each(data, function (index, value) {
						
		        		let fila = '<tr>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		//console.log(value[5])

		        		if(value[5] == '2') {
		        			$('#btnAnularOrden').attr("hidden", false);
		        			$('#btnCompletarPago').attr("hidden", true);
		        		}
		        		else {
		        			$('#btnAnularOrden').attr("hidden", true);
		        			$('#btnCompletarPago').attr("hidden", false);
		        			fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
		        		}

		        		//fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle('"+value[2]+"')'>X</a></td>";
		        		
		        		// ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
		        		// ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
		        		fila += '</tr>';

		        		$('#tablaPedidos tbody').append(fila);   	
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

//CREAR TABLA DE PEDIDOS
function cargarDatosTablasPedidos() {

	$.ajax({
	        type: 'POST',
	        url: 'listarPedidos',
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {
	        	
				$('#tablaListaPedidos tbody').html("")

				$.each(data, function (index, value) {

		       		let fila = '<tr>';
		        		fila += '<td>' + (value[0] )+ '</td>';
		        		fila += '<td>' + (value[1] )+ '</td>';
		        		fila += '<td>' + (value[2] )+ '</td>';
		        		fila += '<td>' + (value[3] )+ '</td>';
		        		fila += '<td>' + (value[4] )+ '</td>';
		        		fila += '<td>' + (value[5] )+ '</td>';
		        		fila += '<td>' + (value[6] )+ '</td>';
		        		if(value[7] == '2') {
		        			fila+= "<td><a class='btn btn-success' >Editar</a>"+ 
		        				" <a class='btn btn-danger'>Eliminar</a>"+
		        				" <a class='btn btn-primary' href='javascript:pedidoBuscar.detalles("+value[0]+","+'"'+value[3]+'"'+")'>Detalles</a></td>";	
		        		}else if (value[7] == '3') {
		    
		        			fila+= "<td><a class='btn btn-success'>Editar</a>"+ 
		        				" <a class='btn btn-danger' >Eliminar</a>"+
		        				" <a class='btn btn-primary' href='javascript:pedidoBuscar.detalles("+value[0]+","+'"'+value[3]+'"'+")'>Detalles</a></td>";
		        		} else {
		        			fila+= "<td><a class='btn btn-success' href='javascript:pedidoBuscar.editar("+value[0]+","+'"'+value[3]+'"'+")'>Editar</a>"+ 
		        				" <a class='btn btn-danger' href='javascript:pedidoBuscar.eliminar("+value[0]+")'>Eliminar</a>"+
		        				" <a class='btn btn-primary' href='javascript:pedidoBuscar.detalles("+value[0]+","+'"'+value[3]+'"'+")'>Detalles</a></td>";
		        		}
		
		        		fila += '</tr>'; 		

		        	$('#tablaListaPedidos tbody').append(fila);		        	
				});
				$("#tablaListaPedidos").DataTable({
			     "responsive": true,
					"lengthChange": true,
					"autoWidth": false,
					"buttons": ["excel", "pdf", "print", "colvis"]
				}).buttons().container().appendTo('#tablaListaPedidos_wrapper .col-md-6:eq(0)');
			        	
	        },
	        error: function () {
	            console.log("no funca")
	        }
    	});	
}

//PARA DESTTRUIR LA TABLA
function destruirTablaListadoPedidos() {
	$("#tablaListaPedidos").DataTable().destroy()
	cargarDatosTablasPedidos(); //SE VUELVE A CARGAR
}

function destruirTablaDetallePedidos(stCodigo) {
	$("#tablaPedidos").DataTable().destroy()
	cargarDatosDetallePedido(stCodigo)
}

function listarProductosProveedorRut(stCodigo) {

	var stDatos = "rutProveedor=" + stCodigo
	var optProductos = $('#codProducto')
	optProductos.html("")

	$.ajax({
	        type: 'POST',
	        url: 'listarProductosProveedor',
	        data: stDatos,
	        cache: false,
	        processData: false,
	        dataType: 'JSON',
	        success: function (data) {

				$.each(data, function(index, value) {
					optProductos.append("<option class='text-primary' value=" + value[0] + ">" + value[1] + "</option>");
				}); 	
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    });	
}

function modificarEstdoPedido(stCodigo) {

	$("#btnCompletarPago").click(function () {

		var stDatos = "idPedido=" +stCodigo+
					  "&accion=" + 2
		console.log(stDatos)
		swal({
	        title: "¿Está seguro?",
	        text: "Desea emitir esta orden de compra!",
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
			        $('#ModalOrdenCompra').modal('toggle');
			        destruirTablaListadoPedidos()
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

	$("#btnAnularOrden").click(function () {

		var stDatos = "idPedido=" +stCodigo+
					  "&accion=" + 1
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
			        $('#ModalOrdenCompra').modal('toggle');
			        destruirTablaListadoPedidos()
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















