
//pa formatearlo
function checkRut(rut) {
	// Despejar Puntos
	var valor = rut.value.replace('.', '');
	// Despejar Guión
	valor = valor.replace('-', '');

	// Aislar Cuerpo y Dígito Verificador
	cuerpo = valor.slice(0, -1);
	dv = valor.slice(-1).toUpperCase();

	// Formatear RUN
	rut.value = cuerpo + '-' + dv

	// Si no cumple con el mínimo ej. (n.nnn.nnn)
	if (cuerpo.length < 7) { rut.setCustomValidity("RUT Incompleto"); return false; }

	// Calcular Dígito Verificador
	suma = 0;
	multiplo = 2;

	// Para cada dígito del Cuerpo
	for (i = 1; i <= cuerpo.length; i++) {

		// Obtener su Producto con el Múltiplo Correspondiente
		index = multiplo * valor.charAt(cuerpo.length - i);

		// Sumar al Contador General
		suma = suma + index;

		// Consolidar Múltiplo dentro del rango [2,7]
		if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }

	}

	// Calcular Dígito Verificador en base al Módulo 11
	dvEsperado = 11 - (suma % 11);

	// Casos Especiales (0 y K)
	dv = (dv == 'K') ? 10 : dv;
	dv = (dv == 0) ? 11 : dv;

	// Validar que el Cuerpo coincide con su Dígito Verificador
	if (dvEsperado != dv) { rut.setCustomValidity("RUT Inválido"); return false; }

	// Si todo sale bien, eliminar errores (decretar que es válido)
	rut.setCustomValidity('');

}


function validaRut(campo) {
	if (campo.length == 0) { return false; }
	if (campo.length < 8) { return false; }

	campo = campo.replace('-', '')
	campo = campo.replace(/\./g, '')

	var suma = 0;
	var caracteres = "1234567890kK";
	var contador = 0;
	for (var i = 0; i < campo.length; i++) {
		u = campo.substring(i, i + 1);
		if (caracteres.indexOf(u) != -1)
			contador++;
	}
	if (contador == 0) { return false }

	var rut = campo.substring(0, campo.length - 1)
	var drut = campo.substring(campo.length - 1)
	var dvr = '0';
	var mul = 2;

	for (i = rut.length - 1; i >= 0; i--) {
		suma = suma + rut.charAt(i) * mul
		if (mul == 7) mul = 2
		else mul++
	}
	res = suma % 11
	if (res == 1) dvr = 'k'
	else if (res == 0) dvr = '0'
	else {
		dvi = 11 - res
		dvr = dvi + ""
	}
	if (dvr != drut.toLowerCase()) { return false; }
	else { return true; }
}