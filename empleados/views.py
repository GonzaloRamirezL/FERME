from django.http.response import HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import ListView, DetailView, TemplateView
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
from django.shortcuts import redirect

#LOGIN EMPLEADO
@csrf_exempt 
def loginEmpleadoIndex(request):

    if request.method == 'POST':
        usuario = request.POST.get("txtUsuario")
        contra = request.POST.get("txtPassword")
        tipo = request.POST.get('idTipo')
        validarEmp = loginEmpleadosForm(usuario, contra, tipo)

        if tipo == '2':
            if validarEmp:
                return redirect('/empleadosPrincipal')
        if tipo == '3':
            if validarEmp:
                return redirect('/proveedores')

        

    return render(request, "webEmpleado/login.html") 

@csrf_exempt 
def loginEmpleadosForm(usuario, password, tipo):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    salida = cursor.var(cx_Oracle.BOOLEAN)    
    salida = cursor.callfunc('dao_usuarios.sql_login_usuario', bool, [usuario, password, tipo])

    return salida  
@csrf_exempt
def LogoutUsuarioEmpleado(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  
    usuario = retornarUsuarioActivo() 

    name = request.POST.get("nomUser")
    cursor.callproc('dao_usuarios.sql_delete_sesion_usuario', [name])
    cursor.callproc('DAO_PREVENTA.sql_borrar_preventa_usuario', [usuario])
    

    return StreamingHttpResponse('{"ok":"true","msg":"salida correcta"}') 

@csrf_exempt
def DatosEmpleadoLogin():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   
    out_cur = django_cursor.connection.cursor()

    cursor.callproc('dao_usuarios.sql_perfil_usuario', [out_cur, 2])
    

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def validarLoginEmpleado():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()     
    salida = cursor.callfunc('dao_usuarios.sql_validar_sesion_empleados', bool)

    return salida

#RETORNOS
def retornarPago():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PAGO.sql_listar_pago", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def retornarTipoVenta():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_TIPO_VENTA.sql_listar_tipo_venta", [out_cur])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista


##EMPLEADO INDEX 
def empleado(request):

    data = {
        'login': DatosEmpleadoLogin()
    }

    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    return render(request, "webEmpleado/indexEmpleado.html", data)


##EMPLEADO VENTA 
def empleadosVenta(request):

    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    data = {
        'pago': retornarPago(),
        'venta': retornarTipoVenta(),
        'login': DatosEmpleadoLogin(),
    }
    return render(request, "webEmpleado/frmVenta.html",data)

def resumenFactura(request):
    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    return render(request, "webEmpleado/resumenFactura.html")

def resumenBoleta(request):
    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    return render(request, "webEmpleado/resumenBoleta.html")

def calendarioVendedor(request):
    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    return render(request, "webEmpleado/calendarioVendedor.html")

@csrf_exempt
def agregarPreventa(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   

    id_producto = request.POST.get("codProducto")
    cantidad = request.POST.get('cantProducto')
    descuento = request.POST.get('descuento')
    id_pago = request.POST.get('idTipoPago')
    tipo_venta = request.POST.get('idTipoVenta')
    rut = request.POST.get('rutCliente')
    id_usuario = retornarUsuarioActivo()

    salida = cursor.callfunc('DAO_PREVENTA.sql_insertar_preventa', int, [id_producto,cantidad,descuento,id_pago,tipo_venta,rut,id_usuario])

    if salida == 2:
        return StreamingHttpResponse('{"ok":"false","msg":"no hay stock suficiente"}')   

    return StreamingHttpResponse('{"ok":"true","msg":"factura agregado"}')

@csrf_exempt
def agregarVenta(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()   

    id_pago = request.POST.get('idTipoPago')
    tipo_venta = request.POST.get('idTipoVenta')
    rut = request.POST.get('rutCliente')
    id_usuario = retornarUsuarioActivo()

    cursor.callfunc('DAO_PREVENTA.sql_generar_venta_preventa',int, [id_usuario,id_pago,rut,tipo_venta])


    return StreamingHttpResponse('{"ok":"true","msg":"factura agregado"}')

@csrf_exempt
def eliminarPreventa(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  

    numero = request.POST.get('idVenta')


    cursor.callfunc('DAO_PREVENTA.sql_eliminar_preventa_id', int, [numero])

    return StreamingHttpResponse('{"ok":"true","msg":"preventa eliminada"}') 

@csrf_exempt
def listarPreventa(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PREVENTA.sql_listar_preventa", [out_cur, retornarUsuarioActivo()])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    #return StreamingHttpResponse(serializers.serialize("json", lista))
    return StreamingHttpResponse(data) 

def retornarUsuarioActivo():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    salida = cursor.callfunc("DAO_PREVENTA.sql_retornar_usuario_activo", int)

    return salida

@csrf_exempt
def retornarTotalesPreventa(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_PREVENTA.SQL_RETORNAR_TOTALES_PREVENTA", [out_cur, retornarUsuarioActivo()])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    return StreamingHttpResponse(data) 

@csrf_exempt
def cancelarPreventa(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()  
    cursor.callproc('DAO_PREVENTA.SQL_CANCELAR_PREVENTA', [retornarUsuarioActivo()])

    return StreamingHttpResponse('{"ok":"true","msg":"preventa cancelada"}') 

def proveedorPrincipal(request):

    data = {
        'login': perfilUsuarioProveedor()
    }
    print(data)
    if validarLoginProveedor() == False:
        return redirect('/empleados')   

    return render(request, "webEmpleado/proveedorindex.html", data)

def validarLoginProveedor():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()     
    salida = cursor.callfunc('dao_usuarios.sql_validar_sesion_proveedor', bool)

    return salida

def perfilUsuarioProveedor():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()
    cursor.callproc("dao_usuarios.sql_perfil_proveedor", [out_cur, retornarUsuarioProveedor()])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    return lista

def retornarUsuarioProveedor():
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()

    salida = cursor.callfunc("DAO_USUARIOS.sql_retornar_proveedor", int)

    return salida

@csrf_exempt
def listarPedidosProveedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_USUARIOS.sql_pedidos_proveedor", [out_cur, retornarUsuarioProveedor()])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista) #esto convierte el arreglo en un json
    return StreamingHttpResponse(data)


##VENTAS
def historialVentasClientesPrincipal(request):
    if(validarLoginEmpleado() == False):
        return redirect('/empleados')

    data = {
        'login': DatosEmpleadoLogin(),
    }
    return render(request, "webEmpleado/historialVentasVendedor.html", data)

@csrf_exempt
def listarVentasHistorialVendedor(request):
    django_cursor = connection.cursor()
    cursor = django_cursor.connection.cursor()
    out_cur = django_cursor.connection.cursor()

    cursor.callproc("DAO_VENTA.SQL_LISTAR_VENTA_PARAMETRO", [out_cur, retornarUsuarioActivo()])

    lista = []

    for fila in out_cur:
        lista.append(fila)

    data = json.dumps(lista)
    return StreamingHttpResponse(data)

