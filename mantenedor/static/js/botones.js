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
  
  $("#probarLahuea").click(function () {
    var hola = 'dtemite.dev:c30e3dd8d80053edcb1b75e34a489a727af8fe417d3e4a72df97afc4a74c82d9'
    $.ajax({
              url: "https://api.boletaexpress.cl/sistema/alta" ,
                type: "POST",
                Headers: {"Access-Control-Allow-Origin": "dtemite.dev:c30e3dd8d80053edcb1b75e34a489a727af8fe417d3e4a72df97afc4a74c82d9"},
                dataType: 'jsonp',
                crossDomain: true,
                //contentType: "application/json;charset=UTF-8",
              success: function (data) {
                  console.log(data)
              },
              error: function () {
                  
              }
      });
  });
}
