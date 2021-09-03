if( 'undefined' !== typeof $ ) {

	var SinAcento = ' ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZabcçdefghijklmnñopqrstuvwxyz';
	var letters = ' ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZabcçdefghijklmnñopqrstuvwxyzàáÀÁéèÈÉíìÍÌïÏóòÓÒúùÚÙüÜ';
	var alfanum = ' ABCÇDEFGHIJKLMNÑOPQRSTUVWXYZabcçdefghijklmnñopqrstuvwxyzàáÀÁéèÈÉíìÍÌïÏóòÓÒúùÚÙüÜ1234567890¡!¿?-.,"';
	var numbers = '1234567890';
	var signs = ",.:;@-\'";
	var mathsigns = '+-=()*/';
	var custom = '<>#$%&?¿';
	var rut = '1234567890Kk';
	var rut2 = '1234567890Kk-';
	var mail = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqr-stuvwxyz1234567890_.@';


	function lTrim(sStr){
		while (sStr.charAt(0) == " ")
		sStr = sStr.substr(1, sStr.length - 1);
		return sStr;
	}

	function rTrim(sStr){
		while (sStr.charAt(sStr.length - 1) == " ")
		sStr = sStr.substr(0, sStr.length - 1);
		return sStr;
	}

	function allTrim(sStr){  return rTrim(lTrim(sStr)); }


	function formatNumber(num,prefix){
		prefix = prefix || '';
		num += '';
		var splitStr = num.split('.');
		var splitLeft = splitStr[0];
		var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
		var regx = /(\d+)(\d{3})/;

		while (regx.test(splitLeft)) {
			splitLeft = splitLeft.replace(regx, '$1' + '.' + '$2');
		}

		return prefix + splitLeft + splitRight;
	}

	function unformatNumber(num) {
		return num.replace(/([^0-9\.\-])/g,'')*1;
	}

    function alpha(e, allow) {
        var k;
        k = document.all ? parseInt(e.keyCode) : parseInt(e.which);
        if (k != 0 && k != 8 && k != 13) {
            return (allow.indexOf(String.fromCharCode(k)) != -1);
        } else {
            return true;
        }
    }

    function isEmailAddress(stremail) {
        var s = stremail;
         var filter = /^[A-Za-z][A-Za-z0-9_\-.]*@[A-Za-z0-9_]+\.[A-Za-z0-9_.]+[A-za-z]$/;
        if (s.length == 0) return true;
        if (filter.test(s)) return true;
        else return false;
    }

    function valRUT(rut) {
        re = /^[1-9]{1}[0-9]*\.?[0-9]{3}\.?[0-9]{3}\-?[0-9kK]$/
        if (re.exec(rut)) {
            return true;
        } else {
            return false;
        }
    }

    function digito(T) {
        var M = 0,
            S = 1;
        for (; T; T = Math.floor(T / 10))
        S = (S + T % 10 * (9 - M++ % 6)) % 11;
        return S ? S - 1 : 'k';
    }

    function valDV(dv) {
        var dv_arr;
        var digito_final;
        var id_arr;
        var id;
        if (dv.indexOf("-") != -1) {
            dv_arr = dv.split("-");
            digito_final = dv_arr[1].toLowerCase();
            id_arr = dv_arr[0];
        } else {
            digito_final = dv.substring(dv.length - 1, dv.length).toLowerCase();
            id_arr = dv.substring(0, dv.length - 1);
        }
        if (id_arr.indexOf(".") != -1) {
            id_arr = id_arr.split(".");
            id = "";
            for (i = 0; i < id_arr.length; i++) {
                id += id_arr[i];
            }
        } else {
            id = id_arr;
        }
        if (digito(id) == digito_final) {
            return true;
        } else {
            return false;
        }
    }

    function number_format(number, decimals, dec_point, thousands_sep) {
        // Strip all characters but numerical ones.
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }



	//  Bind   Menu Mobile
	function mobileMenuBind() {

		$("nav.mobile  .nav__link > a" ).unbind().click( function(e) {

			if( $( this ).next().is(':visible') && ! $( this ).next().is(':hidden') )  {
			}
			else {

				e.preventDefault();
				$(".nav__visible", $(this).parent().parent()).removeClass( "nav__visible" );
				$("nav  .nav__link .nav__selected").removeClass( "nav__selected" );

				$( this ).addClass( "nav__selected" );
				$( this ).next().addClass( "nav__visible" );
			}

		}) ;
	}


	function validarContacto() {

		$('.mensajeError').html('');
	
		if ($('#ContactDirigido').val() == '666') {
			$('.tipoError').html('Debes elegir el tipo de tu consulta');
			$('#ContactDirigido').focus();
			return false;
		}
	
		var nombre = $.trim($('#ContactName').val())
		$('#ContactName').val(nombre);
	
		if ($('#ContactName').val() == '') {
			$('.nameE').html('Debes Ingresar tu nombre');
			$('#ContactName').focus();
			return false;
		}
	
		var e_mail = $.trim($('#ContactEmail').val())
		$('#ContactEmail').val(e_mail);
		if ($('#ContactEmail').val() == '') {
			$('.emailE').html('Debes Ingresar tu E-Mail!');
			$('#ContactEmail').focus();
			return false;
		}
	
	
		if (!isEmailAddress($('#ContactEmail').val())) {
			$('.emailE').html('E-Mail Inválido!');
			$('#ContactEmail').focus();
			return false;
		}
	
		 var mensa = $.trim($('#ContactMessage').val())
		$('#ContactMessage').val(mensa);
		if ($('#ContactMessage').val() == '') {
			$('.messageE').html('Debes ingresar un mensaje!');
			$('#ContactMessage').focus();
			return false;
		}
	
		$('#ContactSendForm').submit();
	}


	$(document).ready( function() {

			$('.eventLink').click( function(e){
				e.preventDefault();
				base_url = 'https://www.microplay.cl' ;
				url = $(this).data('url');
				window.location.href = base_url + url ;
			})
	   

			$(".sidebar  input[type=checkbox]" ).click( function(e) {
				window.location.href = $(this).next().attr("href") ; 
			});


		//  TOGGLE  MENU  ON  MOBILE
			$( ".toggle-menu").click( function(e) {
				e.preventDefault();
				$(".nav").addClass( "mobile" ) ;
				$(".nav").toggle( ) ;
		
				setTimeout( mobileMenuBind(), 100) ;		
		

			});


			if( 'undefined' !==  typeof $.fn.nivoSlider ) {
				$('#slider').nivoSlider({
					directionNav: false,
					slices:1 // Para animaciones 'slice'
				});
			}



		//  Toggle   MENU  HOVER
			$( ".search__input"   ).focus(function(){
				console.log( ".search__input focus");
				$(".nav.mobile").hide( ) ;
			}) ;


			$( ".workarea > .header, .workarea > .content, .content_home , .workarea > .footer "   ).hover(
				function(){
					$( ".nav__visible" ).removeClass( "nav__visible" );
					$( ".nav__selected" ).removeClass( "nav__selected" );
				}, 
				function( e ){}) ;
	
			$( ".banner_home_inf_wrapper, .preheader, .content__home "   ).hover(
				function(){
					$( ".nav__visible" ).removeClass( "nav__visible" );
					$( ".nav__selected" ).removeClass( "nav__selected" );
				}, 
				function( e ){}) ;
		
			$( ".workarea" ).hover(
				function(){}, 
				function( e ){
					$( ".nav__selected" ).removeClass( "nav__selected" );
					$( ".nav__visible" ).removeClass( "nav__visible" );
				}) ;


		//  Toggle  SUB MENU 			
			$("nav > ul > li > a"   ).hover(function(){
				$("nav.nav .nav__visible").removeClass( "nav__visible" );
				$( ".nav__selected" ).removeClass( "nav__selected" );
				$( this ).addClass( "nav__selected" );
				$( this ).next().addClass( "nav__visible" );
			}, function( e ){})


			$("nav  .nav__link > a"    ).hover(function(){
				$(".nav__visible", $(this).parent().parent()).removeClass( "nav__visible" );
				$("nav  .nav__link .nav__selected").removeClass( "nav__selected" );

				$( this ).addClass( "nav__selected" );
				$( this ).next().addClass( "nav__visible" );
			}, function(){})


		/*
		$("nav > ul > li > a" ).click( function(e) {
			e.preventDefault();

			if( ! $( this ).next().hasClass( "nav__visible" ) )  {
				$("nav.nav .nav__visible").removeClass( "nav__visible" );
				$( ".nav__selected" ).removeClass( "nav__selected" );
				$( this ).addClass( "nav__selected" );
			}
			
		}) ;
		*/

		$('a.btn-agregar2').click(function (e) {
			e.preventDefault();
			$.ajax({
				url: base_url + 'orders/add_cart/' + $(this).data('product_id'),
				success: function (data) {
					window.location.href = base_url + 'orders/view_cart';
				}
			});
		});

		$('#ip-buscar').focus(function() {
			$.ajax({
				url: '/nombres/',
				data: "buscador_top=true"
			}).done(function (data) {
		
			   var names = data.split(',');
		
				var accentMap = {
					"á": "a",
					"ö": "o"
				};
				var normalize = function( term ) {
					var ret = "";
					for ( var i = 0; i < term.length; i++ ) {
						ret += accentMap[ term.charAt(i) ] || term.charAt(i);
					}
					return ret;
				};
		
				$( "#ip-buscar" ).autocomplete({
					source: function( request, response ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
						response( $.grep( names, function( value ) {
							value = value.label || value.value || value;
							return matcher.test( value ) || matcher.test( normalize( value ) );
						}) );
					},
					select: function( event, ui ) {  setTimeout("$('#btn-buscar').trigger('click');", 200);    }
				});
			});
			});
		

	
		$(".resultados-para_seccion big").click( function(e) {
			e.preventDefault();
			console.log( ".resultados-para_seccion big" );
			$(this).next().fadeToggle() ;

		});


	});
	
} else {
	console.log( "JQuery  required !" );
}
