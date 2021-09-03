$(document ).ready(function() {   
 	insertarSubCategoria();  
});

function insertarSubCategoria() {
	$("#btnAceptarSub").click(function () {
		 $.ajax({
	        type: 'POST',
	        url: 'insertSubCategoria',
	        success: function () {
	           	console.log("funciona")
	        },
	        error: function () {
	            console.log("no funciona")
	        }
    	});
	});	
}