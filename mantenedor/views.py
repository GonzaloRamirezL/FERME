from django.shortcuts import render
from django.views.generic import ListView, DetailView, TemplateView
from .models import Imagenes
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.messages.views import SuccessMessageMixin
from django.contrib import messages
from django.urls import reverse
from django.http import StreamingHttpResponse 
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
from django.db import connection
from django.http import JsonResponse
import json
from django.http import HttpResponse
import cx_Oracle

##PAL LOGIN
from django.contrib.auth import logout as do_logout
from django.shortcuts import render, redirect 
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as do_login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import user_passes_test
from django.contrib.admin.views.decorators import staff_member_required
#from .forms import UserForm
import smtplib
from myWeb import settings
from django.core.mail import EmailMultiAlternatives

def enviarEmailPasswordProveedor(mail, codigo):
    codigo_mail = codigo
    email = EmailMultiAlternatives(
        'Se ha creado un acceso a ferme ferreteria',
        'En este sitio podrá verificar sus ordenes de pedido'
        '\n Contraseña de acceso: '+ str(codigo_mail) +
        '\n Link de acceso: http://127.0.0.1:8000/empleados',
        settings.EMAIL_HOST_USER,
        [mail]
    )

    #email.attach_alternative(content, 'Correo pa recuperar contra')
    email.send()

def welcome(request):
    # Si estamos identificados devolvemos la portada
    if request.user.is_authenticated:
        data = {
            'count_venta': estVentas_count(),
            'count_clientes': estClientes_count(),
            'venta_mes': estVentasMes_count(),
            'ventas_anno': estVentasAnno_count(),
        }    
        return render(request, "mantenedor/index.html", data)
    # En otro caso redireccionamos al login
    return redirect('/login')

"""
def register(request):
    # Creamos el formulario de autenticación vacío
    form = UserCreationForm
    print(form)
    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/')
    else:
        form = UserForm()


    return render(request, 'users/register.html', {'form': form})
"""
def login(request):
    # Creamos el formulario de autenticación vacío
    form = AuthenticationForm()
    if request.method == "POST":
        # Añadimos los datos recibidos al formulario
        form = AuthenticationForm(data=request.POST)
        # Si el formulario es válido...
        if form.is_valid():
            # Recuperamos las credenciales validadas
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            

            # Verificamos las credenciales del usuario
            user = authenticate(username=username, password=password)
            # Si existe un usuario con ese nombre y contraseña
            if user is not None:
                # Hacemos el login manualmente
                do_login(request, user)
                # Y le redireccionamos a la portada
                return redirect('/')

    # Si llegamos al final renderizamos el formulario
    return render(request, "users/login.html", {'form': form})

def logout(request):
    # Finalizamos la sesión
    do_logout(request)
    # Redireccionamos a la portada
    return redirect('/')

@csrf_exempt
@login_required(login_url='/login')
def FrmMarca(request):

    img = Imagenes()
    img.id_img = '1'
    img.imagen = request.FILES.get('fotoProd')
    print(img.imagen)
    img.save()

    return render(request, "mantenedor/marca/FrmMarca.html")

##INDEX = PAGINA MANTENEDOR PRINCIPAL
##NEGOCIO = PAGINA DEL CLIENTE PRINCIPAL

@login_required(login_url='/login')
def index(request):
    data = {
        'count_venta': estVentas_count(),
        'count_clientes': estClientes_count(),
        'venta_mes': estVentasMes_count(),
        'ventas_anno': estVentasAnno_count(),
    } 
    return render(request, "mantenedor/index.html", data)

@csrf_exempt
def loginn(request):

    if request.method == "POST":
        # Añadimos los datos recibidos al formulario
        form = AuthenticationForm(data=request.POST)
        # Si el formulario es válido...
        print(form)
        if form.is_valid():
            # Recuperamos las credenciales validadas
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']

            # Verificamos las credenciales del usuario
            user = authenticate(username=username, password=password)
            
            if user is not None:
                # Hacemos el login manualmente
                do_login(request, user)
                # Y le redireccionamos a la portada
                return redirect('/')
    return render(request, "sesiones/loginOperario.html")

def cargarFotos(request):
    return render(request, "test/imagenes.html")
    #return HttpResponseRedirect("test/imagenes.html")

##PRODUCTO FORMULARIOS 
def producto(request):
    categoria = {
        'categoria': retornarCategorias()

    }
    return render(request, "mantenedor/producto/FrmProducto.html", categoria)

@csrf_exempt 
@login_required(login_url='/login')
def productoListado(request):

    data = {
        'categoria': retornarCategorias(),
        'marcas': retornarMarcas()
    }

    return render(request, "mantenedor/producto/productoIndex.html", data)

@csrf_exempt
@login_required(login_url='/login')
def agregarProductos(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    rut = request.POST.get('rutProveedor')
    nombre = request.POST.get('nombreProducto')
    fecha = request.POST.get('fechaVencimiento')
    unitario = request.POST.get('precioUnitario')
    stk = request.POST.get('inputStock')
    stkCritico = request.POST.get('inputStockcritico')
    subId = request.POST.get('idSubcat')
    marcaId = request.POST.get('idMarca')
    foto = request.POST.get('img')
    descripcion = request.POST.get('descripcionProd')
    check = request.POST.get('check')

    cursor.callfunc('DAO_producto.sql_insertar_producto', int, [nombre, fecha, unitario, stk, stkCritico, rut, subId, marcaId, foto, descripcion, check])

    return StreamingHttpResponse('{"ok":"true","msg":"producto agregado"}') 

@login_required(login_url='/login')
def retornarProductos():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_producto.sql_listar_productos", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
@login_required(login_url='/login')
def buscarProducto(request):
    idProducto = request.POST.get('IdProducto')
    print(idProducto)
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_producto.sql_buscar_producto", [idProducto, out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
@login_required(login_url='/login')
def actualizarProducto(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    idProducto = request.POST.get('IdProducto')
    nombre = request.POST.get('nombreProducto')
    unitario = request.POST.get('precioUnitario')
    stkCritico = request.POST.get('inputStockcritico')
    subId = request.POST.get('idSubcat')
    marcaId = request.POST.get('idMarca')
    foto = request.POST.get('img')
    descripcion = request.POST.get('descripcionProd')
    check = request.POST.get('check')
    stock = request.POST.get('stock')

    cursor.callfunc('DAO_producto.sql_actualizar_producto', int, [idProducto, nombre, marcaId, subId, stkCritico, unitario, foto, descripcion, check, stock])

    return StreamingHttpResponse('{"ok":"true","msg":"producto modificado"}') 

@csrf_exempt
@login_required(login_url='/login')
def eliminarProducto(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    idProducto = request.POST.get('IdProducto')
    activo = request.POST.get('activo')

    salida = cursor.callfunc('DAO_producto.sql_eliminar_producto', int, [idProducto, activo])

    print(salida)

    return StreamingHttpResponse('{"ok":"true","msg":"producto modificado"}') 

@csrf_exempt
@login_required(login_url='/login')
def listarProductos(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_producto.sql_listar_productos", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 
############################################################################

##USUARIO FORMULARIOS 
def usuarioListado(request):
    return render(request, "mantenedor/usuarios/usuarioIndex.html")
############################################################################

##PEDIDOS FORMULARIOS 
@login_required(login_url='/login')
def pedidosListado(request):
    return render(request, "mantenedor/pedidos/pedidosIndex.html")

@csrf_exempt
@login_required(login_url='/login')
def listarPedidos(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PEDIDO.sql_listar_pedidos", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data)  

@csrf_exempt
@login_required(login_url='/login')
def listarPedidosId(request):
    idPed = request.POST.get('idPedido')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PEDIDO.sql_listar_detalle_pedido", [out_cur, idPed])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
@login_required(login_url='/login')
def listarDatosProveedor(request):
    rut = request.POST.get('rutProv')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PEDIDO.sql_listar_detalle_proveedor", [out_cur, rut])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
@login_required(login_url='/login')
def listarDatosPedido(request):
    idPed = request.POST.get('idPedido')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PEDIDO.sql_listar_detalle_compra", [out_cur, idPed])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
@login_required(login_url='/login')
def listarProductosProveedor(request):
    rut = request.POST.get('rutProveedor')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PEDIDO.sql_listar_productos_proveedor", [out_cur, rut])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
@login_required(login_url='/login')
def agregarPedido(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.var(cx_Oracle.NUMBER)

    obs = request.POST.get('obsPedido')
    rut = request.POST.get('rutProveedor')
    cursor.callfunc('DAO_PEDIDO.sql_insertar_pedido', int, [obs, rut])

    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}') 

@csrf_exempt
@login_required(login_url='/login')
def modificarEstadoPedido(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   

    pedido = request.POST.get('idPedido')
    accion = request.POST.get('accion')

    print(pedido +' '+ accion)
    cursor.callproc('DAO_PEDIDO.sql_modificar_orden_compra', [pedido, accion])

    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}') 

@csrf_exempt
@login_required(login_url='/login')
def agregarProductoPedido(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   

    numero = request.POST.get('numPedido')
    codigo = request.POST.get('codProducto')
    cantidad = request.POST.get('cantProducto')

    salida = cursor.callfunc('DAO_PEDIDO.sql_insertar_detalles', int, [numero, codigo, cantidad])
    print(salida)
    return StreamingHttpResponse('{"ok":"true","msg":"producto agregado al pedido"}')

@csrf_exempt
@login_required(login_url='/login')
def eliminarPedido(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  
    numero = request.POST.get('idPedido')

    cursor.callfunc('DAO_PEDIDO.sql_eliminar_pedido', int, [numero])

    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}') 

@csrf_exempt
@login_required(login_url='/login')
def eliminarProductoPedido(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  

    pedido = request.POST.get('IdPedido')
    producto = request.POST.get('IdProducto');


    cursor.callfunc('DAO_PEDIDO.sql_eliminar_producto_pedido', int, [pedido, producto])

    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}') 

############################################################################

##VENTAS FORMULARIOS 

def ventasListado(request):
    return render(request, "mantenedor/ventas/ventasIndex.html")
############################################################################

##USUARIO FORMULARIOS 

def despachosListado(request):
    return render(request, "mantenedor/despachos/despachosIndex.html")

def despachosFrm(request):
    return render(request, "mantenedor/despachos/FrmDespacho.html")
############################################################################

############################################################################



####################################################################################################
##MARCA FORMULARIOS
#este es el ejemplo de la foto xd
@csrf_exempt
@login_required(login_url='/login')
def FrmMarca(request):

    img = Imagenes()
    img.id_img = '1'
    img.imagen = request.FILES.get('fotoProd')
    print(img.imagen)
    img.save()

    return render(request, "mantenedor/marca/FrmMarca.html")


@csrf_exempt
@login_required(login_url='/login')
def marcaListado(request):
    return render(request, 'mantenedor/marca/marcaIndex.html') 

@csrf_exempt
def listadoDeMarcas(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_MARCA.sql_listar_marcas", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 


#ESTE SI QUE FUNCIONA XD
@csrf_exempt
def buscarMarca(request):
    idMarca = request.POST.get('IdMarca')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_MARCA.sql_buscar_marca", [idMarca, out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 

#no se esta usando esta función
@csrf_exempt
def marcaInsertar(request):
    descripcion = request.POST.get('nomMarca')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    salida = cursor.callfunc('dao_marca.sql_insertar_marca', int, [descripcion])

    if salida == 2:
        return StreamingHttpResponse('{"ok":"false","msg":"la marca está repetida"}') 
           
    return StreamingHttpResponse('{"ok":"true","msg":"Marca agregada"}') 


@csrf_exempt
def marcaEliminar(request):
    marcaId= request.POST.get('IdMarca')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('dao_marca.sql_eliminar_marca', int, [marcaId])
    return StreamingHttpResponse('{"ok":"true","msg":"marca eliminada"}') 

@csrf_exempt
def marcaActualizar(request):
    marcaId= request.POST.get('IdMarca')
    nombre = request.POST.get('nombreMarca')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('dao_marca.sql_actualizar_marca', int, [marcaId, nombre])

    return StreamingHttpResponse('{"ok":"true","msg":"marca actualizada"}') 

def retornarMarcas():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_MARCA.sql_listar_marcas", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista
###########################################################################
    
############################################################################
##RUBRO FORMULARIOS
@login_required(login_url='/login')
def RubroListado(request):
    return render(request, "mantenedor/rubro/rubroIndex.html")

@csrf_exempt
def listadoDeRubros(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_RUBRO.SQL_LISTAR_RUBRO", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json

    return StreamingHttpResponse(data) 

@csrf_exempt
def agregarRubro(request):
    
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    nombre = request.POST.get('nomRubro')
    print(nombre)

    cursor.callfunc('DAO_RUBRO.SQL_INSERTAR_RUBRO', int, [nombre])
    return StreamingHttpResponse('{"ok":"true","msg":"rubro agregado"}')

@csrf_exempt
def buscarRubro(request):
    rubro = request.POST.get('IdRubro')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_RUBRO.SQL_LISTAR_RUBRO_PARAMETRO", [out_cur, rubro])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 

@csrf_exempt
def editarRubro(request):
   
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    rubro = request.POST.get('IdRubro')
    nombre = request.POST.get('nomRubro')

    cursor.callfunc('DAO_RUBRO.SQL_MODIFICAR_RUBRO', int, [rubro, nombre])
    return StreamingHttpResponse('{"ok":"true","msg":"rubro modificado"}')

@csrf_exempt
def rubroEliminar(request):
    rubro= request.POST.get('IdRubro')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('DAO_RUBRO.SQL_ELIMINAR_RUBRO', int, [rubro])
    return StreamingHttpResponse('{"ok":"true","msg":"rubro eliminado"}') 
###########################################################################
### comunas y regiones
def retornarRegiones():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_COMUNA.sql_listar_regiones", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def buscarComunas(request):
    region = request.POST.get('IdRegion')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_COMUNA.sql_listar_comunas_region", [out_cur, region])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 


##PROVEEDOR FORMULARIOS
@csrf_exempt
@login_required(login_url='/login')
def ProveedorListado(request):

    data = {
        'region': retornarRegiones(),
        'rubro': retornarRubro()       
    }

    return render(request, 'mantenedor/proveedor/ProveedorIndex.html', data) 

def retornarProveedor():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PROVEEDOR.sql_listar_proveedor", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def listadoProveedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PROVEEDOR.sql_listar_proveedor", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def agregarProveedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    rut = request.POST.get('txtRutProveedor')
    proveedor = request.POST.get('txtNomProveedor')
    representante = request.POST.get('txtNomRepresentante')
    direccion = request.POST.get('txtDireccion')
    telefono = request.POST.get('txtTelefono')
    email = request.POST.get('txtEmail')
    idrubro = request.POST.get('idRubro')
    idcomuna = request.POST.get('idComuna')

    #enviarEmailPasswordProveedor
    pws = cursor.callfunc('DAO_USUARIOS.sql_asignar_password_proveedor', int)
    salida = cursor.callfunc('DAO_USUARIOS.sql_registrar_persona_usuario_proveedor', int, [rut, proveedor, representante, representante, direccion, telefono, idcomuna, email, pws])
    cursor.callfunc('DAO_PROVEEDOR.sql_insertar_proveedor', int, [rut, proveedor, representante, direccion, telefono, email, idrubro, idcomuna])

    enviarEmailPasswordProveedor(email, pws)

    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}')

def retornarRubro():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_RUBRO.SQL_LISTAR_RUBRO", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def retornarComuna():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_COMUNA.SQL_LISTAR_COMUNA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def proveedorActualizar(request):
    rut = request.POST.get('txtRutProveedor')
    proveedor = request.POST.get('txtNomProveedor')
    representante = request.POST.get('txtNomRepresentante')
    direccion = request.POST.get('txtDireccion')
    telefono = request.POST.get('txtTelefono')
    email = request.POST.get('txtEmail')
    idrubro = request.POST.get('idRubro')
    idcomuna = request.POST.get('idComuna')

    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('DAO_PROVEEDOR.sql_actualizar_proveedor', int, [rut, proveedor, representante, direccion, telefono, email, idrubro, idcomuna])

    return StreamingHttpResponse('{"ok":"true","msg":"proveedor actualizado"}') 

@csrf_exempt
def buscarProveedor(request):
    idd = request.POST.get('rute')
    print(idd)
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PROVEEDOR.SQL_BUSCAR_PROVEEDOR", [out_cur, idd])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 

@csrf_exempt
def proveedorEliminar(request):
    rutt= request.POST.get('rute')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('DAO_PROVEEDOR.SQL_ELIMINAR_PROVEEDOR', int, [rutt])
    return StreamingHttpResponse('{"ok":"true","msg":"Proveedor eliminado"}') 
############################################################################

##PERSONA FORMULARIOS
def PersonaListado(request):
    return render(request, 'mantenedor/Persona/PersonaIndex.html')

def PersonaFrm(request):
    return render(request, "mantenedor/Persona/FrmPersona.html")
############################################################################

#CATEGORIA FORMULARIOS
@login_required(login_url='/login')
def retornarSubCategoriasId(request):
    categoria = request.GET.get('categoria')

    subcategorias = {
        'subcategorias': retornarSubCategorias(categoria)
    }

    return render(request, 'mantenedor/categoria/subCategoriaCmb.html', subcategorias)

@login_required(login_url='/login')
def categoriaListado(request):

    data = {
        'Categoria': retornarCategorias()
    }

    return render(request, 'mantenedor/categoria/subCategoriaIndex.html', data)


def retornarCategorias():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listar_categorias", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def retornarCategoriasYsubCategoria(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listado_categoria_subcat", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

def retornarSubCategorias(idCategoria):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listar_sub_categorias", [out_cur, idCategoria])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def insertarSubCategoria(request):
    descripcion = request.POST.get('txtSubCategoria')
    idCategoria = request.POST.get('idCategoria')

    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    cursor.callfunc('DAO_SUB_CATEGORIA.sql_insertar_sub_categoria', int, [descripcion, idCategoria])

    return StreamingHttpResponse('{"ok":"true","msg":"Agregado a las sub categorias"}') 

@csrf_exempt
def buscarSubCategoria(request):
    idSub = request.POST.get('idSubCat')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_buscar_subcategoria", [out_cur, idSub])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def subcategoriaActualizar(request):
    idsub= request.POST.get('txtIdSub')
    nombre = request.POST.get('txtSubCategoria')
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    cursor.callfunc('DAO_SUB_CATEGORIA.sql_actualizar_subcategoria', int, [idsub, nombre])

    return StreamingHttpResponse('{"ok":"true","msg":"marca actualizada"}') 

@login_required(login_url='/login')
def FrmCategoria(request):
    data = {
        'Categoria': retornarCategorias()
    }

    print(data)
    return render(request, "mantenedor/categoria/FrmSubCategoria.html", data)

@login_required(login_url='/login')
def listaEmpleados(request):

    data = {
        'region': retornarRegiones(), 
    }

    return render(request, "mantenedor/usuarios/empleadosIndex.html", data)

@csrf_exempt
def listaDeUsuarios(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_USUARIOS.sql_listar_usuarios", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

##ESTADISTICAS
                                                            ##Actualizar index principal con la data de las estadísticas



                                                                        ##Actualizar el def principal de estadísticas
    
##ESTADISTICAS
@login_required(login_url='/login')
def mostrarEstadisticas(request):
    data = {
        'count_venta': estVentas_count(),
        'count_clientes': estClientes_count(),
        'venta_mes': estVentasMes_count(),
        'ventas_anno': estVentasAnno_count(),
        'categoria_list': grafCat_count_list(),
        'documento_list': grafDoc_count_list(),
        'ventas_sum_list': grafVentasMes_sum_list(),
        'ventas_count_list': grafVentasMes_count_list(),
        'productos_count_list': grafProdCat_count_list(),
    }
    return render(request, 'mantenedor/estadisticas/indexEstadisticas.html', data)

def estVentas_count ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    count = cursor.callfunc("DAO_estadisticas.sql_contar_ventas", int)

    return (count)

def estClientes_count ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    count = cursor.callfunc("DAO_estadisticas.sql_contar_clientes", int)

    return (count)

def estVentasMes_count ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    count = cursor.callfunc("DAO_estadisticas.sql_contar_ventas_mes", int)

    return (count)

def estVentasAnno_count ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    count = cursor.callfunc("DAO_estadisticas.sql_contar_ventas_anno", int)

    return (count)

def estProv_count ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    count = cursor.callfunc("DAO_estadisticas.sql_contar_prov", int)

    return (count)

@csrf_exempt
def grafVentasMes_count (request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_COUNTMES_VENTA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def grafVentasMes_sum (request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_SUMMES_VENTA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def grafDoc_count (request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_DOC_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def grafCat_count (request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_CAT_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def grafProdCat_count (request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_PROD_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

#listas para mostrar en html
def grafCat_count_list (): 
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_CAT_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista 

def grafDoc_count_list ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_DOC_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def grafVentasMes_sum_list ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_SUMMES_VENTA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def grafVentasMes_count_list ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_COUNTMES_VENTA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def grafProdCat_count_list ():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_estadisticas.SQL_PROD_COUNT", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)
    return lista

@csrf_exempt
def registrarUsuarioMantenedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    rut = request.POST.get("txtRutUsuario")
    empresa = request.POST.get("txtNomEmpresa")
    nombres = request.POST.get("txtNomUsuario")
    paterno = request.POST.get("txtPaternoUsuario")
    materno = request.POST.get("txtMaternoUsuario")
    fecha = request.POST.get("txtNacimiento")
    direccion = request.POST.get("txtDireccion")
    telefono = request.POST.get("txtTelefono")
    imagen = ""
    comuna = request.POST.get("idComuna")
    email = request.POST.get("txtEmail")
    password = request.POST.get("password1")
    tipo = request.POST.get("idTipoUsusario")

    salida = cursor.callfunc('DAO_USUARIOS.sql_registrar_persona_usuario', int, [rut, empresa, nombres, 
                                                                                paterno, materno, fecha, 
                                                                                direccion, telefono, imagen,
                                                                                comuna, email, password,
                                                                                tipo])

    return StreamingHttpResponse('{"ok":"true","msg":"registro agregado"}') 

@csrf_exempt
def modificarUsuarioMantenedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    usuario = request.POST.get("idUsuario")
    rut = request.POST.get("txtRutUsuario")
    empresa = request.POST.get("txtNomEmpresa")
    nombres = request.POST.get("txtNomUsuario")
    paterno = request.POST.get("txtPaternoUsuario")
    materno = request.POST.get("txtMaternoUsuario")
    fecha = request.POST.get("txtNacimiento")
    direccion = request.POST.get("txtDireccion")
    telefono = request.POST.get("txtTelefono")
    comuna = request.POST.get("idComuna")
    email = request.POST.get("txtEmail")
    password = request.POST.get("password1")
    tipo = request.POST.get("idTipoUsusario")

    salida = cursor.callfunc('DAO_USUARIOS.sql_modificar_usuario', int, [usuario, rut, empresa, nombres, 
                                                                        paterno, materno, fecha, 
                                                                        direccion, telefono, comuna, 
                                                                        email, password, tipo])

    return StreamingHttpResponse('{"ok":"true","msg":"registro agregado"}') 

@csrf_exempt
def activarDescativarUsuarios(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    usuario = request.POST.get("idUsuario")
    activo = request.POST.get('idActivo')

    cursor.callproc("DAO_USUARIOS.sql_activar_destactivar_usuario", [usuario, activo])

    return StreamingHttpResponse('{"ok":"true","msg":"registro agregado"}') 

@csrf_exempt
def listaDeUsuariosFiltro(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    usuario = request.POST.get('idUsuario')

    cursor.callproc("DAO_USUARIOS.sql_listar_usuarios_filtro", [out_cur, usuario])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

##ADMINISTRACIÓN DESPACHOS
@login_required(login_url='/login')
def despachosPrincipal(request):
    return render(request, 'mantenedor/despachos/despachosIndex.html')

@csrf_exempt
def listarDespachosUsuarios(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_DESPACHOS.sql_listar_despachos", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

@csrf_exempt
def buscarDespachosUsuarios(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()
    despacho = request.POST.get('idDespacho')

    cursor.callproc("DAO_DESPACHOS.sql_buscar_despachos", [out_cur, despacho])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

@csrf_exempt
def anularDespacho(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    despacho = request.POST.get("idDespacho")
    estado = request.POST.get('estado')
    motivos = request.POST.get('motivos')
    email = request.POST.get('correo')
    
    enviarEmailAnularDespacho(email, despacho, motivos)

    cursor.callproc("DAO_DESPACHOS.sql_cambiar_estado_despacho", [despacho, estado])

    return StreamingHttpResponse('{"ok":"true","msg":"registro agregado"}') 

@csrf_exempt
def cambiarEstadoDespacho(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    despacho = request.POST.get("idDespacho")
    estado = request.POST.get('estado')
    email = request.POST.get('correo')
    fecha = request.POST.get('fecha')
    venta = request.POST.get('idVenta')
    direccion = request.POST.get('direccion')

    if estado == '2':
        motivo = 'confirmado'
    elif estado == '4':
        motivo = 'recibido'
    elif estado == '1':
        motivo = 'pendiente'

    
    enviarEmailConfirmacionDespacho(email, despacho, motivo, venta, direccion, fecha)
    cursor.callproc("DAO_DESPACHOS.sql_cambiar_estado_despacho_modificar", [despacho, estado, fecha, direccion])

    return StreamingHttpResponse('{"ok":"true","msg":"registro agregado"}') 

def enviarEmailAnularDespacho(mail, codigo, motivo):
    email = EmailMultiAlternatives(
        'DESPACHO ANULADO ferme ferreteria',
        'Su despacho número: '+str(codigo)+' ha sido anulado'
        '\n El motivo de la anulación: '+ motivo +
        '\n responda este correo para apelar a su despacho, en caso contrario indique si desea retirar sus productos en tienda',
        settings.EMAIL_HOST_USER,
        [mail]
    )

    #email.attach_alternative(content, 'Correo pa recuperar contra')
    email.send()

def enviarEmailConfirmacionDespacho(mail, codigo, motivo, venta, direccion, fecha):
    email = EmailMultiAlternatives(
        'DESPACHO '+ motivo +' ferme ferreteria',
        'Su despacho número: '+str(codigo)+' ha sido '+ motivo +
        '\n Su número de compra es: '+ venta +
        '\n Con dirección: '+ direccion +
        '\n Fecha estimada de entrega: '+ fecha +
        '\n responda este correo para apelar a su despacho, en caso contrario indique si desea retirar sus productos en tienda',
        settings.EMAIL_HOST_USER,
        [mail]
    )

    #email.attach_alternative(content, 'Correo pa recuperar contra')
    email.send()

@login_required(login_url='/login')
def listadoVentas(request):
    return render(request, 'mantenedor/ventas/ventasIndex.html')

@csrf_exempt
def listarVentasClientes(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_VENTA.SQL_LISTAR_VENTA", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

@csrf_exempt
def anularVentaCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    venta = request.POST.get("idVenta")

    cursor.callproc("DAO_VENTA.SQL_ELIMINAR_VENTA", [venta])

    return StreamingHttpResponse('{"ok":"true","msg":"registro modificado"}') 

#RECICLAJE Y TESTING
def webProveedor(request):
    return render(request, 'webCliente/index.html')

#test ESTO LO USÉ PARA PROBAR EL EXTENDS ENTREB PAGINAS NO SIRVE PARA NADA POR SIACASO
def test(request):
    return render(request, 'test/base.html')

def test2(request):
    return render(request, 'test/test.html')

