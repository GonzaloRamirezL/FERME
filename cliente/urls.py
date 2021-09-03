from django.contrib import admin
from django.urls import path
from . import views 
#from .views import ListarMarcas
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	
	############################################################################################
    #path('registros', views.register),
    #URLS DE CLIENTES
    path('negocio', views.cliente, name='login'),
    path('logoutUser', views.LogoutCliente),

    ##usuario
    path('registrar', views.Registrarcliente, name='formuRegistros'),
    path('registroClienteFrm', views.CompletarFormularioCliente, name='frmRegistro'),
    path('carrito', views.CarritoCompra, name='carro'),
    path('carritoAdd', views.agregarCarroCompras, name='carro'),
    path('carroCargar', views.loadCarrito, name='fotosCrear'),
    path('carroCargar2', views.loadCarrito2, name='fotosCrear'),
    path('carroCargarDetalle', views.DatosCarroComprasCliente, name='fotosCrear'),
    path('detalleBaucherCliente', views.DetalleBaucherCliente, name='fotosCrear'),
    path('completarPagoCliente', views.completarPagoCliente, name='fotosCrear'),
    path('eliminarProductoCarro', views.eliminarProductoDelCarro, name='fotosCrear'),
    path('historialCliente', views.HistorialCompraCliente, name='fotosCrear'),
    path('cargarDatosHistorialCompras', views.CargarDatosHistorialCompra, name='fotosCrear'),
    path('cargarDetalleVentaCliente', views.CargarDetalleVenta, name='fotosCrear'),
    path('cargarDetalleVentaInfo', views.CargarDetalleVentaInformacion, name='fotosCrear'),
    path('restaurarPassword', views.restaurarContra, name='carro'),
    path('resetPasswordMail', views.resetPasswordMail, name='carro'),
    path('ConfirmarPasswordMail', views.ConfirmaResetPasswordMail, name='carro'),

    #Lista de detalles categorias
    path('categoriasidsub/<int:pk>', views.categoriaConstruccion, name='categoriaListado'),
    path('productoDetalle/<str:pk>', views.ProductoDetalleConstruccion, name='detalleProductos'),
    #path('productoDetalle', views.ProductoDetalleConstruccion, name='detalleProductos'),
    path('obtenerCategoria', views.obtenerCategoria, name='detalleProductos'),
    path('subCategoriaLista/',views.retornarSubCategorias,name='insertSub'),
	#############################################################################################

]