if( 'undefined' !== typeof $ ) {

    


    function MostrarCarro() {
        window.location.href = '/orders/view_cart' ;
    }


    function tamano(){
        var ancho = $('#contenedor').innerWidth();
        var alto  = ancho / 3.415 ;
        
        $('.slider').css('height', alto );
        $('#banner-principal').css('height',alto);
        $('#banner-principal img').css('height',alto);
        $('.banner_home_inf_wrapper_in').css('height',alto);
        $('.banner_home_inf_wrapper').css('height',alto);
    }


    $(window).load(function() {

        $('.slider1').bxSlider({ auto: true, pager:true, pause: 8000});
        $(".content_home h2").css( 'display' , 'flex') ;
        var ancho = $('#contenedor').innerWidth();
        if( ancho >= 762) {
            $(".content_home .left, .content_home .right").css( 'display' , 'block') ;
        }
        
    });


    $(document).ready(function () {

        tamano();

        $( window ).resize(function(){
            tamano();
        });


        $('.slider').on('mouseenter', function () {
            $('.bx-prev').show();
            $('.bx-next').show();
        }).on('mouseleave', function () {
            $('.bx-prev').hide();
            $('.bx-next').hide();
        });

        $(".owl-carousel").owlCarousel({
            autoPlay: 4000, //Set AutoPlay to 3 seconds
            items : 4,
            itemsDesktop : [1000,4],
            itemsDesktopSmall : [780,3],
            itemsTablet : [700,2],
            itemsPhone : [300,1],
            itemsMobile : false
        });


        $(".carrusel_productos .left span").click(function(){
            $(this).attr('disabled', true);
            var owl = $(this).parent().parent().children(".owl-carousel");
            owl.trigger('owl.prev');
        });

        $(".carrusel_productos .right span").click(function(){
            $(this).attr('disabled', true);
            var owl = $(this).parent().parent().children(".owl-carousel");
            owl.trigger('owl.next');
        })


        $('a.btn-fn-agregar').unbind("click").click(function (e) {
            e.preventDefault();
            $.ajax({
                url: base_url + 'orders/add_cart/' + $(this).data('product_id'),
                success: function (data) {
                    MostrarCarro() ;
                }
            });
        });

    });

}