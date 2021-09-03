$(document).ready(function() {
 	cerrarSesion();     
     
});

function cerrarSesion() {
	$("#cerrarSesion").click(function () {
		swal({
        title: "¿Desea cerrar la sesión?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $(location).attr('href','/logout');

        } else {
        swal("Operación cancelada!");
        }
      }); 
    });	


	$("#btListar").click(function () {
		$(location).attr('href','usuarioIndex');
    });	

    $("#btListarProductos").click(function () {
		$(location).attr('href','productoIndex');
    });	

    $("#btListarMarcas").click(function () {
		$(location).attr('href','marcaIndex');
    });	

    $("#btListarDespachos").click(function () {
		$(location).attr('href','despachosIndex');
    });	

     $("#btnConfirmar").click(function () {
            alertify.error('Error notification message.'); 
    });
  

}
