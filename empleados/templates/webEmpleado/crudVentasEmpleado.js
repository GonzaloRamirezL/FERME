$(document).ready(function() {  
    cargarDatosTablaVentasVendedor();
    ventaVendedorBuscar = new ventaVendedorIndex();
});

function ventaVendedorIndex() {

    this.editar = function(stVenta, stCodigo) {

        var data = "idVenta=" + stVenta

        $('#ModalDetalleVentaCliente').modal('show');
        $('#tablaDetalleVenta').DataTable().destroy();
        var stDatos = "IdUsuario=" + stCodigo +
                      "&idVenta=" + stVenta

        $.ajax({
            type: 'POST',
            url: 'cargarDetalleVentaCliente',
            cache: false,
            data: stDatos,
            processData: false,
            dataType: 'JSON',
            success: function (data) {
                $('#tablaDetalleVenta tbody').html("")

                $.each(data, function (index, value) {
                        console.log(value)
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
            url: 'cargarDetalleVentaInfo',
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

        $("#btnAnularVenta").click(function () {  
            anularVentaCliente(data)
        });  
        
    }
}

function cargarDatosTablaVentasVendedor() {

    $.ajax({
            type: 'POST',
            url: 'historialVentasVendedor',
            cache: false,
            processData: false,
            dataType: 'JSON',
            success: function (data) {
                
                $('#tablaVentas tbody').html("")

                $.each(data, function (index, value) {

                        let fila = '<tr>';
                        fila += '<td>' + (value[0] )+ '</td>';
                        fila += '<td>' + (value[1] )+ '</td>';
                        fila += '<td>' + (value[2] )+ '</td>';
                        fila += '<td>' + (value[3] )+ '</td>';
                        fila+= "<td><a class='btn btn-success' href='javascript:ventaVendedorBuscar.editar("+value[0]+","+value[7]+")'>Detalles</a></td>";
                        //NO BORRAR ESTE APUNTE 
                        //fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+value[0]+","+'"'+value[3]+'"'+")'>X</a></td>";
                        // ejemplo string 1 fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"'+value[3]+'"'+")'>X</a></td>";
                        // ejemplo string fila+= "<td><a class='btn btn-danger' href='javascript:pedidoBuscar.deleteDetalle("+'"value[2]"'+")'>X</a></td>";
                        fila += '</tr>';

                    $('#tablaVentas tbody').append(fila);                   
                });
                $("#tablaVentas").DataTable({
                 "responsive": true, "lengthChange": true, "autoWidth": false,
                  "buttons": ["print","pdf", "excel", "colvis"]
                }).buttons().container().appendTo('#tablaVentas_wrapper .col-md-6:eq(0)');
                        
            },
            error: function () {
                console.log("no funca")
            }
        }); 
}

function destruirTablaVentasVendedor() {
    $("#tablaVentas").DataTable().destroy()
    cargarDatosTablaVentasVendedor();
}