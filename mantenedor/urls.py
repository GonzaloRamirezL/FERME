from django.contrib import admin
from django.contrib.auth.views import LoginView
from django.urls import path
from . import views 
#from .views import ListarMarcas
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [

    #LOGIN
    path('', views.welcome),
    #path('register', views.register),
    path('login', views.loginn, name='login'),
    path('logout', views.logout),

    #ESTATISTICAS
    path('indexEstadisticas', views.mostrarEstadisticas, name='index'),
    path('grafVentasMes_count', views.grafVentasMes_count, name='grafVentasMes_count'),
    path('grafVentasMes_sum', views.grafVentasMes_sum, name='grafVentasMes_sum'),
    path('grafDoc_count', views.grafDoc_count, name='grafDoc_count'),
    path('grafCat_count', views.grafCat_count, name='grafCat_count'),
    path('grafProdCat_count', views.grafProdCat_count, name='grafProdCat_count'),


    #URLS DE PAGINA ADMINISTRADOR Y PAGINA NEGOCIO
    path('mantenedores', views.index, name='principalMantenedor'),
    
    #URLS DE MANTENEDOR/VISTAS PRODUCTO
    path('productoFrm', views.producto, name='FrmProductos'),
    path('productoIndex', views.productoListado, name='ListaProductos'),
    path('productoAgregar', views.agregarProductos, name='ListaProductos'),
    path('productoBuscar', views.buscarProducto, name='ListaProductos'),
    path('productoActualizar', views.actualizarProducto, name='ListaProductos'),
    path('listarProductos', views.listarProductos, name='ListaDeProductos'),
    path('eliminarProductos', views.eliminarProducto, name='ListaDeProductos'),
    path('retornar', views.FrmMarca, name='retornarMarcas'), #ESTE SUBE LA FOTO PRINCIPAL DEL PRODUCTO

    #URLS DE MANTENEDOR/VISTAS USUARIO
    path('usuarioIndex', views.usuarioListado, name='ListaUsuario'),

    #URLS DE MANTENEDOR/VISTAS PEDIDOS
    path('pedidosIndex', views.pedidosListado, name='ListaPedido'),
    path('agregarPedido', views.agregarPedido, name='ListaPedido'),
    path('agregarPedidoProducto', views.agregarProductoPedido, name='ListaPedido'),
    path('eliminarPedido', views.eliminarPedido, name='OrdenCompraFrm'),
    path('buscarPedido', views.listarPedidosId, name='OrdenCompraFrm'),
    path('detalleProveedor', views.listarDatosProveedor, name='OrdenCompraFrm'),
    path('detalleCompraPedido', views.listarDatosPedido, name='OrdenCompraFrm'),
    path('eliminarProductoPedido', views.eliminarProductoPedido, name='OrdenCompraFrm'),
    path('listarPedidos', views.listarPedidos, name='listaDePedidos'),
    path('listarProductosProveedor', views.listarProductosProveedor, name='listaDePedidos'),
    path('modificarEstadoPedido', views.modificarEstadoPedido, name='listaDePedidos'),

    #URLS DE MANTENEDOR/VISTAS VENTAS
    path('ventasIndex', views.ventasListado, name='ListaVenta'),

    #URLS DE MANTENEDOR/VISTAS DESPACHOS
    path('despachosIndex', views.despachosListado, name='ListaDespacho'),
    path('despachosFrm', views.despachosFrm, name='ListaDespacho'),

    #URLS DE MANTENEDOR ESTADISTICAS
    path('indexEstadisticas', views.mostrarEstadisticas, name='index'),


############################################################################################
    #URLS DE MANTENEDOR/VISTAS MARCA
    path('marcaIndex', views.marcaListado, name='listaMarcas'), #Url Principal (listado)
    path('marcaInsertar', views.marcaInsertar, name='marcaInsertar'), 
    path('marcaBuscar', views.buscarMarca, name='marcaBuscar'), 
    path('marcaEliminar', views.marcaEliminar, name='marcaEliminar'), 
    path('actualizarMarca', views.marcaActualizar, name='actualizarMarca'), 
    path('listarMarcas', views.listadoDeMarcas, name='listarMarcasTodas'),  #Url para datatable de marcas

    #URLS DE MANTENEDOR/VISTAS CATEGORIA
    path('categoriaIndex', views.categoriaListado ,name='listaCategorias'),
    path('categoriaFrm',views.FrmCategoria,name='FrmCategorias'),
    path('insertSubCategoria',views.insertarSubCategoria,name='insertSub'),
    path('subCategoriaCmb/',views.retornarSubCategoriasId,name='insertSub'),
    path('buscarSubCategoria',views.buscarSubCategoria,name='insertSub'),
    path('actualizarSubCat', views.subcategoriaActualizar, name='actualizarMarca'),
    path('listarSubCategorias', views.retornarCategoriasYsubCategoria, name='listaCat'),

    #URLS DE MANTENEDOR/VISTAS PERSONA
    path('personaIndex',views.PersonaListado,name='listaPersonas'),
    path('personaFrm',views.PersonaFrm,name='FrmPersonas'),

    #URLS MANTENEDOR/VISTAS PROVEEDOR
    path('proveedorIndex',views.ProveedorListado,name='listaProveedor'),
    #path('proveedorFrm',views.FrmProveedor,name='FrmProveedor'),
    path('agregarProveedor',views.agregarProveedor,name='FrmProveedor'),
    path('actualizarProveedor', views.proveedorActualizar, name='actualizarProveedor'),
    path('proveedorBuscar', views.buscarProveedor, name='proveedorBuscar'),
    path('proveedorEliminar', views.proveedorEliminar, name='proveedorEliminar'),
    path('proveedorListado', views.listadoProveedor, name='proveedorListar'),

    #URLS MANTENEDOR/VISTAS RUBROS
    path('rubroIndex',views.RubroListado,name='listaRubros'),
    path('rubroAgregar',views.agregarRubro,name='agregarRubros'),
    path('rubroBuscar',views.buscarRubro,name='buscarRubro'),
    path('modificarBuscar',views.editarRubro,name='editarRubro'),
    path('eliminarRubro',views.rubroEliminar,name='eliminarRubro'),
    path('listarRubros',views.listadoDeRubros,name='listaDeRubros'),

    #URLS CAMBIAR COMUNA POR REGION
    path('filtroComunas',views.buscarComunas,name='filtrarComunas'),

    #URLS EMPLEADOS / USUARIOS
    path('listarEmpleados',views.listaEmpleados,name='listaDeRubros'),
    path('listarDeUsuarios',views.listaDeUsuarios,name='listaDeRubros'),
    path('listarDeUsuariosFiltro',views.listaDeUsuariosFiltro,name='listaDeRubros'),
    path('modificarUsuario',views.modificarUsuarioMantenedor,name='listaDeRubros'),
    path('activarDescativarUsuario',views.activarDescativarUsuarios,name='listaDeRubros'),
    path('registrarUsuarioMantenedor',views.registrarUsuarioMantenedor,name='listaDeRubros'),

    #URLS DESPACHOS
    path('despachosIndex',views.despachosPrincipal,name='listaDeRubros'),
    path('listaDespachosCliente',views.listarDespachosUsuarios,name='listaDeRubros'),
    path('buscarDespachoCliente',views.buscarDespachosUsuarios,name='listaDeRubros'),
    path('cambiarEstadoDespachoAnular',views.anularDespacho,name='listaDeRubros'),
    path('cambiarEstadoDespachoConfirmar',views.cambiarEstadoDespacho,name='listaDeRubros'),

    #URLS VENTAS
    path('totalVentas', views.listadoVentas, name='login'),
    path('listadoVentas', views.listarVentasClientes, name='login'),
    path('anularVenta', views.anularVentaCliente, name='login'),
############################################################################################

    ##PA TEST aqui estan los ejemplos de alert y de como subir una imagen NO BORRAR PLS
    path('test', views.test, name='testing'),
    path('test2', views.test2, name='testing2'),
    path('imagen', views.cargarFotos, name='login'),
    


]

