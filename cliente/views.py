from django.shortcuts import render
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
from django.http import StreamingHttpResponse 
import json
import cx_Oracle
import smtplib
from myWeb import settings
from django.core.mail import EmailMultiAlternatives

def testEmail():
    try:
        mailServer = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        print(mailServer.ehlo())
        mailServer.starttls()
        print(mailServer.ehlo())
        mailServer.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        print('CONETADOOOOOOOOOOOOO')
    except Exception as e:
        print(e)

def enviarEmailPassword(mail, codigo):
    codigo_mail = codigo
    email = EmailMultiAlternatives(
        'Recuperación de contraseña FERME ferretería',
        'Usted solicitó la restauración de su contraseña, si no a realizado esta acción ignore el correo'
        '\n Código de Recuperación: '+ str(codigo_mail),
        settings.EMAIL_HOST_USER,
        [mail]
    )

    #email.attach_alternative(content, 'Correo pa recuperar contra')
    email.send()

def restaurarContra(request):

    data = {
        'login': DatosClienteLogin()
    }
    
    return render(request, 'cliente/usuarios/olvidePassword.html', data)

@csrf_exempt
def resetPasswordMail(request):
    mail = request.POST.get("email")
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.callfunc('DAO_USUARIOS.sql_recuperar_password', int, [mail])
    print(salida)

    if salida == 0:
        return StreamingHttpResponse('{"ok":"false","msg":"correo no valido"}') 
    else:
        enviarEmailPassword(mail, salida)
    return StreamingHttpResponse('{"ok":"true","msg":"código enviado a su correo"}')   

@csrf_exempt
def ConfirmaResetPasswordMail(request):
    mail = request.POST.get("mail")
    codigo = request.POST.get("codigo")
    password = request.POST.get("password")
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.callfunc('DAO_USUARIOS.sql_cambiar_password', int, [mail, codigo, password])

    if salida == 2:
        return StreamingHttpResponse('{"ok":"false","msg":"el código no corresponde"}')    

    return StreamingHttpResponse('{"ok":"true","msg":"contraseña cambiada"}')          

##PAGINA PRINCIPAL DEL CLIENTE###################################
@csrf_exempt
def cliente(request):

    data = {
        'categoria': retornarCategorias(), 
        'login': DatosClienteLogin(),
        'destacados': RetornarProductosDestacados()

    }

    if request.method == 'POST':
        usuario = request.POST.get("txtUsuario")
        contra = request.POST.get("txtPassword")
        validar = LoginClientes(usuario, contra, 4)

    """
    try:
        mailServer = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        print(mailServer.ehlo())
        mailServer.starttls()
        print(mailServer.ehlo())
        mailServer.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        print('CONETADOOOOOOOOOOOOO')
    except Exception as e:
        print(e)
    """
    return render(request, "cliente/indexCliente.html", data)   

#CATEGORIA FORMULARIOS
def retornarSubCategorias(request):

    categoria = request.GET.get('categoria')

    data = {
        'subcategorias': retornarCategoriaConstruccion(categoria)
    }

    return render(request, 'cliente/categorias/cargarSubCategorias.html', data)

@csrf_exempt
def categoriaConstruccion(request, pk):
    
    data = {
        'producto': retornarProductosSub(pk),
        'login': DatosClienteLogin()
    }

    return render(request, 'cliente/categorias/categoriaConstruccion.html', data)

@csrf_exempt
def loadCarrito(request):
    usuario = request.POST.get('IdUsuario')

    data = {
        'regCarro': LoadCarroCompras(usuario),
    }
   
    return render(request, "cliente/usuarios/loadCarrito.html", data)   

@csrf_exempt
def loadCarrito2(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    usuario = request.POST.get('idUser')
    cursor.callproc('DAO_CARRO_COMPRAS.sql_mostrar_carro_compras', [out_cur, usuario])
    

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

def CarritoCompra(request):
    data = {
        'login': DatosClienteLogin()
    }
    return render(request, 'cliente/usuarios/check.html', data)

def HistorialCompraCliente(request):
    data = {
        'login': DatosClienteLogin()
    }
    return render(request, 'cliente/usuarios/historialCompras.html', data)

@csrf_exempt
def CargarDatosHistorialCompra(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()
    usuario = request.POST.get('IdUsuario')

    cursor.callproc('DAO_VENTA_CLIENTE.sql_mostrar_historia_venta', [out_cur, usuario])
    
    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def CargarDetalleVenta(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()
    usuario = request.POST.get('IdUsuario')
    venta = request.POST.get('idVenta')

    cursor.callproc('DAO_VENTA_CLIENTE.sql_mostrar_detalle_venta', [out_cur, usuario, venta])
    
    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

@csrf_exempt
def CargarDetalleVentaInformacion(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()
    usuario = request.POST.get('IdUsuario')
    venta = request.POST.get('idVenta')

    cursor.callproc('DAO_VENTA_CLIENTE.sql_mostrar_detalle_venta_info', [out_cur, usuario, venta])
    
    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

@csrf_exempt
def ProductoDetalleConstruccion(request, pk):

    data = {
        'producto': retornarProductosIdPrducto(pk),
        'login': DatosClienteLogin()
    }

    return render(request, "cliente/productoDetalle/productoDetalleConstruccion.html", data)



@csrf_exempt
def LogoutCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   

    name = request.POST.get("nomUser")
    cursor.callproc('dao_usuarios.sql_delete_sesion_usuario', [name])
    

    return StreamingHttpResponse('{"ok":"true","msg":"salida correcta"}') 

@csrf_exempt
def Registrarcliente(request):

    data = {
        'region': retornarRegiones(),
        'login': DatosClienteLogin()
    }    
    return render(request, 'cliente/usuarios/registrarCliente.html', data)

@csrf_exempt
def CompletarFormularioCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.var(cx_Oracle.NUMBER)

    rut = request.POST.get("txtRut")
    empresa = request.POST.get("txtEmpresa")
    nombres = request.POST.get("txtNombres")
    paterno = request.POST.get("txtApellidoPat")
    materno = request.POST.get("txtApellidoMat")
    fecha = request.POST.get("txtFecha")
    direccion = request.POST.get("txtDireccion")
    telefono = request.POST.get("txtTelefono")
    foto = ''
    comuna = request.POST.get('idComuna')
    email = request.POST.get("txtEmailUser")
    contra = request.POST.get("txtPasswordUser")

    
    salida = cursor.callfunc('dao_usuarios.sql_registrar_persona_usuario', int, [rut, empresa, nombres, paterno, materno, 
                                                            fecha, direccion, telefono, foto, comuna,
                                                            email, contra, 4])

    if salida == 2:
        return StreamingHttpResponse('{"ok":"false","msg":"ERROR! El correo ya está registrado"}')    
    if salida == -1:
        return StreamingHttpResponse('{"ok":"falso","msg":"ERROR! El rut ya está registrado"}')  

    return StreamingHttpResponse('{"ok":"true","msg":"registradooo"}')


@csrf_exempt
def LoginClientes(usuario, password, tipo):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.var(cx_Oracle.BOOLEAN)
    
    cursor.callfunc('dao_usuarios.sql_login_usuario', salida, [usuario, password, tipo])

    return salida

@csrf_exempt
def DatosClienteLogin():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    cursor.callproc('dao_usuarios.sql_perfil_usuario', [out_cur, 4])
    

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def RetornarProductosDestacados():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    cursor.callproc('DAO_PRODUCTO.sql_mostrar_productos_destacados', [out_cur])
    

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

@csrf_exempt
def DatosCarroComprasCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    usuario = request.POST.get('IdUsuario')
    cursor.callproc('DAO_CARRO_COMPRAS.sql_mostrar_carro_compras', [out_cur, usuario])
    

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def DetalleBaucherCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    usuario = request.POST.get('IdUsuario')
    cursor.callproc('DAO_CARRO_COMPRAS.sql_mostrar_baucher_preventa', [out_cur, usuario]) 

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data) 

@csrf_exempt
def eliminarProductoDelCarro(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  
    producto = request.POST.get('IdProducto')
    usuario = request.POST.get('IdUsuario')

    cursor.callproc('DAO_CARRO_COMPRAS.sql_eliminar_producto_compra', [producto, usuario])

    return StreamingHttpResponse('{"ok":"true","msg":"producto eliminado"}') 

def enviarEmailDespacho(mail, direccion):
    email = EmailMultiAlternatives(
        'Despachos FERME ferretería',
        'Usted solicitó un despacho a domicilio, si no a realizado esta acción ignore el correo'
        '\n Dirección: ' + direccion +' '
        '\n Puede revisar el detalle de su boleta en su listado de compras, antes dudas o consultas responder este correo'
        '\n Se le notificará mediante correo la fecha de envio',
        settings.EMAIL_HOST_USER,
        [mail]
    )

    #email.attach_alternative(content, 'Correo pa recuperar contra')
    email.send()


@csrf_exempt
def completarPagoCliente(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor() 

    usuario = request.POST.get('IdUsuario')
    documento = request.POST.get('documento')
    tipo = request.POST.get('tipo')
    despacho = request.POST.get('despacho')
    direccion = request.POST.get('direccion')

    if despacho == '1':
        mail = cursor.callfunc("DAO_USUARIOS.sql_retornar_mail_usuario", str, [usuario])
        enviarEmailDespacho(mail, direccion)

    cursor.callproc('DAO_VENTA_CLIENTE.sql_generar_venta_cliente', [usuario, documento, tipo, despacho, direccion])

    return StreamingHttpResponse('{"ok":"true","msg":"compra procesada correctamente"}') 
#################################################################

def retornarCategoriaConstruccion(idCat):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listar_sub_categorias", [out_cur, idCat])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def retornarProductosParametro(idCat):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listar_sub_categorias", [out_cur, idCat])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def retornarCategorias():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_SUB_CATEGORIA.sql_listar_categorias", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista


###################PARTE DE INTERFAZ DE CLIENTES

@csrf_exempt
def obtenerCategoria(sub):
    idcat = sub
    data = json.dumps(idcat)
    return StreamingHttpResponse(data) 

def retornarProductosSub(idCat):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PRODUCTO.sql_buscar_producto_idsub", [idCat, out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)
    
    return lista

@csrf_exempt
def agregarCarroCompras(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    id_usuario = request.POST.get('idUsuario')
    id_producto = request.POST.get('IdProducto')
    cantidad = request.POST.get('cantidad')

    

    salida = cursor.callfunc("DAO_CARRO_COMPRAS.sql_agregar_producto_carro", int, [id_producto, cantidad, id_usuario])
    print(salida)
    if salida == 2:
        return StreamingHttpResponse('{"ok":"false","msg":"no hay stock suficiente"}')    
    
    return StreamingHttpResponse('{"ok":"true","msg":"agregado al carro"}')   

@csrf_exempt
def LoadCarroCompras(id_user):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()
    usuario = id_user

    cursor.callproc("DAO_CARRO_COMPRAS.sql_mostrar_carro_compras", [out_cur, usuario])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista


def retornarProductosIdPrducto(idProd):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PRODUCTO.sql_buscar_detalle_producto", [idProd, out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)
    
    return lista


def retornarRegiones():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_COMUNA.sql_listar_regiones", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista






##PAL LOGIN
"""
from django.contrib.auth import logout as do_logout
from django.shortcuts import render, redirect 
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login as do_login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .forms import UserForm


#LOGIN DE USUARIOS

@csrf_exempt
def loginnUser(request):

    data = {
        'categoria': retornarCategorias()
    }

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
            print(user)
            # Si existe un usuario con ese nombre y contraseña
            if user is not None:
                # Hacemos el login manualmente
                do_login(request, user)
                # Y le redireccionamos a la portada
                return redirect('/clientes')

    return render(request, "cliente/indexCliente.html", data)

def register(request):
    # Creamos el formulario de autenticación vacío
    #form = UserCreationForm

    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('clientes')
    else:
        form = UserForm()

    return render(request, 'cliente/usuarios/frmRegistro.html', {'form': form})

@csrf_exempt
def logoutUsers(request):
    # Finalizamos la sesión
    do_logout(request)
    # Redireccionamos a la portada
    return StreamingHttpResponse('{"ok":"true","msg":"logout"}')


@csrf_exempt
def register(request): 
    password = request.POST.get('password')
    nombres = request.POST.get('txtNombreUser')
    apellidos = request.POST.get('txtApellidoUser')
    mail = request.POST.get('username')
    usuario = User.objects.create(username=mail, password = password, email=mail, last_name=apellidos, first_name=nombres)

    user = usuario.save()


    return StreamingHttpResponse('{"ok":"true","msg":"pedido agregado"}')
"""
