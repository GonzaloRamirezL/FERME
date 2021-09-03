from django.contrib import admin
from django.urls import path
from . import views 
#from .views import ListarMarcas
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	############################################################################################
    #URLS DE EMPLEADO
    path('empleados', views.loginEmpleadoIndex, name='login'),
    path('empleadosLogin', views.loginEmpleadosForm, name='login'),
    path('empleadosLogout', views.LogoutUsuarioEmpleado, name='indexEmpleados'),
    path('empleadosPrincipal', views.empleado, name='indexEmpleados'),
    path('empleadosVentas', views.empleadosVenta, name='frmVentas'),
    path('resumenFactura', views.resumenFactura, name='resumenFactura'),
    path('resumenBoleta', views.resumenBoleta, name='resumenBoleta'),
    path('calendarioVendedor', views.calendarioVendedor, name='calendarioVendedor'),
	#############################################################################################
    path('agregarPreventa', views.agregarPreventa, name='agregarPreventa'),
    path('eliminarPreventa', views.eliminarPreventa, name='eliminarPreventa'),
    path('listarPreventa', views.listarPreventa, name='listarPreventa'),
    path('agregarVenta', views.agregarVenta, name='agregarVenta'),
    path('cancelarPreventa', views.cancelarPreventa, name='agregarVenta'),
    path('totalesPreventa', views.retornarTotalesPreventa, name='agregarVenta'),

    #URLS PROVEEDOR
    path('proveedores', views.proveedorPrincipal, name='agregarVenta'),
    path('proveedoresListaPedidos', views.listarPedidosProveedor, name='agregarVenta'),

    #URLS VENTAS
    path('historialVentas', views.historialVentasClientesPrincipal, name='agregarVenta'), 
    path('historialVentasVendedor', views.listarVentasHistorialVendedor, name='agregarVenta'), 
]