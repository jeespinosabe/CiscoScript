const entradaCodigo = document.querySelector('#entradaCodigo');
const capaResaltado = document.querySelector('#capaResaltado');
const numerosRenglon = document.querySelector('#numerosRenglon');
const cuerpoTablaTokens = document.querySelector('#cuerpoTablaTokens');
const contenedorErrores = document.querySelector('#contenedorErrores');
const contenedorSugerencias = document.querySelector('#contenedorSugerencias');
const resumenAnalisis = document.querySelector('#resumenAnalisis');
const salidaArbol = document.querySelector('#salidaArbol');
const salidaReglasSemanticas = document.querySelector('#salidaReglasSemanticas');
const botonPestanaArbol = document.querySelector('#botonPestanaArbol');
const botonPestanaSemantica = document.querySelector('#botonPestanaSemantica');
const panelSalidaArbol = document.querySelector('#panelSalidaArbol');
const panelSalidaSemantica = document.querySelector('#panelSalidaSemantica');
const botonEjemplo = document.querySelector('#botonEjemplo');
const botonLimpiar = document.querySelector('#botonLimpiar');
const contenedorAutocompletado = document.querySelector('#contenedorAutocompletado');

const palabrasReservadas = {
	ROUTER: 'TK_RES_ROUTER',
	SWITCH: 'TK_RES_SWITCH',
	basica: 'TK_RES_BASICA',
	hostname: 'TK_RES_HOSTNAME',
	ssh: 'TK_RES_SSH',
	usuario: 'TK_RES_USUARIO',
	password: 'TK_RES_PASSWORD',
	dominio: 'TK_RES_DOMINIO',
	vlan: 'TK_RES_VLAN',
	nombre: 'TK_RES_NOMBRE',
	puerto: 'TK_RES_PUERTO',
	ip: 'TK_RES_IP',
	acceso: 'TK_RES_ACCESO',
	pool: 'TK_RES_POOL',
	red: 'TK_RES_RED',
	gateway: 'TK_RES_GATEWAY',
	dns: 'TK_RES_DNS',
	excluir: 'TK_RES_EXCLUIR',
	fin: 'TK_RES_FIN',
	probar: 'TK_RES_PROBAR',
	ping: 'TK_RES_PING',
	mostrar: 'TK_RES_MOSTRAR',
	redes: 'TK_RES_REDES',
	verificar: 'TK_RES_VERIFICAR'
};

const palabrasReservadasNormalizadas = Object.entries(palabrasReservadas).reduce((acumulador, [lexema, token]) => {
	acumulador[lexema.toLowerCase()] = {
		lexema,
		token
	};

	return acumulador;
}, {});

const descripcionesTokens = {
	TK_RES_ROUTER: 'Palabra reservada',
	TK_RES_SWITCH: 'Palabra reservada',
	TK_RES_BASICA: 'Palabra reservada',
	TK_RES_HOSTNAME: 'Palabra reservada',
	TK_RES_SSH: 'Palabra reservada',
	TK_RES_USUARIO: 'Palabra reservada',
	TK_RES_PASSWORD: 'Palabra reservada',
	TK_RES_DOMINIO: 'Palabra reservada',
	TK_RES_VLAN: 'Palabra reservada',
	TK_RES_NOMBRE: 'Palabra reservada',
	TK_RES_PUERTO: 'Palabra reservada',
	TK_RES_IP: 'Palabra reservada',
	TK_RES_ACCESO: 'Palabra reservada',
	TK_RES_POOL: 'Palabra reservada',
	TK_RES_RED: 'Palabra reservada',
	TK_RES_GATEWAY: 'Palabra reservada',
	TK_RES_DNS: 'Palabra reservada',
	TK_RES_EXCLUIR: 'Palabra reservada',
	TK_RES_FIN: 'Palabra reservada',
	TK_RES_PROBAR: 'Palabra reservada',
	TK_RES_PING: 'Palabra reservada',
	TK_RES_MOSTRAR: 'Palabra reservada',
	TK_RES_REDES: 'Palabra reservada',
	TK_RES_VERIFICAR: 'Palabra reservada',
	TK_ID: 'Identificador',
	TK_IFACE: 'Interfaz de red',
	TK_IP: 'Dirección IPv4',
	TK_MASK: 'Máscara CIDR',
	TK_NUM: 'Número entero',
	TK_DOMINIO: 'Dominio',
	TK_DOSP: 'Símbolo',
	TK_COMENTARIO: 'Comentario',
	TK_FNA: 'Fin de archivo',
	TK_ERROR: 'Error detectado'
};

const lexemasEsperados = {
	TK_RES_ROUTER: 'ROUTER',
	TK_RES_SWITCH: 'SWITCH',
	TK_RES_BASICA: 'basica',
	TK_RES_HOSTNAME: 'hostname',
	TK_RES_SSH: 'ssh',
	TK_RES_USUARIO: 'usuario',
	TK_RES_PASSWORD: 'password',
	TK_RES_DOMINIO: 'dominio',
	TK_RES_VLAN: 'vlan',
	TK_RES_NOMBRE: 'nombre',
	TK_RES_PUERTO: 'puerto',
	TK_RES_IP: 'ip',
	TK_RES_ACCESO: 'acceso',
	TK_RES_POOL: 'pool',
	TK_RES_RED: 'red',
	TK_RES_GATEWAY: 'gateway',
	TK_RES_DNS: 'dns',
	TK_RES_EXCLUIR: 'excluir',
	TK_RES_FIN: 'fin',
	TK_RES_PROBAR: 'probar',
	TK_RES_PING: 'ping',
	TK_RES_MOSTRAR: 'mostrar',
	TK_RES_REDES: 'redes',
	TK_RES_VERIFICAR: 'verificar',
	TK_ID: 'un identificador, por ejemplo R1',
	TK_IFACE: 'una interfaz, por ejemplo g0/0',
	TK_IP: 'una dirección IP, por ejemplo 192.168.1.1',
	TK_MASK: 'una máscara, por ejemplo /24',
	TK_NUM: 'un número entero',
	TK_DOMINIO: 'un dominio, por ejemplo cisco.com',
	TK_DOSP: ':',
	TK_FNA: 'fin de archivo'
};

const sugerenciasBase = [
	{ texto: 'ROUTER', detalle: 'bloque router' },
	{ texto: 'SWITCH', detalle: 'bloque switch' },
	{ texto: 'basica', detalle: 'configuración' },
	{ texto: 'hostname', detalle: 'configuración' },
	{ texto: 'ssh', detalle: 'configuración' },
	{ texto: 'usuario', detalle: 'ssh' },
	{ texto: 'password', detalle: 'ssh' },
	{ texto: 'dominio', detalle: 'ssh' },
	{ texto: 'vlan', detalle: 'switch' },
	{ texto: 'nombre', detalle: 'vlan' },
	{ texto: 'puerto', detalle: 'interfaz' },
	{ texto: 'ip', detalle: 'dirección' },
	{ texto: 'acceso', detalle: 'switch' },
	{ texto: 'pool', detalle: 'dhcp' },
	{ texto: 'red', detalle: 'dhcp' },
	{ texto: 'gateway', detalle: 'dhcp' },
	{ texto: 'dns', detalle: 'dhcp' },
	{ texto: 'excluir', detalle: 'dhcp' },
	{ texto: 'fin', detalle: 'cerrar bloque' },
	{ texto: 'probar', detalle: 'sentencia' },
	{ texto: 'ping', detalle: 'prueba' },
	{ texto: 'mostrar', detalle: 'sentencia' },
	{ texto: 'redes', detalle: 'salida' },
	{ texto: 'verificar', detalle: 'sentencia' },
	{ texto: 'g0/0', detalle: 'interfaz' },
	{ texto: 'g0/1', detalle: 'interfaz' },
	{ texto: 'fa0/1', detalle: 'interfaz' },
	{ texto: 's0/0/0', detalle: 'interfaz' },
	{ texto: '192.168.1.1', detalle: 'ip ejemplo' },
	{ texto: '192.168.1.0', detalle: 'red ejemplo' },
	{ texto: '8.8.8.8', detalle: 'dns ejemplo' },
	{ texto: '/24', detalle: 'máscara' },
	{ texto: '/30', detalle: 'máscara' },
	{ texto: '10', detalle: 'número' },
	{ texto: 'R1', detalle: 'identificador' },
	{ texto: 'S1', detalle: 'identificador' },
	{ texto: 'PC1', detalle: 'identificador' },
	{ texto: 'PC2', detalle: 'identificador' },
	{ texto: 'admin', detalle: 'identificador' },
	{ texto: 'cisco123', detalle: 'identificador' },
	{ texto: 'redlocal', detalle: 'identificador' },
	{ texto: 'cisco.com', detalle: 'dominio ejemplo' },
	{ texto: 'Ventas', detalle: 'identificador' },
	{ texto: ':', detalle: 'símbolo' }
];

//estas son las expresiones regulares
//REG TK_IFACE
const expresionInterfaz = /^((fa|Fa|g|Gi|s|Se)\d+\/\d+(\/\d+)?(\.\d+)?|(fa|Fa|g|Gi)\d+\/\d+-\d+)$/;
//REG TK_IP
const expresionIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
//REG TK_DOMINIO
const expresionDominio = /^[a-zA-Z0-9]([a-zA-Z0-9_-]*\.)+[a-zA-Z]{2,}$/;
//REG TK_MASK
const expresionMascara = /^\/([0-9]|[1-2][0-9]|3[0-2])$/;
//REG TK_NUM
const expresionNumero = /^[0-9]+$/;
//REG TK_ID
const expresionIdentificador = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
//REG TK_ERROR
const expresionCaracterValido = /[a-zA-Z0-9 \t\r\n.\/:,_-]/;

const codigoEjemplo = `ROUTER R1:
	basica
	hostname R1
	ssh usuario admin password cisco123 dominio cisco.com
	puerto g0/0 ip 192.168.1.1 /24
	excluir 192.168.1.1 192.168.1.10
	pool LAN1 red 192.168.1.0 /24 gateway 192.168.1.1 dns 8.8.8.8
fin

SWITCH S1:
	basica
	hostname S1
	ssh usuario admin password cisco123 dominio cisco.com
	vlan 1 nombre ADMIN
	vlan 10 nombre VENTAS
	administracion vlan 1 ip 192.168.1.2 /24 gateway 192.168.1.1
	puerto fa0/1-5, g0/2 acceso 10
fin

probar ping R1 S1
mostrar redes
verificar`;

let estadoAutocompletado = {
	visible: false,
	sugerencias: [],
	indiceSeleccionado: 0,
	inicioPalabra: 0,
	finPalabra: 0
};

botonEjemplo.addEventListener('click', () => {
	entradaCodigo.value = codigoEjemplo;
	analizarCodigo();
	entradaCodigo.focus();
});

botonLimpiar.addEventListener('click', () => {
	entradaCodigo.value = '';
	analizarCodigo();
	ocultarAutocompletado();
	entradaCodigo.focus();
});

entradaCodigo.addEventListener('input', analizarCodigo);

entradaCodigo.addEventListener('scroll', () => {
	sincronizarDesplazamiento();
	actualizarAutocompletado();
});

entradaCodigo.addEventListener('keydown', manejarTecladoEditor);
entradaCodigo.addEventListener('click', actualizarAutocompletado);

entradaCodigo.addEventListener('keyup', (evento) => {
	if (estadoAutocompletado.visible && ['ArrowUp', 'ArrowDown'].includes(evento.key)) {
		return;
	}

	if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) {
		actualizarAutocompletado();
	}
});

contenedorAutocompletado.addEventListener('mousedown', (evento) => {
	evento.preventDefault();

	const opcion = evento.target.closest('.opcion-autocompletado');

	if (!opcion) {
		return;
	}

	const indice = Number(opcion.dataset.indice);
	aceptarAutocompletado(indice);
});

document.addEventListener('click', (evento) => {
	if (
		evento.target !== entradaCodigo &&
		!contenedorAutocompletado.contains(evento.target)
	) {
		ocultarAutocompletado();
	}
});

if (botonPestanaArbol && botonPestanaSemantica) {
	botonPestanaArbol.addEventListener('click', () => cambiarPestanaSalida('arbol'));
	botonPestanaSemantica.addEventListener('click', () => cambiarPestanaSalida('semantica'));
}

function cambiarPestanaSalida(pestanaActiva) {
	const mostrarArbol = pestanaActiva === 'arbol';

	if (botonPestanaArbol) {
		botonPestanaArbol.classList.toggle('activo', mostrarArbol);
		botonPestanaArbol.setAttribute('aria-selected', String(mostrarArbol));
	}

	if (botonPestanaSemantica) {
		botonPestanaSemantica.classList.toggle('activo', !mostrarArbol);
		botonPestanaSemantica.setAttribute('aria-selected', String(!mostrarArbol));
	}

	if (panelSalidaArbol) {
		panelSalidaArbol.classList.toggle('oculto', !mostrarArbol);
	}

	if (panelSalidaSemantica) {
		panelSalidaSemantica.classList.toggle('oculto', mostrarArbol);
	}
}

function manejarTecladoEditor(evento) {
	if (estadoAutocompletado.visible) {
		if (evento.key === 'Tab') {
			evento.preventDefault();
			aceptarAutocompletado(estadoAutocompletado.indiceSeleccionado);
			return;
		}

		if (evento.key === 'ArrowDown') {
			evento.preventDefault();
			moverSeleccionAutocompletado(1);
			return;
		}

		if (evento.key === 'ArrowUp') {
			evento.preventDefault();
			moverSeleccionAutocompletado(-1);
			return;
		}

		if (evento.key === 'Escape') {
			evento.preventDefault();
			ocultarAutocompletado();
			return;
		}
	}

	if (evento.key === 'Tab') {
		manejarTabulador(evento);
	}
}

function manejarTabulador(evento) {
	evento.preventDefault();

	const inicio = entradaCodigo.selectionStart;
	const fin = entradaCodigo.selectionEnd;
	const texto = entradaCodigo.value;

	entradaCodigo.value = texto.substring(0, inicio) + '\t' + texto.substring(fin);
	entradaCodigo.selectionStart = entradaCodigo.selectionEnd = inicio + 1;

	analizarCodigo();
}

function sincronizarDesplazamiento() {
	capaResaltado.scrollTop = entradaCodigo.scrollTop;
	capaResaltado.scrollLeft = entradaCodigo.scrollLeft;
	numerosRenglon.scrollTop = entradaCodigo.scrollTop;
}

//AFD 1 General
function analizarLexico(texto) {
	const tokens = [];
	const errores = [];

	let indice = 0;
	let renglon = 1;
	let columna = 1;

	while (indice < texto.length) {
		const caracter = texto[indice];

		if (caracter === '\n') {
			indice++;
			renglon++;
			columna = 1;
			continue;
		}

		if (caracter === ' ' || caracter === '\t' || caracter === '\r') {
			indice++;
			columna++;
			continue;
		}

		//AFD 6 Comentario de una línea
		if (caracter === '/' && texto[indice + 1] === '/') {
			const inicio = indice;
			const columnaInicio = columna;
			let lexema = '';

			while (indice < texto.length && texto[indice] !== '\n') {
				lexema += texto[indice];
				indice++;
				columna++;
			}

			tokens.push(crearToken('TK_COMENTARIO', lexema, renglon, columnaInicio, inicio, indice));
			continue;
		}

		//AFD 7 Comentario de varias líneas
		if (caracter === '/' && texto[indice + 1] === '*') {
			const inicio = indice;
			const renglonInicio = renglon;
			const columnaInicio = columna;
			let lexema = '/*';

			indice += 2;
			columna += 2;

			while (
				indice < texto.length &&
				!(texto[indice] === '*' && texto[indice + 1] === '/')
			) {
				lexema += texto[indice];

				if (texto[indice] === '\n') {
					renglon++;
					columna = 1;
				} else {
					columna++;
				}

				indice++;
			}

			if (indice < texto.length) {
				lexema += '*/';
				indice += 2;
				columna += 2;
			}

			tokens.push(crearToken('TK_COMENTARIO', lexema, renglonInicio, columnaInicio, inicio, indice));
			continue;
		}

		if (!expresionCaracterValido.test(caracter)) {
			const tokenError = crearToken('TK_ERROR', caracter, renglon, columna, indice, indice + 1);
			tokens.push(tokenError);

			errores.push(crearError({
				tipo: 'Léxico',
				token: tokenError,
				esperado: 'carácter válido del lenguaje',
				descripcion: `El carácter "${caracter}" no pertenece al alfabeto válido de CiscoScript.`,
				sugerencia: 'Elimina ese carácter o reemplázalo por letras, números, punto, slash, dos puntos, guion o guion bajo.'
			}));

			indice++;
			columna++;
			continue;
		}

		if (caracter === ':') {
			tokens.push(crearToken('TK_DOSP', caracter, renglon, columna, indice, indice + 1));
			indice++;
			columna++;
			continue;
		}

		//AFD 5 Máscara CIDR
		if (caracter === '/') {
			const inicio = indice;
			const columnaInicio = columna;
			let lexema = '/';

			indice++;
			columna++;

			while (indice < texto.length && /[0-9]/.test(texto[indice])) {
				lexema += texto[indice];
				indice++;
				columna++;
			}

			if (expresionMascara.test(lexema)) {
				tokens.push(crearToken('TK_MASK', lexema, renglon, columnaInicio, inicio, indice));
			} else {
				const tokenError = crearToken('TK_ERROR', lexema, renglon, columnaInicio, inicio, indice);
				tokens.push(tokenError);

				errores.push(crearError({
					tipo: 'Léxico',
					token: tokenError,
					esperado: 'TK_MASK',
					descripcion: `La máscara "${lexema}" no cumple con el formato CIDR válido.`,
					sugerencia: 'Escribe una máscara entre /0 y /32, por ejemplo /24.'
				}));
			}

			continue;
		}

		//AFD 2 Identificador y Palabra Reservada
		if (/[a-zA-Z]/.test(caracter)) {
			const inicio = indice;
			const columnaInicio = columna;
			let lexema = '';

			while (indice < texto.length && /[a-zA-Z0-9_\/.-]/.test(texto[indice])) {
				lexema += texto[indice];
				indice++;
				columna++;
			}

			const tipo = clasificarLexemaTexto(lexema);

			if (tipo === 'TK_ERROR') {
				const tokenError = crearToken('TK_ERROR', lexema, renglon, columnaInicio, inicio, indice);
				const detalleError = crearDetalleErrorLexico(lexema);
				tokens.push(tokenError);

				errores.push(crearError({
					tipo: 'Léxico',
					token: tokenError,
					esperado: detalleError.esperado,
					descripcion: detalleError.descripcion,
					sugerencia: detalleError.sugerencia
				}));
			} else {
				tokens.push(crearToken(tipo, lexema, renglon, columnaInicio, inicio, indice));
			}

			continue;
		}

		//AFD 3 Dirección IPv4 y Número
		if (/[0-9]/.test(caracter)) {
			const inicio = indice;
			const columnaInicio = columna;
			let lexema = '';

			while (indice < texto.length && /[0-9.]/.test(texto[indice])) {
				lexema += texto[indice];
				indice++;
				columna++;
			}

			if (expresionIp.test(lexema)) {
				if (esIpValida(lexema)) {
					tokens.push(crearToken('TK_IP', lexema, renglon, columnaInicio, inicio, indice));
				} else {
					const tokenError = crearToken('TK_ERROR', lexema, renglon, columnaInicio, inicio, indice);
					tokens.push(tokenError);

					errores.push(crearError({
						tipo: 'Léxico',
						token: tokenError,
						esperado: 'TK_IP',
						descripcion: `La dirección IP "${lexema}" tiene el formato de una IP, pero uno o más octetos están fuera del rango permitido.`,
						sugerencia: 'Escribe una IP con cuatro octetos entre 0 y 255, por ejemplo 192.168.1.1.'
					}));
				}
			} else if (expresionNumero.test(lexema)) {
				tokens.push(crearToken('TK_NUM', lexema, renglon, columnaInicio, inicio, indice));
			} else {
				const tokenError = crearToken('TK_ERROR', lexema, renglon, columnaInicio, inicio, indice);
				tokens.push(tokenError);

				errores.push(crearError({
					tipo: 'Léxico',
					token: tokenError,
					esperado: 'TK_IP o TK_NUM',
					descripcion: `El lexema numérico "${lexema}" no tiene formato válido.`,
					sugerencia: 'Para IP usa cuatro octetos, por ejemplo 192.168.1.1. Para número usa solo dígitos.'
				}));
			}

			continue;
		}

		const tokenError = crearToken('TK_ERROR', caracter, renglon, columna, indice, indice + 1);
		tokens.push(tokenError);

		errores.push(crearError({
			tipo: 'Léxico',
			token: tokenError,
			esperado: 'token válido',
			descripcion: `No se pudo clasificar el carácter "${caracter}".`,
			sugerencia: 'Revisa la escritura del lexema.'
		}));

		indice++;
		columna++;
	}

	const tokenFin = crearToken('TK_FNA', '—', renglon, columna, texto.length, texto.length);
	tokens.push(tokenFin);

	return {
		tokens,
		tokensValidos: tokens.filter(token => token.tipo !== 'TK_ERROR' && token.tipo !== 'TK_COMENTARIO'),
		errores
	};
}

function esIpValida(lexema) {
	if (!expresionIp.test(lexema)) {
		return false;
	}

	const octetos = lexema.split('.').map(Number);

	return octetos.every(octeto => octeto >= 0 && octeto <= 255);
}

//AFD 4 Interfaz de Red
function clasificarLexemaTexto(lexema) {
	const reservadaExacta = obtenerReservadaExacta(lexema);

	if (reservadaExacta) {
		return reservadaExacta.token;
	}

	if (expresionDominio.test(lexema)) {
		return 'TK_DOMINIO';
	}

	if (obtenerReservadaPegada(lexema)) {
		return 'TK_ERROR';
	}

	if (obtenerReservadaParecida(lexema)) {
		return 'TK_ERROR';
	}

	if (expresionInterfaz.test(lexema)) {
		return 'TK_IFACE';
	}

	if (expresionIdentificador.test(lexema)) {
		return 'TK_ID';
	}

	return 'TK_ERROR';
}

function obtenerReservadaExacta(lexema) {
	const lexemaMinusculas = lexema.toLowerCase();

	if (Object.prototype.hasOwnProperty.call(palabrasReservadasNormalizadas, lexemaMinusculas)) {
		return palabrasReservadasNormalizadas[lexemaMinusculas];
	}

	return null;
}

function obtenerReservadaPegada(lexema) {
	const reservadas = Object.keys(palabrasReservadas)
		.sort((a, b) => b.length - a.length);

	const lexemaMinusculas = lexema.toLowerCase();

	for (const reservada of reservadas) {
		const reservadaMinusculas = reservada.toLowerCase();

		if (!lexemaMinusculas.startsWith(reservadaMinusculas) || lexema.length <= reservada.length) {
			continue;
		}

		const resto = lexema.slice(reservada.length);
		const restoMinusculas = resto.toLowerCase();
		const siguienteCaracter = resto[0];

		if (reservada === 'ROUTER' || reservada === 'SWITCH') {
			return reservada;
		}

		if (/[A-Z0-9]/.test(siguienteCaracter)) {
			return reservada;
		}

		if (
			expresionInterfaz.test(resto) ||
			esIpValida(resto) ||
			expresionMascara.test(resto) ||
			expresionNumero.test(resto)
		) {
			return reservada;
		}

		if (Object.prototype.hasOwnProperty.call(palabrasReservadasNormalizadas, restoMinusculas)) {
			return reservada;
		}
	}

	return null;
}

function obtenerReservadaParecida(lexema) {
	const reservadas = Object.keys(palabrasReservadas);
	const lexemaMinusculas = lexema.toLowerCase();

	let mejorReservada = null;
	let menorDistancia = Infinity;

	for (const reservada of reservadas) {
		const distancia = calcularDistancia(lexemaMinusculas, reservada.toLowerCase());

		if (distancia < menorDistancia) {
			menorDistancia = distancia;
			mejorReservada = reservada;
		}
	}

	const limite = lexema.length <= 4 ? 1 : 2;

	if (menorDistancia <= limite) {
		return mejorReservada;
	}

	return null;
}

function crearDetalleErrorLexico(lexema) {
	const reservadaPegada = obtenerReservadaPegada(lexema);
	const reservadaParecida = obtenerReservadaParecida(lexema);

	if (reservadaPegada) {
		return {
			esperado: palabrasReservadas[reservadaPegada],
			descripcion: `El lexema "${lexema}" parece tener la palabra reservada "${reservadaPegada}" pegada a otro valor.`,
			sugerencia: `Separa la palabra reservada del resto del texto. Por ejemplo: "${reservadaPegada} ${lexema.slice(reservadaPegada.length)}".`
		};
	}

	if (reservadaParecida) {
		return {
			esperado: palabrasReservadas[reservadaParecida],
			descripcion: `El lexema "${lexema}" se parece a la palabra reservada "${reservadaParecida}", pero no está escrito igual.`,
			sugerencia: `Tal vez quisiste escribir "${reservadaParecida}". Las palabras reservadas se aceptan en mayúsculas, minúsculas o combinadas.`
		};
	}

	return {
		esperado: 'palabra reservada, identificador o interfaz válida',
		descripcion: `El lexema "${lexema}" no coincide con ningún token válido.`,
		sugerencia: sugerirLexema(lexema)
	};
}

function crearToken(tipo, lexema, renglon, columna, inicioGlobal, finGlobal) {
	return {
		tipo,
		lexema,
		renglon,
		columna,
		inicioGlobal,
		finGlobal
	};
}

function crearError(datos) {
	const token = datos.token || {
		lexema: '—',
		tipo: 'TK_FNA',
		renglon: 1,
		columna: 1,
		inicioGlobal: 0,
		finGlobal: 0
	};

	return {
		tipo: datos.tipo,
		renglon: token.renglon,
		columna: token.columna,
		lexema: token.lexema,
		tokenEncontrado: token.tipo,
		tokenEsperado: datos.esperado,
		descripcion: datos.descripcion,
		sugerencia: datos.sugerencia,
		inicioGlobal: token.inicioGlobal,
		finGlobal: token.finGlobal
	};
}

function crearTokensParaTabla(tokens, errores) {
	const tokensTabla = tokens.map(token => ({ ...token }));

	for (const error of errores) {
		if (error.tipo === 'Léxico') {
			continue;
		}

		tokensTabla.push({
			tipo: 'TK_ERROR',
			lexema: error.lexema,
			renglon: error.renglon,
			columna: error.columna,
			inicioGlobal: error.inicioGlobal,
			finGlobal: error.finGlobal,
			descripcionPersonalizada: `Error ${error.tipo}`,
			esTokenErrorDerivado: true
		});
	}

	tokensTabla.sort((a, b) => {
		const inicioA = Number.isInteger(a.inicioGlobal) ? a.inicioGlobal : 0;
		const inicioB = Number.isInteger(b.inicioGlobal) ? b.inicioGlobal : 0;

		if (inicioA !== inicioB) {
			return inicioA - inicioB;
		}

		if (a.tipo === 'TK_FNA' && b.tipo !== 'TK_FNA') {
			return 1;
		}

		if (a.tipo !== 'TK_FNA' && b.tipo === 'TK_FNA') {
			return -1;
		}

		if (a.esTokenErrorDerivado && !b.esTokenErrorDerivado) {
			return 1;
		}

		if (!a.esTokenErrorDerivado && b.esTokenErrorDerivado) {
			return -1;
		}

		return 0;
	});

	return tokensTabla;
}

//Aquí es el sintactico
//AFD Sintáctico Programa
function analizarSintactico(tokens) {
	const analizador = new AnalizadorSintactico(tokens);
	return analizador.analizar();
}

class AnalizadorSintactico {
	constructor(tokens) {
		this.tokens = tokens;
		this.posicion = 0;
		this.errores = [];
		this.ultimoTokenConsumido = null;
	}

	analizar() {
		const arbol = this.analizarPrograma();

		return {
			arbol,
			errores: this.errores
		};
	}

	tokenActual() {
		return this.tokens[this.posicion] || this.tokens[this.tokens.length - 1];
	}

	avanzar() {
		const token = this.tokenActual();
		this.ultimoTokenConsumido = token;

		if (this.posicion < this.tokens.length - 1) {
			this.posicion++;
		}

		return token;
	}

	coincide(tipo) {
		return this.tokenActual().tipo === tipo;
	}

	consumir(tipoEsperado, descripcion) {
		const token = this.tokenActual();

		if (token.tipo === tipoEsperado) {
			this.avanzar();
			return token;
		}

		this.registrarError({
			token,
			esperado: tipoEsperado,
			descripcion,
			sugerencia: crearSugerenciaSintactica(tipoEsperado)
		});

		return null;
	}

	registrarError(datos) {
		this.errores.push(crearError({
			tipo: 'Sintáctico',
			token: datos.token,
			esperado: datos.esperado,
			descripcion: datos.descripcion,
			sugerencia: datos.sugerencia
		}));
	}

	//AFD Sintáctico Programa
	analizarPrograma() {
		const nodo = crearNodo('Programa');
		nodo.hijos = this.analizarListaSentencias();

		this.consumir('TK_FNA', 'Se esperaba el fin de archivo al terminar el programa.');

		return nodo;
	}

	//AFD Sintáctico Lista_sentencias
	analizarListaSentencias() {
		const sentencias = [];

		while (!this.coincide('TK_FNA')) {
			if (this.esInicioSentencia(this.tokenActual().tipo)) {
				const sentencia = this.analizarSentencia();

				if (sentencia) {
					sentencias.push(sentencia);
				}
			} else {
				const token = this.tokenActual();

				this.registrarError({
					token,
					esperado: 'inicio de sentencia',
					descripcion: 'Se esperaba una sentencia válida: ROUTER, SWITCH, probar, mostrar o verificar.',
					sugerencia: 'Inicia con ROUTER, SWITCH, probar ping, mostrar redes o verificar.'
				});

				this.recuperarHastaInicioSentencia();
			}
		}

		return sentencias;
	}

	//AFD Sintáctico Sentencia
	analizarSentencia() {
		const tipo = this.tokenActual().tipo;

		if (tipo === 'TK_RES_ROUTER') {
			return this.analizarBloqueRouter();
		}

		if (tipo === 'TK_RES_SWITCH') {
			return this.analizarBloqueSwitch();
		}

		if (tipo === 'TK_RES_PROBAR') {
			return this.analizarSentenciaProbarPing();
		}

		if (tipo === 'TK_RES_MOSTRAR') {
			return this.analizarSentenciaMostrarRedes();
		}

		if (tipo === 'TK_RES_VERIFICAR') {
			return this.analizarSentenciaVerificar();
		}

		this.registrarError({
			token: this.tokenActual(),
			esperado: 'sentencia válida',
			descripcion: 'La sentencia actual no pertenece a la gramática de CiscoScript.',
			sugerencia: 'Revisa si la sentencia debe iniciar con ROUTER, SWITCH, probar, mostrar o verificar.'
		});

		this.avanzar();
		return null;
	}

	//AFD Sintáctico Bloque_router
	analizarBloqueRouter() {
		const nodo = crearNodo('BloqueRouter');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'bloque ROUTER',
			patron: [
				{ tipo: 'TK_RES_ROUTER' },
				{ tipo: 'TK_ID', nombre: 'nombre' },
				{ tipo: 'TK_DOSP' }
			],
			tiposDetencion: this.obtenerTiposDetencionEncabezado(),
			descripcionBase: 'El encabezado de ROUTER debe llevar la palabra ROUTER, un identificador y dos puntos.',
			sugerenciaBase: 'Usa el formato: ROUTER R1:'
		});

		if (resultado.nombre) {
			nodo.atributos.nombre = resultado.nombre.lexema;
			nodo.tokenReferencia = resultado.nombre;
		} else {
			nodo.atributos.nombre = 'sin_nombre';
		}

		nodo.hijos = this.analizarListaInstruccionesRouter();

		this.consumir('TK_RES_FIN', `El bloque ROUTER "${nodo.atributos.nombre}" no fue cerrado. Agrega "fin" al final del bloque.`);

		return nodo;
	}

	//AFD Sintáctico Lista_instrucciones_router
	analizarListaInstruccionesRouter() {
		const instrucciones = [];
		const instruccionesRegistradas = new Map();

		while (!this.coincide('TK_RES_FIN') && !this.coincide('TK_FNA')) {
			if (this.esInicioInstruccionRouter(this.tokenActual().tipo)) {
				const tokenInicio = this.tokenActual();
				const instruccion = this.analizarInstruccionRouter();

				if (instruccion) {
					this.validarInstruccionRepetida(
						instruccion,
						tokenInicio,
						instruccionesRegistradas,
						'ROUTER'
					);

					instrucciones.push(instruccion);
				}
			} else {
				const token = this.tokenActual();

				this.registrarError({
					token,
					esperado: 'instrucción válida dentro de ROUTER',
					descripcion: this.obtenerDescripcionInstruccionFueraDeBloque(token.tipo, 'ROUTER'),
					sugerencia: 'Dentro de ROUTER usa basica, hostname, ssh, puerto con ip, pool o excluir.'
				});

				this.recuperarDentroDeBloque();
			}
		}

		return instrucciones;
	}

	//AFD Sintáctico Instruccion_router
	analizarInstruccionRouter() {
		const tipo = this.tokenActual().tipo;

		if (tipo === 'TK_RES_BASICA') {
			return this.analizarConfiguracionBasica();
		}

		if (tipo === 'TK_RES_HOSTNAME') {
			return this.analizarConfiguracionHostname();
		}

		if (tipo === 'TK_RES_SSH') {
			return this.analizarConfiguracionSsh();
		}

		if (tipo === 'TK_RES_PUERTO') {
			return this.analizarConfiguracionPuertoRouter();
		}

		if (tipo === 'TK_RES_POOL') {
			return this.analizarConfiguracionPoolDhcp();
		}

		if (tipo === 'TK_RES_EXCLUIR') {
			return this.analizarConfiguracionExcluirIp();
		}

		this.avanzar();
		return null;
	}

	//AFD Sintáctico Bloque_switch
	analizarBloqueSwitch() {
		const nodo = crearNodo('BloqueSwitch');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'bloque SWITCH',
			patron: [
				{ tipo: 'TK_RES_SWITCH' },
				{ tipo: 'TK_ID', nombre: 'nombre' },
				{ tipo: 'TK_DOSP' }
			],
			tiposDetencion: this.obtenerTiposDetencionEncabezado(),
			descripcionBase: 'El encabezado de SWITCH debe llevar la palabra SWITCH, un identificador y dos puntos.',
			sugerenciaBase: 'Usa el formato: SWITCH S1:'
		});

		if (resultado.nombre) {
			nodo.atributos.nombre = resultado.nombre.lexema;
			nodo.tokenReferencia = resultado.nombre;
		} else {
			nodo.atributos.nombre = 'sin_nombre';
		}

		nodo.hijos = this.analizarListaInstruccionesSwitch();

		this.consumir('TK_RES_FIN', `El bloque SWITCH "${nodo.atributos.nombre}" no fue cerrado. Agrega "fin" al final del bloque.`);

		return nodo;
	}

	//AFD Sintáctico Lista_instrucciones_switch
	analizarListaInstruccionesSwitch() {
		const instrucciones = [];
		const instruccionesRegistradas = new Map();

		while (!this.coincide('TK_RES_FIN') && !this.coincide('TK_FNA')) {
			if (this.esInicioInstruccionSwitch(this.tokenActual().tipo)) {
				const tokenInicio = this.tokenActual();
				const instruccion = this.analizarInstruccionSwitch();

				if (instruccion) {
					this.validarInstruccionRepetida(
						instruccion,
						tokenInicio,
						instruccionesRegistradas,
						'SWITCH'
					);

					instrucciones.push(instruccion);
				}
			} else {
				const token = this.tokenActual();

				this.registrarError({
					token,
					esperado: 'instrucción válida dentro de SWITCH',
					descripcion: this.obtenerDescripcionInstruccionFueraDeBloque(token.tipo, 'SWITCH'),
					sugerencia: 'Dentro de SWITCH usa basica, hostname, ssh, vlan o puerto con acceso.'
				});

				this.recuperarDentroDeBloque();
			}
		}

		return instrucciones;
	}

	//AFD Sintáctico Instruccion_switch
	analizarInstruccionSwitch() {
		const tipo = this.tokenActual().tipo;

		if (tipo === 'TK_RES_BASICA') {
			return this.analizarConfiguracionBasica();
		}

		if (tipo === 'TK_RES_HOSTNAME') {
			return this.analizarConfiguracionHostname();
		}

		if (tipo === 'TK_RES_SSH') {
			return this.analizarConfiguracionSsh();
		}

		if (tipo === 'TK_RES_VLAN') {
			return this.analizarConfiguracionVlan();
		}

		if (tipo === 'TK_RES_PUERTO') {
			return this.analizarConfiguracionPuertoSwitch();
		}

		this.avanzar();
		return null;
	}

	validarInstruccionRepetida(instruccion, tokenInicio, instruccionesRegistradas, bloqueActual) {
		const datosDuplicacion = this.obtenerDatosDuplicacionInstruccion(instruccion, bloqueActual);

		if (!datosDuplicacion) {
			return;
		}

		if (!datosDuplicacion.clave) {
			return;
		}

		if (instruccionesRegistradas.has(datosDuplicacion.clave)) {
			this.registrarError({
				token: tokenInicio,
				esperado: `instrucción ${datosDuplicacion.nombre} no repetida`,
				descripcion: `La instrucción "${datosDuplicacion.nombre}" está repetida dentro del bloque ${bloqueActual}.`,
				sugerencia: datosDuplicacion.sugerencia
			});

			return;
		}

		instruccionesRegistradas.set(datosDuplicacion.clave, tokenInicio);
	}

	obtenerDatosDuplicacionInstruccion(instruccion, bloqueActual) {
		if (instruccion.tipo === 'ConfiguracionBasica') {
			return {
				clave: 'ConfiguracionBasica',
				nombre: 'basica',
				sugerencia: 'Deja solamente una instrucción basica dentro de cada bloque.'
			};
		}

		if (instruccion.tipo === 'ConfiguracionHostname') {
			return {
				clave: 'ConfiguracionHostname',
				nombre: 'hostname',
				sugerencia: 'Deja solamente un hostname dentro de cada bloque.'
			};
		}

		if (instruccion.tipo === 'ConfiguracionSsh') {
			return {
				clave: 'ConfiguracionSsh',
				nombre: 'ssh',
				sugerencia: 'Deja solamente una configuración ssh dentro de cada bloque.'
			};
		}

		if (instruccion.tipo === 'ConfiguracionPuertoRouter') {
			return this.obtenerDatosDuplicacionPuertoRouter(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionPuertoSwitch') {
			return this.obtenerDatosDuplicacionPuertoSwitch(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionPoolDhcp') {
			return this.obtenerDatosDuplicacionPool(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionVlan') {
			return this.obtenerDatosDuplicacionVlan(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionExcluirIp') {
			return this.obtenerDatosDuplicacionExcluir(instruccion);
		}

		return null;
	}

	obtenerDatosDuplicacionPuertoRouter(instruccion) {
		if (!instruccion.atributos.interfaz || instruccion.atributos.interfaz === 'sin_interfaz') {
			return null;
		}

		return {
			clave: `ConfiguracionPuertoRouter:${instruccion.atributos.interfaz.toLowerCase()}`,
			nombre: `puerto ${instruccion.atributos.interfaz}`,
			sugerencia: `El puerto ${instruccion.atributos.interfaz} ya fue configurado en este ROUTER. Usa otra interfaz o elimina la configuración repetida.`
		};
	}

	obtenerDatosDuplicacionPuertoSwitch(instruccion) {
		if (!instruccion.atributos.interfaz || instruccion.atributos.interfaz === 'sin_interfaz') {
			return null;
		}

		return {
			clave: `ConfiguracionPuertoSwitch:${instruccion.atributos.interfaz.toLowerCase()}`,
			nombre: `puerto ${instruccion.atributos.interfaz}`,
			sugerencia: `El puerto ${instruccion.atributos.interfaz} ya fue configurado en este SWITCH. Usa otra interfaz o elimina la configuración repetida.`
		};
	}

	obtenerDatosDuplicacionPool(instruccion) {
		if (!instruccion.atributos.nombre || instruccion.atributos.nombre === 'sin_nombre') {
			return null;
		}

		return {
			clave: `ConfiguracionPoolDhcp:${instruccion.atributos.nombre.toLowerCase()}`,
			nombre: `pool ${instruccion.atributos.nombre}`,
			sugerencia: `El pool ${instruccion.atributos.nombre} ya existe en este ROUTER. Usa otro nombre o elimina el pool repetido.`
		};
	}

	obtenerDatosDuplicacionVlan(instruccion) {
		if (!instruccion.atributos.numero || instruccion.atributos.numero === 'sin_numero') {
			return null;
		}

		return {
			clave: `ConfiguracionVlan:${instruccion.atributos.numero}`,
			nombre: `vlan ${instruccion.atributos.numero}`,
			sugerencia: `La VLAN ${instruccion.atributos.numero} ya fue declarada en este SWITCH. Usa otro número o elimina la VLAN repetida.`
		};
	}

	obtenerDatosDuplicacionExcluir(instruccion) {
		if (
			!instruccion.atributos.ipInicial ||
			!instruccion.atributos.ipFinal ||
			instruccion.atributos.ipInicial === 'sin_ip_inicial' ||
			instruccion.atributos.ipFinal === 'sin_ip_final'
		) {
			return null;
		}

		return {
			clave: `ConfiguracionExcluirIp:${instruccion.atributos.ipInicial}-${instruccion.atributos.ipFinal}`,
			nombre: `excluir ${instruccion.atributos.ipInicial} ${instruccion.atributos.ipFinal}`,
			sugerencia: 'Ese mismo rango de exclusión ya fue declarado en este ROUTER.'
		};
	}

	//AFD Sintáctico Configuracion_basica
	analizarConfiguracionBasica() {
		this.validarPatronFlexible({
			nombreEstructura: 'basica',
			patron: [
				{ tipo: 'TK_RES_BASICA' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción basica no recibe parámetros adicionales.',
			sugerenciaBase: 'La instrucción correcta es solamente: basica.'
		});

		return crearNodo('ConfiguracionBasica');
	}

	//AFD Sintáctico Configuracion_hostname
	analizarConfiguracionHostname() {
		const nodo = crearNodo('ConfiguracionHostname');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'hostname',
			patron: [
				{ tipo: 'TK_RES_HOSTNAME' },
				{ tipo: 'TK_ID', nombre: 'nombre' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción hostname solo acepta un identificador como nombre del dispositivo.',
			sugerenciaBase: 'Usa el formato: hostname R1.'
		});

		if (resultado.nombre) {
			nodo.atributos.nombre = resultado.nombre.lexema;
		} else {
			nodo.atributos.nombre = 'sin_nombre';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_ssh
	analizarConfiguracionSsh() {
		const nodo = crearNodo('ConfiguracionSsh');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'ssh',
			patron: [
				{ tipo: 'TK_RES_SSH' },
				{ tipo: 'TK_RES_USUARIO' },
				{ tipo: 'TK_ID', nombre: 'usuario' },
				{ tipo: 'TK_RES_PASSWORD' },
				{ tipo: 'TK_ID', nombre: 'password' },
				{ tipo: 'TK_RES_DOMINIO' },
				{ tipo: 'TK_DOMINIO', nombre: 'dominio' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción ssh solo acepta usuario, password y dominio en ese orden.',
			sugerenciaBase: 'Usa el formato: ssh usuario admin password cisco123 dominio cisco.com.'
		});

		if (resultado.usuario) {
			nodo.atributos.usuario = resultado.usuario.lexema;
		} else {
			nodo.atributos.usuario = 'sin_usuario';
		}

		if (resultado.password) {
			nodo.atributos.password = resultado.password.lexema;
		} else {
			nodo.atributos.password = 'sin_password';
		}

		if (resultado.dominio) {
			nodo.atributos.dominio = resultado.dominio.lexema;
		} else {
			nodo.atributos.dominio = 'sin_dominio';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_puerto_router
	analizarConfiguracionPuertoRouter() {
		const nodo = crearNodo('ConfiguracionPuertoRouter');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'puerto de router',
			patron: [
				{ tipo: 'TK_RES_PUERTO' },
				{ tipo: 'TK_IFACE', nombre: 'interfaz' },
				{ tipo: 'TK_RES_IP' },
				{ tipo: 'TK_IP', nombre: 'ip' },
				{ tipo: 'TK_MASK', nombre: 'mascara' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La configuración de puerto en ROUTER solo acepta interfaz, ip y máscara en ese orden.',
			sugerenciaBase: 'Usa el formato: puerto g0/0 ip 192.168.1.1 /24.'
		});

		if (resultado.interfaz) {
			nodo.atributos.interfaz = resultado.interfaz.lexema;
		} else {
			nodo.atributos.interfaz = 'sin_interfaz';
		}

		if (resultado.ip) {
			nodo.atributos.ip = resultado.ip.lexema;
			nodo.tokenReferencia = resultado.ip;
		} else {
			nodo.atributos.ip = 'sin_ip';
		}

		if (resultado.mascara) {
			nodo.atributos.mascara = resultado.mascara.lexema;
		} else {
			nodo.atributos.mascara = 'sin_mascara';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_pool_dhcp
	analizarConfiguracionPoolDhcp() {
		const nodo = crearNodo('ConfiguracionPoolDhcp');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'pool',
			patron: [
				{ tipo: 'TK_RES_POOL' },
				{ tipo: 'TK_ID', nombre: 'nombre' },
				{ tipo: 'TK_RES_RED' },
				{ tipo: 'TK_IP', nombre: 'red' },
				{ tipo: 'TK_MASK', nombre: 'mascara' },
				{ tipo: 'TK_RES_GATEWAY' },
				{ tipo: 'TK_IP', nombre: 'gateway' },
				{ tipo: 'TK_RES_DNS' },
				{ tipo: 'TK_IP', nombre: 'dns' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción pool solo acepta nombre, red, máscara, gateway y dns en ese orden.',
			sugerenciaBase: 'Usa el formato: pool LAN1 red 192.168.1.0 /24 gateway 192.168.1.1 dns 8.8.8.8.'
		});

		if (resultado.nombre) {
			nodo.atributos.nombre = resultado.nombre.lexema;
		} else {
			nodo.atributos.nombre = 'sin_nombre';
		}

		if (resultado.red) {
			nodo.atributos.red = resultado.red.lexema;
		} else {
			nodo.atributos.red = 'sin_red';
		}

		if (resultado.mascara) {
			nodo.atributos.mascara = resultado.mascara.lexema;
		} else {
			nodo.atributos.mascara = 'sin_mascara';
		}

		if (resultado.gateway) {
			nodo.atributos.gateway = resultado.gateway.lexema;
		} else {
			nodo.atributos.gateway = 'sin_gateway';
		}

		if (resultado.dns) {
			nodo.atributos.dns = resultado.dns.lexema;
		} else {
			nodo.atributos.dns = 'sin_dns';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_excluir_ip
	analizarConfiguracionExcluirIp() {
		const nodo = crearNodo('ConfiguracionExcluirIp');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'excluir',
			patron: [
				{ tipo: 'TK_RES_EXCLUIR' },
				{ tipo: 'TK_IP', nombre: 'ipInicial' },
				{ tipo: 'TK_IP', nombre: 'ipFinal' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción excluir solo acepta dos direcciones IP.',
			sugerenciaBase: 'Usa el formato: excluir 192.168.1.1 192.168.1.10.'
		});

		if (resultado.ipInicial) {
			nodo.atributos.ipInicial = resultado.ipInicial.lexema;
		} else {
			nodo.atributos.ipInicial = 'sin_ip_inicial';
		}

		if (resultado.ipFinal) {
			nodo.atributos.ipFinal = resultado.ipFinal.lexema;
		} else {
			nodo.atributos.ipFinal = 'sin_ip_final';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_vlan
	analizarConfiguracionVlan() {
		const nodo = crearNodo('ConfiguracionVlan');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'vlan',
			patron: [
				{ tipo: 'TK_RES_VLAN' },
				{ tipo: 'TK_NUM', nombre: 'numero' },
				{ tipo: 'TK_RES_NOMBRE' },
				{ tipo: 'TK_ID', nombre: 'nombre' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción vlan solo acepta número y nombre en ese orden.',
			sugerenciaBase: 'Usa el formato: vlan 10 nombre Ventas.'
		});

		if (resultado.numero) {
			nodo.atributos.numero = resultado.numero.lexema;
		} else {
			nodo.atributos.numero = 'sin_numero';
		}

		if (resultado.nombre) {
			nodo.atributos.nombre = resultado.nombre.lexema;
		} else {
			nodo.atributos.nombre = 'sin_nombre';
		}

		return nodo;
	}

	//AFD Sintáctico Configuracion_puerto_switch
	analizarConfiguracionPuertoSwitch() {
		const nodo = crearNodo('ConfiguracionPuertoSwitch');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'puerto de switch',
			patron: [
				{ tipo: 'TK_RES_PUERTO' },
				{ tipo: 'TK_IFACE', nombre: 'interfaz' },
				{ tipo: 'TK_RES_ACCESO' },
				{ tipo: 'TK_NUM', nombre: 'vlan' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La configuración de puerto en SWITCH solo acepta interfaz, acceso y número de VLAN en ese orden.',
			sugerenciaBase: 'Usa el formato: puerto fa0/1 acceso 10.'
		});

		if (resultado.interfaz) {
			nodo.atributos.interfaz = resultado.interfaz.lexema;
		} else {
			nodo.atributos.interfaz = 'sin_interfaz';
		}

		if (resultado.vlan) {
			nodo.atributos.vlan = resultado.vlan.lexema;
		} else {
			nodo.atributos.vlan = 'sin_vlan';
		}

		return nodo;
	}

	//AFD Sintáctico Sentencia_probar_ping
	analizarSentenciaProbarPing() {
		const nodo = crearNodo('SentenciaProbarPing');
		const resultado = this.validarPatronFlexible({
			nombreEstructura: 'probar ping',
			patron: [
				{ tipo: 'TK_RES_PROBAR' },
				{ tipo: 'TK_RES_PING' },
				{ tipo: 'TK_ID', nombre: 'origen' },
				{ tipo: 'TK_ID', nombre: 'destino' }
			],
			tiposDetencion: this.obtenerTiposDetencionNivelPrograma(),
			descripcionBase: 'La sentencia probar ping solo acepta la palabra ping y dos dispositivos.',
			sugerenciaBase: 'Usa el formato: probar ping PC1 PC2.'
		});

		if (resultado.origen) {
			nodo.atributos.origen = resultado.origen.lexema;
		} else {
			nodo.atributos.origen = 'sin_origen';
		}

		if (resultado.destino) {
			nodo.atributos.destino = resultado.destino.lexema;
		} else {
			nodo.atributos.destino = 'sin_destino';
		}

		return nodo;
	}

	//AFD Sintáctico Sentencia_mostrar_redes
	analizarSentenciaMostrarRedes() {
		const nodo = crearNodo('SentenciaMostrarRedes');

		this.validarPatronFlexible({
			nombreEstructura: 'mostrar redes',
			patron: [
				{ tipo: 'TK_RES_MOSTRAR' },
				{ tipo: 'TK_RES_REDES' }
			],
			tiposDetencion: this.obtenerTiposDetencionNivelPrograma(),
			descripcionBase: 'La sentencia mostrar redes no acepta parámetros adicionales.',
			sugerenciaBase: 'La sentencia correcta es solamente: mostrar redes.'
		});

		return nodo;
	}

	//AFD Sintáctico Sentencia_verificar
	analizarSentenciaVerificar() {
		const nodo = crearNodo('SentenciaVerificar');

		this.validarPatronFlexible({
			nombreEstructura: 'verificar',
			patron: [
				{ tipo: 'TK_RES_VERIFICAR' }
			],
			tiposDetencion: this.obtenerTiposDetencionNivelPrograma(),
			descripcionBase: 'La sentencia verificar no acepta parámetros adicionales.',
			sugerenciaBase: 'La sentencia correcta es solamente: verificar.'
		});

		return nodo;
	}

	validarPatronFlexible(datos) {
		const resultado = {};
		const tiposConsumidos = [];
		const tiposPatron = datos.patron.map(parte => parte.tipo);

		for (const parte of datos.patron) {
			const token = this.tokenActual();

			if (token.tipo === parte.tipo) {
				const tokenConsumido = this.avanzar();
				tiposConsumidos.push(tokenConsumido.tipo);

				if (parte.nombre) {
					resultado[parte.nombre] = tokenConsumido;
				}

				continue;
			}

			if (this.esTipoDetencion(token.tipo, datos.tiposDetencion)) {
				this.registrarError({
					token,
					esperado: parte.tipo,
					descripcion: `La estructura "${datos.nombreEstructura}" está incompleta. Se esperaba ${this.obtenerDescripcionTokenEsperado(parte.tipo)} antes de iniciar otra estructura.`,
					sugerencia: datos.sugerenciaBase
				});

				return resultado;
			}

			this.registrarError({
				token,
				esperado: parte.tipo,
				descripcion: this.crearDescripcionParametroIncorrecto({
					token,
					tipoEsperado: parte.tipo,
					nombreEstructura: datos.nombreEstructura,
					tiposConsumidos,
					tiposPatron,
					patron: datos.patron,
					descripcionBase: datos.descripcionBase
				}),
				sugerencia: datos.sugerenciaBase
			});

			this.recuperarHastaSiguienteEstructura(datos.tiposDetencion);
			return resultado;
		}

		const tokenExtra = this.tokenActual();

		if (
			!this.esTipoDetencion(tokenExtra.tipo, datos.tiposDetencion) &&
			tokenExtra.tipo !== 'TK_FNA'
		) {
			this.registrarError({
				token: tokenExtra,
				esperado: `fin de la instrucción ${datos.nombreEstructura}`,
				descripcion: this.crearDescripcionParametroExtra({
					token: tokenExtra,
					nombreEstructura: datos.nombreEstructura,
					tiposConsumidos,
					tiposPatron,
					patron: datos.patron,
					descripcionBase: datos.descripcionBase
				}),
				sugerencia: datos.sugerenciaBase
			});

			this.recuperarHastaSiguienteEstructura(datos.tiposDetencion);
		}

		return resultado;
	}

	crearDescripcionParametroIncorrecto(datos) {
		if (datos.tiposConsumidos.includes(datos.token.tipo)) {
			if (this.esTipoValor(datos.token.tipo)) {
				return `La estructura "${datos.nombreEstructura}" ya recibió ${this.obtenerDescripcionParametroRecibido(datos.token.tipo, datos.patron)}. En esta posición se esperaba ${this.obtenerDescripcionTokenEsperado(datos.tipoEsperado)}. ${datos.descripcionBase}`;
			}

			return `El parámetro "${datos.token.lexema}" está repetido en la estructura "${datos.nombreEstructura}". ${datos.descripcionBase}`;
		}

		if (datos.tiposPatron.includes(datos.token.tipo)) {
			return `El parámetro "${datos.token.lexema}" está fuera de lugar en la estructura "${datos.nombreEstructura}". Se esperaba ${this.obtenerDescripcionTokenEsperado(datos.tipoEsperado)}. ${datos.descripcionBase}`;
		}

		return `Se encontró "${datos.token.lexema}" en una posición incorrecta dentro de la estructura "${datos.nombreEstructura}". Se esperaba ${this.obtenerDescripcionTokenEsperado(datos.tipoEsperado)}. ${datos.descripcionBase}`;
	}

	crearDescripcionParametroExtra(datos) {
		if (datos.tiposConsumidos.includes(datos.token.tipo)) {
			if (this.esTipoValor(datos.token.tipo)) {
				return `La estructura "${datos.nombreEstructura}" ya recibió ${this.obtenerDescripcionParametroRecibido(datos.token.tipo, datos.patron)}. Se encontró el valor extra "${datos.token.lexema}".`;
			}

			return `El parámetro "${datos.token.lexema}" está repetido en la estructura "${datos.nombreEstructura}".`;
		}

		if (datos.tiposPatron.includes(datos.token.tipo)) {
			return `El parámetro "${datos.token.lexema}" está fuera de lugar en la estructura "${datos.nombreEstructura}".`;
		}

		return `${datos.descripcionBase} Se encontró el valor extra "${datos.token.lexema}".`;
	}

	esTipoValor(tipo) {
		return [
			'TK_ID',
			'TK_IFACE',
			'TK_IP',
			'TK_MASK',
			'TK_NUM'
		].includes(tipo);
	}

	obtenerDescripcionParametroRecibido(tipo, patron) {
		const parametrosDelTipo = patron.filter(parte => parte.tipo === tipo);
		const descripcionTipo = this.obtenerNombreTipoValor(tipo);

		if (parametrosDelTipo.length === 1) {
			return `${this.obtenerArticuloTipoValor(tipo)} ${descripcionTipo}`;
		}

		return `todos los parámetros de tipo ${descripcionTipo} permitidos`;
	}

	obtenerArticuloTipoValor(tipo) {
		if (tipo === 'TK_IFACE' || tipo === 'TK_IP' || tipo === 'TK_MASK') {
			return 'una';
		}

		return 'un';
	}

	obtenerNombreTipoValor(tipo) {
		if (tipo === 'TK_ID') {
			return 'identificador';
		}

		if (tipo === 'TK_IFACE') {
			return 'interfaz';
		}

		if (tipo === 'TK_IP') {
			return 'dirección IP';
		}

		if (tipo === 'TK_MASK') {
			return 'máscara';
		}

		if (tipo === 'TK_NUM') {
			return 'número entero';
		}

		return 'valor';
	}

	obtenerDescripcionTokenEsperado(tipo) {
		if (lexemasEsperados[tipo]) {
			return lexemasEsperados[tipo];
		}

		return tipo;
	}

	esTipoDetencion(tipo, tiposDetencion) {
		return tiposDetencion.includes(tipo);
	}

	obtenerTiposDetencionNivelPrograma() {
		return [
			'TK_RES_ROUTER',
			'TK_RES_SWITCH',
			'TK_RES_PROBAR',
			'TK_RES_MOSTRAR',
			'TK_RES_VERIFICAR',
			'TK_FNA'
		];
	}

	obtenerTiposDetencionEncabezado() {
		return [
			'TK_RES_BASICA',
			'TK_RES_HOSTNAME',
			'TK_RES_SSH',
			'TK_RES_PUERTO',
			'TK_RES_POOL',
			'TK_RES_EXCLUIR',
			'TK_RES_VLAN',
			'TK_RES_FIN',
			'TK_RES_ROUTER',
			'TK_RES_SWITCH',
			'TK_RES_PROBAR',
			'TK_RES_MOSTRAR',
			'TK_RES_VERIFICAR',
			'TK_FNA'
		];
	}

	obtenerTiposDetencionDentroDeBloque() {
		return [
			'TK_RES_BASICA',
			'TK_RES_HOSTNAME',
			'TK_RES_SSH',
			'TK_RES_PUERTO',
			'TK_RES_POOL',
			'TK_RES_EXCLUIR',
			'TK_RES_VLAN',
			'TK_RES_FIN',
			'TK_RES_ROUTER',
			'TK_RES_SWITCH',
			'TK_RES_PROBAR',
			'TK_RES_MOSTRAR',
			'TK_RES_VERIFICAR',
			'TK_FNA'
		];
	}

	obtenerDescripcionInstruccionFueraDeBloque(tipoToken, bloqueActual) {
		if (bloqueActual === 'ROUTER' && tipoToken === 'TK_RES_VLAN') {
			return 'La instrucción "vlan" solo puede usarse dentro de un bloque SWITCH.';
		}

		if (bloqueActual === 'ROUTER' && tipoToken === 'TK_RES_ACCESO') {
			return 'La instrucción "acceso" solo puede usarse en la configuración de un puerto de SWITCH.';
		}

		if (
			bloqueActual === 'SWITCH' &&
			['TK_RES_POOL', 'TK_RES_RED', 'TK_RES_GATEWAY', 'TK_RES_DNS', 'TK_RES_EXCLUIR'].includes(tipoToken)
		) {
			return 'La instrucción DHCP indicada solo puede usarse dentro de un bloque ROUTER.';
		}

		if (bloqueActual === 'SWITCH' && tipoToken === 'TK_RES_IP') {
			return 'La configuración de IP directa en puerto solo puede usarse dentro de un bloque ROUTER.';
		}

		return `La instrucción no es válida dentro de un bloque ${bloqueActual}.`;
	}

	esInicioSentencia(tipo) {
		return [
			'TK_RES_ROUTER',
			'TK_RES_SWITCH',
			'TK_RES_PROBAR',
			'TK_RES_MOSTRAR',
			'TK_RES_VERIFICAR'
		].includes(tipo);
	}

	esInicioInstruccionRouter(tipo) {
		return [
			'TK_RES_BASICA',
			'TK_RES_HOSTNAME',
			'TK_RES_SSH',
			'TK_RES_PUERTO',
			'TK_RES_POOL',
			'TK_RES_EXCLUIR'
		].includes(tipo);
	}

	esInicioInstruccionSwitch(tipo) {
		return [
			'TK_RES_BASICA',
			'TK_RES_HOSTNAME',
			'TK_RES_SSH',
			'TK_RES_VLAN',
			'TK_RES_PUERTO'
		].includes(tipo);
	}

	recuperarHastaInicioSentencia() {
		while (
			!this.coincide('TK_FNA') &&
			!this.esInicioSentencia(this.tokenActual().tipo)
		) {
			this.avanzar();
		}
	}

	recuperarDentroDeBloque() {
		this.avanzar();

		while (
			!this.coincide('TK_FNA') &&
			!this.coincide('TK_RES_FIN') &&
			!this.esInicioInstruccionRouter(this.tokenActual().tipo) &&
			!this.esInicioInstruccionSwitch(this.tokenActual().tipo) &&
			!this.esInicioSentencia(this.tokenActual().tipo)
		) {
			this.avanzar();
		}
	}

	recuperarHastaSiguienteEstructura(tiposDetencion) {
		while (
			!this.coincide('TK_FNA') &&
			!this.esTipoDetencion(this.tokenActual().tipo, tiposDetencion)
		) {
			this.avanzar();
		}
	}
}


function analizarRepeticiones(arbol) {
	const errores = [];

	if (!arbol || !Array.isArray(arbol.hijos)) {
		return { errores };
	}

	validarIdentificadoresDispositivosUnicos(arbol, errores);
	validarDireccionesIpAsignadasUnicas(arbol, errores);

	return { errores };
}

function validarIdentificadoresDispositivosUnicos(arbol, errores) {
	const identificadores = new Map();

	for (const bloque of arbol.hijos) {
		if (!['BloqueRouter', 'BloqueSwitch'].includes(bloque.tipo)) {
			continue;
		}

		const nombre = bloque.atributos.nombre;

		if (!nombre || nombre === 'sin_nombre') {
			continue;
		}

		const clave = nombre.toLowerCase();
		const tipoDispositivo = bloque.tipo === 'BloqueRouter' ? 'ROUTER' : 'SWITCH';

		if (identificadores.has(clave)) {
			const registroAnterior = identificadores.get(clave);

			errores.push(crearErrorRepeticion({
				token: bloque.tokenReferencia,
				esperado: 'identificador de dispositivo no repetido',
				descripcion: `El identificador "${nombre}" ya fue usado en un ${registroAnterior.tipoDispositivo}. No puedes usar el mismo nombre para dos routers, dos switches o un router y un switch.`,
				sugerencia: `Cambia el identificador "${nombre}" por otro nombre, por ejemplo ${sugerirNombreDispositivo(nombre)}.`
			}));

			continue;
		}

		identificadores.set(clave, {
			nombre,
			tipoDispositivo
		});
	}
}

function validarDireccionesIpAsignadasUnicas(arbol, errores) {
	const direccionesAsignadas = new Map();

	for (const bloque of arbol.hijos) {
		if (!['BloqueRouter', 'BloqueSwitch'].includes(bloque.tipo)) {
			continue;
		}

		const nombreDispositivo = bloque.atributos.nombre || 'sin_nombre';
		const tipoDispositivo = bloque.tipo === 'BloqueRouter' ? 'ROUTER' : 'SWITCH';

		for (const instruccion of bloque.hijos) {
			if (instruccion.tipo !== 'ConfiguracionPuertoRouter') {
				continue;
			}

			const ip = instruccion.atributos.ip;

			if (!ip || ip === 'sin_ip') {
				continue;
			}

			const clave = ip;
			const interfaz = instruccion.atributos.interfaz || 'sin_interfaz';

			if (direccionesAsignadas.has(clave)) {
				const registroAnterior = direccionesAsignadas.get(clave);

				errores.push(crearErrorRepeticion({
					token: instruccion.tokenReferencia,
					esperado: 'dirección IP no repetida',
					descripcion: `La dirección IP "${ip}" ya fue asignada al ${registroAnterior.tipoDispositivo} ${registroAnterior.dispositivo}, en la interfaz ${registroAnterior.interfaz}. No debes usar la misma IP en dos interfaces o dispositivos diferentes.`,
					sugerencia: `Asigna una IP diferente a la interfaz ${interfaz} del ${tipoDispositivo} ${nombreDispositivo}.`
				}));

				continue;
			}

			direccionesAsignadas.set(clave, {
				ip,
				dispositivo: nombreDispositivo,
				tipoDispositivo,
				interfaz
			});
		}
	}
}

function crearErrorRepeticion(datos) {
	const token = datos.token || {
		lexema: '—',
		tipo: 'valor repetido',
		renglon: 1,
		columna: 1,
		inicioGlobal: 0,
		finGlobal: 0
	};

	return {
		tipo: 'de repetición',
		renglon: token.renglon,
		columna: token.columna,
		lexema: token.lexema,
		tokenEncontrado: token.tipo,
		tokenEsperado: datos.esperado,
		descripcion: datos.descripcion,
		sugerencia: datos.sugerencia,
		inicioGlobal: token.inicioGlobal,
		finGlobal: token.finGlobal
	};
}

function sugerirNombreDispositivo(nombre) {
	const coincidencia = nombre.match(/^([a-zA-Z]+)([0-9]+)$/);

	if (!coincidencia) {
		return `${nombre}_2`;
	}

	const prefijo = coincidencia[1];
	const numero = Number(coincidencia[2]) + 1;

	return `${prefijo}${numero}`;
}

function crearNodo(tipo) {
	return {
		tipo,
		atributos: {},
		hijos: []
	};
}

function crearSugerenciaSintactica(tipoEsperado) {
	const lexema = lexemasEsperados[tipoEsperado] || tipoEsperado;
	return `Coloca ${lexema} en esta posición.`;
}

function actualizarNumerosRenglon(texto) {
	const total = texto.split('\n').length || 1;
	let salida = '';

	for (let numero = 1; numero <= total; numero++) {
		salida += numero + (numero < total ? '\n' : '');
	}

	numerosRenglon.textContent = salida;
}

function actualizarResaltado(texto, errores, tokens) {
	const clasesPorCaracter = Array(texto.length).fill('');

	for (const token of tokens) {
		if (token.tipo === 'TK_FNA') {
			continue;
		}

		const claseToken = obtenerClaseResaltadoToken(token.tipo);

		if (!claseToken) {
			continue;
		}

		for (let indice = token.inicioGlobal; indice < token.finGlobal && indice < texto.length; indice++) {
			clasesPorCaracter[indice] = claseToken;
		}
	}

	const marcasErrores = crearMarcasErrores(texto, errores);

	for (const marca of marcasErrores) {
		for (let indice = marca.inicio; indice < marca.fin && indice < texto.length; indice++) {
			const claseActual = clasesPorCaracter[indice];

			if (claseActual) {
				clasesPorCaracter[indice] = `${claseActual} error-subrayado`;
			} else {
				clasesPorCaracter[indice] = 'error-subrayado';
			}
		}
	}

	let salida = '';
	let indice = 0;

	while (indice < texto.length) {
		const claseActual = clasesPorCaracter[indice];
		let fin = indice + 1;

		while (fin < texto.length && clasesPorCaracter[fin] === claseActual) {
			fin++;
		}

		const fragmento = escaparHtml(texto.slice(indice, fin));

		if (claseActual) {
			salida += `<span class="${claseActual}">${fragmento}</span>`;
		} else {
			salida += fragmento;
		}

		indice = fin;
	}

	if (texto.endsWith('\n')) {
		salida += '\n';
	}

	capaResaltado.innerHTML = salida || '';
}

function obtenerClaseResaltadoToken(tipoToken) {
	if (tipoToken.startsWith('TK_RES_')) {
		return 'token-reservada-resaltado';
	}

	if (tipoToken === 'TK_IP') {
		return 'token-ip-resaltado';
	}

	if (tipoToken === 'TK_MASK') {
		return 'token-mascara-resaltado';
	}

	if (tipoToken === 'TK_IFACE') {
		return 'token-interfaz-resaltado';
	}

	if (tipoToken === 'TK_ID') {
		return 'token-identificador-resaltado';
	}

	if (tipoToken === 'TK_NUM') {
		return 'token-numero-resaltado';
	}

	if (tipoToken === 'TK_DOSP') {
		return 'token-simbolo-resaltado';
	}

	if (tipoToken === 'TK_COMENTARIO') {
		return 'comentario-resaltado';
	}

	if (tipoToken === 'TK_ERROR') {
		return 'token-error-resaltado';
	}

	return '';
}

function crearMarcasErrores(texto, errores) {
	const marcas = [];

	for (const error of errores) {
		let inicio = Number.isInteger(error.inicioGlobal) ? error.inicioGlobal : 0;
		let fin = Number.isInteger(error.finGlobal) ? error.finGlobal : inicio + 1;

		if (inicio === fin) {
			inicio = Math.max(0, Math.min(texto.length - 1, inicio - 1));
			fin = Math.min(texto.length, inicio + 1);
		}

		inicio = Math.max(0, Math.min(texto.length, inicio));
		fin = Math.max(inicio, Math.min(texto.length, fin));

		if (fin > inicio) {
			marcas.push({ inicio, fin });
		}
	}

	marcas.sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);

	const marcasUnidas = [];

	for (const marca of marcas) {
		const ultima = marcasUnidas[marcasUnidas.length - 1];

		if (!ultima || marca.inicio > ultima.fin) {
			marcasUnidas.push({ ...marca });
		} else {
			ultima.fin = Math.max(ultima.fin, marca.fin);
		}
	}

	return marcasUnidas;
}

function mostrarTokens(tokens) {
	if (!tokens.length) {
		cuerpoTablaTokens.innerHTML = '<tr><td colspan="6" class="celda-vacia">No hay tokens para mostrar.</td></tr>';
		return;
	}

	cuerpoTablaTokens.innerHTML = tokens.map((token, indice) => {
		const clase = token.tipo === 'TK_ERROR' ? ' class="token-error"' : '';
		const descripcion = token.descripcionPersonalizada || descripcionesTokens[token.tipo] || 'Sin categoría';

		return `
			<tr${clase}>
				<td>${indice + 1}</td>
				<td><strong>${escaparHtml(token.tipo)}</strong></td>
				<td>${escaparHtml(token.lexema)}</td>
				<td>${escaparHtml(descripcion)}</td>
				<td>${token.renglon}</td>
				<td>${token.columna}</td>
			</tr>
		`;
	}).join('');
}

function mostrarErrores(errores) {
	if (!errores.length) {
		contenedorErrores.innerHTML = '<p class="mensaje-vacio">No se detectaron errores léxicos ni sintácticos.</p>';
		return;
	}

	contenedorErrores.innerHTML = errores.map(error => `
		<div class="tarjeta-error">
			<strong>Error ${escaparHtml(error.tipo)}</strong>
			<p><b>Renglón:</b> ${error.renglon}, <b>columna:</b> ${error.columna}</p>
			<p><b>Encontrado:</b> ${escaparHtml(error.tokenEncontrado)} "${escaparHtml(error.lexema)}"</p>
			<p><b>Esperado:</b> ${escaparHtml(error.tokenEsperado)}</p>
			<p>${escaparHtml(error.descripcion)}</p>
		</div>
	`).join('');
}

function mostrarSugerencias(errores) {
	const sugerencias = errores
		.map(error => error.sugerencia)
		.filter(Boolean);

	if (!sugerencias.length) {
		contenedorSugerencias.innerHTML = '<p class="mensaje-vacio">No hay sugerencias por ahora.</p>';
		return;
	}

	const sugerenciasUnicas = [...new Set(sugerencias)];

	contenedorSugerencias.innerHTML = sugerenciasUnicas.map(sugerencia => `
		<div class="tarjeta-sugerencia">
			<strong>Sugerencia</strong>
			<p>${escaparHtml(sugerencia)}</p>
		</div>
	`).join('');
}

function mostrarResumen(tokens, errores) {
	const totalTokens = tokens.filter(token => token.tipo !== 'TK_FNA' && token.tipo !== 'TK_COMENTARIO').length;

	if (!entradaCodigo.value.trim()) {
		resumenAnalisis.className = 'resumen resumen-correcto';
		resumenAnalisis.textContent = 'Esperando código...';
		return;
	}

	if (errores.length) {
		resumenAnalisis.className = 'resumen resumen-error';
		resumenAnalisis.textContent = `Análisis con errores: ${errores.length} error(es) detectado(s), ${totalTokens} token(s) generados.`;
	} else {
		resumenAnalisis.className = 'resumen resumen-correcto';
		resumenAnalisis.textContent = `Análisis correcto: ${totalTokens} token(s) generados y sintaxis válida.`;
	}
}

function mostrarArbol(arbol) {
	if (!arbol || !entradaCodigo.value.trim()) {
		salidaArbol.textContent = 'Sin árbol generado.';
		return;
	}

	salidaArbol.textContent = convertirArbolTexto(arbol);
}

function mostrarReglasSemanticas(reglasEjecutadas) {
	if (!salidaReglasSemanticas) {
		return;
	}

	if (!entradaCodigo.value.trim()) {
		salidaReglasSemanticas.textContent = 'Sin reglas semánticas ejecutadas.';
		return;
	}

	if (!reglasEjecutadas.length) {
		salidaReglasSemanticas.textContent = 'No se ejecutaron reglas semánticas porque no hay estructuras válidas para analizar.';
		return;
	}

	salidaReglasSemanticas.textContent = reglasEjecutadas.join('\n');
}

function convertirArbolTexto(nodo, nivel = 0) {
	const tabulacion = '\t'.repeat(nivel);
	let resultado = `${tabulacion}${nodo.tipo}\n`;

	const atributos = Object.entries(nodo.atributos || {});

	for (const [clave, valor] of atributos) {
		resultado += `${tabulacion}\t${clave}: ${valor}\n`;
	}

	for (const hijo of nodo.hijos) {
		resultado += convertirArbolTexto(hijo, nivel + 1);
	}

	return resultado;
}

function actualizarAutocompletado() {
	if (document.activeElement !== entradaCodigo) {
		ocultarAutocompletado();
		return;
	}

	const texto = entradaCodigo.value;
	const cursor = entradaCodigo.selectionStart;

	if (cursor !== entradaCodigo.selectionEnd) {
		ocultarAutocompletado();
		return;
	}

	const informacionPalabra = obtenerPalabraActual(texto, cursor);
	const sugerencias = obtenerSugerenciasAutocompletado(texto, informacionPalabra);

	if (!sugerencias.length) {
		ocultarAutocompletado();
		return;
	}

	estadoAutocompletado.visible = true;
	estadoAutocompletado.sugerencias = sugerencias;
	estadoAutocompletado.indiceSeleccionado = 0;
	estadoAutocompletado.inicioPalabra = informacionPalabra.inicio;
	estadoAutocompletado.finPalabra = informacionPalabra.fin;

	mostrarAutocompletado();
	posicionarAutocompletado();
}

function obtenerPalabraActual(texto, cursor) {
	let inicio = cursor;
	let fin = cursor;

	while (inicio > 0 && /[a-zA-Z0-9_\/:.-]/.test(texto[inicio - 1])) {
		inicio--;
	}

	while (fin < texto.length && /[a-zA-Z0-9_\/:.-]/.test(texto[fin])) {
		fin++;
	}

	return {
		inicio,
		fin,
		texto: texto.slice(inicio, fin)
	};
}

function obtenerSugerenciasAutocompletado(texto, informacionPalabra) {
	const textoAntesCursor = texto.slice(0, informacionPalabra.inicio);
	const lexemaActual = informacionPalabra.texto;
	const candidatos = obtenerCandidatosPorContexto(textoAntesCursor);
	const lexemaMinusculas = lexemaActual.toLowerCase();

	if (!candidatos.length) {
		return [];
	}

	const sugerenciasFiltradas = candidatos.filter(candidato => {
		if (!lexemaActual) {
			return true;
		}

		return candidato.texto.toLowerCase().startsWith(lexemaMinusculas) &&
			candidato.texto.toLowerCase() !== lexemaMinusculas;
	});

	return eliminarSugerenciasDuplicadas(sugerenciasFiltradas).slice(0, 8);
}

function obtenerCandidatosPorContexto(textoAntesCursor) {
	const tokensAntes = analizarLexico(textoAntesCursor).tokensValidos
		.filter(token => token.tipo !== 'TK_FNA');

	if (!tokensAntes.length) {
		return buscarCandidatos(['ROUTER', 'SWITCH', 'probar', 'mostrar', 'verificar']);
	}

	const bloqueActual = obtenerBloqueActual(tokensAntes);

	if (bloqueActual === 'ROUTER') {
		return filtrarCandidatosRepetidos(
			obtenerCandidatosDentroDeRouter(tokensAntes),
			tokensAntes,
			'ROUTER'
		);
	}

	if (bloqueActual === 'SWITCH') {
		return filtrarCandidatosRepetidos(
			obtenerCandidatosDentroDeSwitch(tokensAntes),
			tokensAntes,
			'SWITCH'
		);
	}

	return obtenerCandidatosNivelPrograma(tokensAntes);
}

function obtenerCandidatosNivelPrograma(tokensAntes) {
	const tipos = tokensAntes.map(token => token.tipo);
	const candidatosInicio = ['ROUTER', 'SWITCH', 'probar', 'mostrar', 'verificar'];

	const patrones = [
		{
			partes: [
				{ tipo: 'TK_RES_ROUTER', candidatos: ['ROUTER'] },
				{ tipo: 'TK_ID', candidatos: ['R1'] },
				{ tipo: 'TK_DOSP', candidatos: [':'] }
			],
			despues: ['basica', 'hostname', 'ssh', 'puerto', 'pool', 'excluir', 'fin']
		},
		{
			partes: [
				{ tipo: 'TK_RES_SWITCH', candidatos: ['SWITCH'] },
				{ tipo: 'TK_ID', candidatos: ['S1'] },
				{ tipo: 'TK_DOSP', candidatos: [':'] }
			],
			despues: ['basica', 'hostname', 'ssh', 'vlan', 'puerto', 'fin']
		},
		{
			partes: [
				{ tipo: 'TK_RES_PROBAR', candidatos: ['probar'] },
				{ tipo: 'TK_RES_PING', candidatos: ['ping'] },
				{ tipo: 'TK_ID', candidatos: ['PC1'] },
				{ tipo: 'TK_ID', candidatos: ['PC2'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_MOSTRAR', candidatos: ['mostrar'] },
				{ tipo: 'TK_RES_REDES', candidatos: ['redes'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_VERIFICAR', candidatos: ['verificar'] }
			],
			despues: candidatosInicio
		}
	];

	const indiceInicio = obtenerUltimoIndice(tipos, [
		'TK_RES_ROUTER',
		'TK_RES_SWITCH',
		'TK_RES_PROBAR',
		'TK_RES_MOSTRAR',
		'TK_RES_VERIFICAR'
	]);

	if (indiceInicio === -1) {
		return buscarCandidatos(candidatosInicio);
	}

	const tiposActuales = tipos.slice(indiceInicio);
	const candidatos = obtenerCandidatosPorPatrones(tiposActuales, patrones, candidatosInicio);

	return buscarCandidatos(candidatos);
}

function obtenerCandidatosDentroDeRouter(tokensAntes) {
	const candidatosInicio = ['basica', 'hostname', 'ssh', 'puerto', 'pool', 'excluir', 'fin'];
	const tiposActuales = obtenerTiposInstruccionActual(tokensAntes, [
		'TK_RES_BASICA',
		'TK_RES_HOSTNAME',
		'TK_RES_SSH',
		'TK_RES_PUERTO',
		'TK_RES_POOL',
		'TK_RES_EXCLUIR'
	]);

	if (!tiposActuales.length) {
		return buscarCandidatos(candidatosInicio);
	}

	const patrones = [
		{
			partes: [
				{ tipo: 'TK_RES_BASICA', candidatos: ['basica'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_HOSTNAME', candidatos: ['hostname'] },
				{ tipo: 'TK_ID', candidatos: ['R1'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_SSH', candidatos: ['ssh'] },
				{ tipo: 'TK_RES_USUARIO', candidatos: ['usuario'] },
				{ tipo: 'TK_ID', candidatos: ['admin'] },
				{ tipo: 'TK_RES_PASSWORD', candidatos: ['password'] },
				{ tipo: 'TK_ID', candidatos: ['cisco123'] },
				{ tipo: 'TK_RES_DOMINIO', candidatos: ['dominio'] },
				{ tipo: 'TK_DOMINIO', candidatos: ['cisco.com'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_PUERTO', candidatos: ['puerto'] },
				{ tipo: 'TK_IFACE', candidatos: ['g0/0', 'g0/1', 's0/0/0'] },
				{ tipo: 'TK_RES_IP', candidatos: ['ip'] },
				{ tipo: 'TK_IP', candidatos: ['192.168.1.1'] },
				{ tipo: 'TK_MASK', candidatos: ['/24', '/30'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_POOL', candidatos: ['pool'] },
				{ tipo: 'TK_ID', candidatos: ['LAN1'] },
				{ tipo: 'TK_RES_RED', candidatos: ['red'] },
				{ tipo: 'TK_IP', candidatos: ['192.168.1.0'] },
				{ tipo: 'TK_MASK', candidatos: ['/24', '/30'] },
				{ tipo: 'TK_RES_GATEWAY', candidatos: ['gateway'] },
				{ tipo: 'TK_IP', candidatos: ['192.168.1.1'] },
				{ tipo: 'TK_RES_DNS', candidatos: ['dns'] },
				{ tipo: 'TK_IP', candidatos: ['8.8.8.8'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_EXCLUIR', candidatos: ['excluir'] },
				{ tipo: 'TK_IP', candidatos: ['192.168.1.1'] },
				{ tipo: 'TK_IP', candidatos: ['192.168.1.10'] }
			],
			despues: candidatosInicio
		}
	];

	const candidatos = obtenerCandidatosPorPatrones(tiposActuales, patrones, candidatosInicio);

	return buscarCandidatos(candidatos);
}

function obtenerCandidatosDentroDeSwitch(tokensAntes) {
	const candidatosInicio = ['basica', 'hostname', 'ssh', 'vlan', 'puerto', 'fin'];
	const tiposActuales = obtenerTiposInstruccionActual(tokensAntes, [
		'TK_RES_BASICA',
		'TK_RES_HOSTNAME',
		'TK_RES_SSH',
		'TK_RES_VLAN',
		'TK_RES_PUERTO'
	]);

	if (!tiposActuales.length) {
		return buscarCandidatos(candidatosInicio);
	}

	const patrones = [
		{
			partes: [
				{ tipo: 'TK_RES_BASICA', candidatos: ['basica'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_HOSTNAME', candidatos: ['hostname'] },
				{ tipo: 'TK_ID', candidatos: ['S1'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_SSH', candidatos: ['ssh'] },
				{ tipo: 'TK_RES_USUARIO', candidatos: ['usuario'] },
				{ tipo: 'TK_ID', candidatos: ['admin'] },
				{ tipo: 'TK_RES_PASSWORD', candidatos: ['password'] },
				{ tipo: 'TK_ID', candidatos: ['cisco123'] },
				{ tipo: 'TK_RES_DOMINIO', candidatos: ['dominio'] },
				{ tipo: 'TK_DOMINIO', candidatos: ['cisco.com'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_VLAN', candidatos: ['vlan'] },
				{ tipo: 'TK_NUM', candidatos: ['10'] },
				{ tipo: 'TK_RES_NOMBRE', candidatos: ['nombre'] },
				{ tipo: 'TK_ID', candidatos: ['Ventas'] }
			],
			despues: candidatosInicio
		},
		{
			partes: [
				{ tipo: 'TK_RES_PUERTO', candidatos: ['puerto'] },
				{ tipo: 'TK_IFACE', candidatos: ['fa0/1', 'g0/1'] },
				{ tipo: 'TK_RES_ACCESO', candidatos: ['acceso'] },
				{ tipo: 'TK_NUM', candidatos: ['10'] }
			],
			despues: candidatosInicio
		}
	];

	const candidatos = obtenerCandidatosPorPatrones(tiposActuales, patrones, candidatosInicio);

	return buscarCandidatos(candidatos);
}

function obtenerCandidatosPorPatrones(tiposActuales, patrones, candidatosSiCompleto) {
	if (!tiposActuales.length) {
		return candidatosSiCompleto;
	}

	for (const patron of patrones) {
		if (tiposActuales.length > patron.partes.length) {
			continue;
		}

		const coincide = tiposActuales.every((tipo, indice) => tipo === patron.partes[indice].tipo);

		if (!coincide) {
			continue;
		}

		if (tiposActuales.length === patron.partes.length) {
			return patron.despues;
		}

		return patron.partes[tiposActuales.length].candidatos;
	}

	return [];
}

function obtenerTiposInstruccionActual(tokensAntes, tiposInicioInstruccion) {
	const indiceInicioBloque = obtenerIndiceInicioBloqueActual(tokensAntes);

	if (indiceInicioBloque === -1) {
		return [];
	}

	const tokensDelBloque = tokensAntes.slice(indiceInicioBloque + 1);
	let indiceUltimaInstruccion = -1;

	for (let indice = tokensDelBloque.length - 1; indice >= 0; indice--) {
		if (tiposInicioInstruccion.includes(tokensDelBloque[indice].tipo)) {
			indiceUltimaInstruccion = indice;
			break;
		}
	}

	if (indiceUltimaInstruccion === -1) {
		return [];
	}

	return tokensDelBloque
		.slice(indiceUltimaInstruccion)
		.map(token => token.tipo);
}

function obtenerIndiceInicioBloqueActual(tokens) {
	let bloqueActual = null;
	let encabezadoPendiente = null;
	let indiceInicioBloque = -1;

	for (let indice = 0; indice < tokens.length; indice++) {
		const token = tokens[indice];

		if (token.tipo === 'TK_RES_ROUTER') {
			encabezadoPendiente = 'ROUTER';
			continue;
		}

		if (token.tipo === 'TK_RES_SWITCH') {
			encabezadoPendiente = 'SWITCH';
			continue;
		}

		if (token.tipo === 'TK_DOSP' && encabezadoPendiente) {
			bloqueActual = encabezadoPendiente;
			encabezadoPendiente = null;
			indiceInicioBloque = indice;
			continue;
		}

		if (token.tipo === 'TK_RES_FIN') {
			bloqueActual = null;
			encabezadoPendiente = null;
			indiceInicioBloque = -1;
		}
	}

	return bloqueActual ? indiceInicioBloque : -1;
}

function obtenerBloqueActual(tokens) {
	let bloqueActual = null;
	let encabezadoPendiente = null;

	for (const token of tokens) {
		if (token.tipo === 'TK_RES_ROUTER') {
			encabezadoPendiente = 'ROUTER';
			continue;
		}

		if (token.tipo === 'TK_RES_SWITCH') {
			encabezadoPendiente = 'SWITCH';
			continue;
		}

		if (token.tipo === 'TK_DOSP' && encabezadoPendiente) {
			bloqueActual = encabezadoPendiente;
			encabezadoPendiente = null;
			continue;
		}

		if (token.tipo === 'TK_RES_FIN') {
			bloqueActual = null;
			encabezadoPendiente = null;
		}
	}

	return bloqueActual;
}

function filtrarCandidatosRepetidos(candidatos, tokensAntes, bloqueActual) {
	const tokensDelBloque = obtenerTokensDelBloqueActual(tokensAntes);
	const tiposUsados = new Set(tokensDelBloque.map(token => token.tipo));

	return candidatos.filter(candidato => {
		const reservada = obtenerReservadaExacta(candidato.texto);

		if (!reservada) {
			return true;
		}

		if (
			reservada.token === 'TK_RES_BASICA' &&
			tiposUsados.has('TK_RES_BASICA')
		) {
			return false;
		}

		if (
			reservada.token === 'TK_RES_HOSTNAME' &&
			tiposUsados.has('TK_RES_HOSTNAME')
		) {
			return false;
		}

		if (
			reservada.token === 'TK_RES_SSH' &&
			tiposUsados.has('TK_RES_SSH')
		) {
			return false;
		}

		if (
			bloqueActual === 'ROUTER' &&
			['TK_RES_VLAN', 'TK_RES_ACCESO'].includes(reservada.token)
		) {
			return false;
		}

		if (
			bloqueActual === 'SWITCH' &&
			['TK_RES_POOL', 'TK_RES_RED', 'TK_RES_GATEWAY', 'TK_RES_DNS', 'TK_RES_EXCLUIR', 'TK_RES_IP'].includes(reservada.token)
		) {
			return false;
		}

		return true;
	});
}

function obtenerTokensDelBloqueActual(tokensAntes) {
	const indiceInicioBloque = obtenerIndiceInicioBloqueActual(tokensAntes);

	if (indiceInicioBloque === -1) {
		return [];
	}

	return tokensAntes.slice(indiceInicioBloque + 1);
}

function obtenerUltimoIndice(tipos, tiposBuscados) {
	for (let indice = tipos.length - 1; indice >= 0; indice--) {
		if (tiposBuscados.includes(tipos[indice])) {
			return indice;
		}
	}

	return -1;
}

function buscarCandidatos(lexemas) {
	return lexemas
		.map(lexema => sugerenciasBase.find(sugerencia => sugerencia.texto === lexema))
		.filter(Boolean);
}

function eliminarSugerenciasDuplicadas(sugerencias) {
	const vistos = new Set();

	return sugerencias.filter(sugerencia => {
		if (vistos.has(sugerencia.texto)) {
			return false;
		}

		vistos.add(sugerencia.texto);
		return true;
	});
}

function mostrarAutocompletado() {
	contenedorAutocompletado.classList.remove('oculto');

	contenedorAutocompletado.innerHTML = estadoAutocompletado.sugerencias.map((sugerencia, indice) => {
		const claseActiva = indice === estadoAutocompletado.indiceSeleccionado ? ' activa' : '';

		return `
			<div class="opcion-autocompletado${claseActiva}" data-indice="${indice}">
				<strong>${escaparHtml(sugerencia.texto)}</strong>
			</div>
		`;
	}).join('');
}

function posicionarAutocompletado() {
	const posicion = obtenerPosicionCursor();

	contenedorAutocompletado.style.left = `${posicion.x}px`;
	contenedorAutocompletado.style.top = `${posicion.y}px`;
}

function obtenerPosicionCursor() {
	const textoHastaCursor = entradaCodigo.value.slice(0, entradaCodigo.selectionStart);
	const lineas = textoHastaCursor.split('\n');
	const renglonActual = lineas.length - 1;
	const columnaActual = lineas[lineas.length - 1].length;

	const anchoCaracter = 8.4;
	const altoLinea = 22;
	const padding = 14;

	let x = padding + (columnaActual * anchoCaracter) - entradaCodigo.scrollLeft;
	let y = padding + ((renglonActual + 1) * altoLinea) - entradaCodigo.scrollTop;

	x = Math.max(10, x);
	y = Math.max(10, y);

	return { x, y };
}

function moverSeleccionAutocompletado(cambio) {
	const total = estadoAutocompletado.sugerencias.length;

	if (!total) {
		return;
	}

	estadoAutocompletado.indiceSeleccionado += cambio;

	if (estadoAutocompletado.indiceSeleccionado < 0) {
		estadoAutocompletado.indiceSeleccionado = total - 1;
	}

	if (estadoAutocompletado.indiceSeleccionado >= total) {
		estadoAutocompletado.indiceSeleccionado = 0;
	}

	mostrarAutocompletado();
}

function aceptarAutocompletado(indice) {
	const sugerencia = estadoAutocompletado.sugerencias[indice];

	if (!sugerencia) {
		return;
	}

	const texto = entradaCodigo.value;
	const inicio = estadoAutocompletado.inicioPalabra;
	const fin = estadoAutocompletado.finPalabra;

	entradaCodigo.value = texto.slice(0, inicio) + sugerencia.texto + texto.slice(fin);

	const nuevaPosicion = inicio + sugerencia.texto.length;
	entradaCodigo.selectionStart = nuevaPosicion;
	entradaCodigo.selectionEnd = nuevaPosicion;

	ocultarAutocompletado();
	analizarCodigo();
	entradaCodigo.focus();
}

function ocultarAutocompletado() {
	estadoAutocompletado.visible = false;
	estadoAutocompletado.sugerencias = [];
	estadoAutocompletado.indiceSeleccionado = 0;
	contenedorAutocompletado.classList.add('oculto');
	contenedorAutocompletado.innerHTML = '';
}

function sugerirLexema(lexema) {
	const reservadaPegada = obtenerReservadaPegada(lexema);
	const reservadaParecida = obtenerReservadaParecida(lexema);

	if (reservadaPegada) {
		return `Separa la palabra reservada del resto del texto. Por ejemplo: "${reservadaPegada} ${lexema.slice(reservadaPegada.length)}".`;
	}

	if (reservadaParecida) {
		return `Tal vez quisiste escribir "${reservadaParecida}". Las palabras reservadas se aceptan en mayúsculas, minúsculas o combinadas.`;
	}

	if (lexema.includes('/')) {
		return 'Si querías escribir una interfaz, usa formatos como fa0/1, Gi0/0 o s0/0/0.';
	}

	return 'Revisa si el lexema debe ser una palabra reservada, un identificador o una interfaz válida.';
}

function calcularDistancia(a, b) {
	const matriz = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

	for (let i = 0; i <= a.length; i++) {
		matriz[i][0] = i;
	}

	for (let j = 0; j <= b.length; j++) {
		matriz[0][j] = j;
	}

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const costo = a[i - 1] === b[j - 1] ? 0 : 1;

			matriz[i][j] = Math.min(
				matriz[i - 1][j] + 1,
				matriz[i][j - 1] + 1,
				matriz[i - 1][j - 1] + costo
			);
		}
	}

	return matriz[a.length][b.length];
}

function escaparHtml(texto) {
	return String(texto)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}



// Extensión semántica de CiscoScript
function analizarCodigo() {
	const texto = entradaCodigo.value;
	const resultadoLexico = analizarLexico(texto);
	const resultadoSintactico = analizarSintactico(resultadoLexico.tokensValidos);
	const resultadoSemantico = resultadoSintactico.arbol
		? analizarSemantico(resultadoSintactico.arbol)
		: { errores: [], reglasEjecutadas: [] };

	const errores = [
		...resultadoLexico.errores,
		...resultadoSintactico.errores,
		...resultadoSemantico.errores
	];
	const tokensParaTabla = crearTokensParaTabla(resultadoLexico.tokens, errores);
	const hayErrores = errores.length > 0;

	actualizarNumerosRenglon(texto);
	actualizarResaltado(texto, errores, resultadoLexico.tokens);
	mostrarTokens(tokensParaTabla);
	mostrarErrores(errores);
	mostrarSugerencias(errores);
	mostrarResumen(tokensParaTabla, errores);
	mostrarArbol(hayErrores ? null : resultadoSintactico.arbol);
	mostrarReglasSemanticas(resultadoSemantico.reglasEjecutadas || []);
	actualizarAutocompletado();

	sincronizarDesplazamiento();
}

AnalizadorSintactico.prototype.analizarListaInstruccionesRouter = function() {
	const instrucciones = [];

	while (!this.coincide('TK_RES_FIN') && !this.coincide('TK_FNA')) {
		if (this.esInicioInstruccionRouter(this.tokenActual().tipo)) {
			const instruccion = this.analizarInstruccionRouter();

			if (instruccion) {
				instrucciones.push(instruccion);
			}
		} else {
			const token = this.tokenActual();

			this.registrarError({
				token,
				esperado: 'instrucción válida dentro de ROUTER',
				descripcion: this.obtenerDescripcionInstruccionFueraDeBloque(token.tipo, 'ROUTER'),
				sugerencia: 'Dentro de ROUTER usa basica, hostname, ssh, puerto con ip, pool o excluir.'
			});

			this.recuperarDentroDeBloque();
		}
	}

	return instrucciones;
};

AnalizadorSintactico.prototype.analizarListaInstruccionesSwitch = function() {
	const instrucciones = [];

	while (!this.coincide('TK_RES_FIN') && !this.coincide('TK_FNA')) {
		if (this.esInicioInstruccionSwitch(this.tokenActual().tipo)) {
			const instruccion = this.analizarInstruccionSwitch();

			if (instruccion) {
				instrucciones.push(instruccion);
			}
		} else {
			const token = this.tokenActual();

			this.registrarError({
				token,
				esperado: 'instrucción válida dentro de SWITCH',
				descripcion: this.obtenerDescripcionInstruccionFueraDeBloque(token.tipo, 'SWITCH'),
				sugerencia: 'Dentro de SWITCH usa basica, hostname, ssh, vlan o puerto con acceso.'
			});

			this.recuperarDentroDeBloque();
		}
	}

	return instrucciones;
};

AnalizadorSintactico.prototype.analizarConfiguracionPuertoRouter = function() {
	const nodo = crearNodo('ConfiguracionPuertoRouter');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'puerto de router',
		patron: [
			{ tipo: 'TK_RES_PUERTO' },
			{ tipo: 'TK_IFACE', nombre: 'interfaz' },
			{ tipo: 'TK_RES_IP' },
			{ tipo: 'TK_IP', nombre: 'ip' },
			{ tipo: 'TK_MASK', nombre: 'mascara' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La configuración de puerto en ROUTER solo acepta interfaz, ip y máscara en ese orden.',
		sugerenciaBase: 'Usa el formato: puerto g0/0 ip 192.168.1.1 /24.'
	});

	if (resultado.interfaz) {
		nodo.atributos.interfaz = resultado.interfaz.lexema;
		nodo.tokenInterfaz = resultado.interfaz;
	} else {
		nodo.atributos.interfaz = 'sin_interfaz';
	}

	if (resultado.ip) {
		nodo.atributos.ip = resultado.ip.lexema;
		nodo.tokenReferencia = resultado.ip;
		nodo.tokenIp = resultado.ip;
	} else {
		nodo.atributos.ip = 'sin_ip';
	}

	if (resultado.mascara) {
		nodo.atributos.mascara = resultado.mascara.lexema;
		nodo.tokenMascara = resultado.mascara;
	} else {
		nodo.atributos.mascara = 'sin_mascara';
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionPoolDhcp = function() {
	const nodo = crearNodo('ConfiguracionPoolDhcp');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'pool',
		patron: [
			{ tipo: 'TK_RES_POOL' },
			{ tipo: 'TK_ID', nombre: 'nombre' },
			{ tipo: 'TK_RES_RED' },
			{ tipo: 'TK_IP', nombre: 'red' },
			{ tipo: 'TK_MASK', nombre: 'mascara' },
			{ tipo: 'TK_RES_GATEWAY' },
			{ tipo: 'TK_IP', nombre: 'gateway' },
			{ tipo: 'TK_RES_DNS' },
			{ tipo: 'TK_IP', nombre: 'dns' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La instrucción pool solo acepta nombre, red, máscara, gateway y dns en ese orden.',
		sugerenciaBase: 'Usa el formato: pool LAN1 red 192.168.1.0 /24 gateway 192.168.1.1 dns 8.8.8.8.'
	});

	if (resultado.nombre) {
		nodo.atributos.nombre = resultado.nombre.lexema;
		nodo.tokenReferencia = resultado.nombre;
	} else {
		nodo.atributos.nombre = 'sin_nombre';
	}

	if (resultado.red) {
		nodo.atributos.red = resultado.red.lexema;
		nodo.tokenRed = resultado.red;
	} else {
		nodo.atributos.red = 'sin_red';
	}

	if (resultado.mascara) {
		nodo.atributos.mascara = resultado.mascara.lexema;
		nodo.tokenMascara = resultado.mascara;
	} else {
		nodo.atributos.mascara = 'sin_mascara';
	}

	if (resultado.gateway) {
		nodo.atributos.gateway = resultado.gateway.lexema;
		nodo.tokenGateway = resultado.gateway;
	} else {
		nodo.atributos.gateway = 'sin_gateway';
	}

	if (resultado.dns) {
		nodo.atributos.dns = resultado.dns.lexema;
		nodo.tokenDns = resultado.dns;
	} else {
		nodo.atributos.dns = 'sin_dns';
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionExcluirIp = function() {
	const nodo = crearNodo('ConfiguracionExcluirIp');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'excluir',
		patron: [
			{ tipo: 'TK_RES_EXCLUIR' },
			{ tipo: 'TK_IP', nombre: 'ipInicial' },
			{ tipo: 'TK_IP', nombre: 'ipFinal' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La instrucción excluir solo acepta dos direcciones IP.',
		sugerenciaBase: 'Usa el formato: excluir 192.168.1.1 192.168.1.10.'
	});

	if (resultado.ipInicial) {
		nodo.atributos.ipInicial = resultado.ipInicial.lexema;
		nodo.tokenReferencia = resultado.ipInicial;
		nodo.tokenIpInicial = resultado.ipInicial;
	} else {
		nodo.atributos.ipInicial = 'sin_ip_inicial';
	}

	if (resultado.ipFinal) {
		nodo.atributos.ipFinal = resultado.ipFinal.lexema;
		nodo.tokenIpFinal = resultado.ipFinal;
	} else {
		nodo.atributos.ipFinal = 'sin_ip_final';
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionVlan = function() {
	const nodo = crearNodo('ConfiguracionVlan');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'vlan',
		patron: [
			{ tipo: 'TK_RES_VLAN' },
			{ tipo: 'TK_NUM', nombre: 'numero' },
			{ tipo: 'TK_RES_NOMBRE' },
			{ tipo: 'TK_ID', nombre: 'nombre' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La instrucción vlan solo acepta número y nombre en ese orden.',
		sugerenciaBase: 'Usa el formato: vlan 10 nombre Ventas.'
	});

	if (resultado.numero) {
		nodo.atributos.numero = resultado.numero.lexema;
		nodo.tokenReferencia = resultado.numero;
		nodo.tokenNumero = resultado.numero;
	} else {
		nodo.atributos.numero = 'sin_numero';
	}

	if (resultado.nombre) {
		nodo.atributos.nombre = resultado.nombre.lexema;
	} else {
		nodo.atributos.nombre = 'sin_nombre';
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionPuertoSwitch = function() {
	const nodo = crearNodo('ConfiguracionPuertoSwitch');
	const sugerenciaBase = 'Usa el formato: puerto fa0/1 acceso 10 o puerto fa0/3-24, g0/2 acceso 1000.';
	const interfaces = [];
	let tokenInterfazPrincipal = null;
	let esperaInterfaz = true;

	this.consumir('TK_RES_PUERTO', 'La configuración de puerto de switch debe iniciar con puerto.');

	while (
		!this.coincide('TK_RES_ACCESO') &&
		!this.esTipoDetencion(this.tokenActual().tipo, this.obtenerTiposDetencionDentroDeBloque()) &&
		!this.coincide('TK_FNA')
	) {
		if (esperaInterfaz && this.coincide('TK_IFACE')) {
			const tokenInterfaz = this.avanzar();
			interfaces.push(tokenInterfaz);

			if (!tokenInterfazPrincipal) {
				tokenInterfazPrincipal = tokenInterfaz;
			}

			esperaInterfaz = false;
			continue;
		}

		if (!esperaInterfaz && this.coincide('TK_COMA')) {
			this.avanzar();
			esperaInterfaz = true;
			continue;
		}

		this.registrarError({
			token: this.tokenActual(),
			esperado: 'lista de interfaces de switch',
			descripcion: 'La lista de interfaces del puerto de SWITCH debe usar interfaces válidas separadas por coma.',
			sugerencia: sugerenciaBase
		});
		this.recuperarHastaSiguienteEstructura(this.obtenerTiposDetencionDentroDeBloque());
		break;
	}

	this.consumir('TK_RES_ACCESO', 'Después de la interfaz o lista de interfaces se esperaba acceso.');
	const tokenVlan = this.consumir('TK_NUM', 'Después de acceso se esperaba el número de VLAN.');

	if (interfaces.length) {
		const interfacesTexto = interfaces.map(function(token) {
			return token.lexema;
		});

		nodo.atributos.interfaz = interfacesTexto.join(', ');
		nodo.atributos.interfaces = expandirListaInterfacesSwitch(interfacesTexto);
		nodo.tokenReferencia = tokenInterfazPrincipal;
		nodo.tokenInterfaz = tokenInterfazPrincipal;
	} else {
		nodo.atributos.interfaz = 'sin_interfaz';
		nodo.atributos.interfaces = [];
	}

	if (tokenVlan) {
		nodo.atributos.vlan = tokenVlan.lexema;
		nodo.tokenVlan = tokenVlan;
	} else {
		nodo.atributos.vlan = 'sin_vlan';
	}

	this.validarFinInstruccionExtendida('puerto de switch', sugerenciaBase);
	return nodo;
};

AnalizadorSintactico.prototype.analizarSentenciaProbarPing = function() {
	const nodo = crearNodo('SentenciaProbarPing');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'probar ping',
		patron: [
			{ tipo: 'TK_RES_PROBAR' },
			{ tipo: 'TK_RES_PING' },
			{ tipo: 'TK_ID', nombre: 'origen' },
			{ tipo: 'TK_ID', nombre: 'destino' }
		],
		tiposDetencion: this.obtenerTiposDetencionNivelPrograma(),
		descripcionBase: 'La sentencia probar ping solo acepta la palabra ping y dos dispositivos.',
		sugerenciaBase: 'Usa el formato: probar ping PC1 PC2.'
	});

	if (resultado.origen) {
		nodo.atributos.origen = resultado.origen.lexema;
		nodo.tokenReferencia = resultado.origen;
		nodo.tokenOrigen = resultado.origen;
	} else {
		nodo.atributos.origen = 'sin_origen';
	}

	if (resultado.destino) {
		nodo.atributos.destino = resultado.destino.lexema;
		nodo.tokenDestino = resultado.destino;
	} else {
		nodo.atributos.destino = 'sin_destino';
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarSentenciaMostrarRedes = function() {
	const nodo = crearNodo('SentenciaMostrarRedes');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'mostrar redes',
		patron: [
			{ tipo: 'TK_RES_MOSTRAR', nombre: 'mostrar' },
			{ tipo: 'TK_RES_REDES' }
		],
		tiposDetencion: this.obtenerTiposDetencionNivelPrograma(),
		descripcionBase: 'La sentencia mostrar redes no acepta parámetros adicionales.',
		sugerenciaBase: 'La sentencia correcta es solamente: mostrar redes.'
	});

	if (resultado.mostrar) {
		nodo.tokenReferencia = resultado.mostrar;
	}

	return nodo;
};

function crearErrorSemantico(datos) {
	const token = datos.token || {
		lexema: '—',
		tipo: 'valor semántico',
		renglon: 1,
		columna: 1,
		inicioGlobal: 0,
		finGlobal: 0
	};

	return {
		tipo: `Semántico: ${datos.nombre}`,
		renglon: token.renglon,
		columna: token.columna,
		lexema: token.lexema,
		tokenEncontrado: token.tipo,
		tokenEsperado: datos.esperado,
		descripcion: datos.descripcion,
		sugerencia: datos.sugerencia,
		inicioGlobal: token.inicioGlobal,
		finGlobal: token.finGlobal
	};
}

function crearContextoSemantico(arbol) {
	const contexto = {
		arbol,
		dispositivos: [],
		routers: [],
		switches: [],
		pings: [],
		mostrarRedes: []
	};

	for (const nodo of arbol.hijos) {
		if (nodo.tipo === 'BloqueRouter') {
			const router = crearRegistroRouterSemantico(nodo);
			contexto.dispositivos.push(router);
			contexto.routers.push(router);
			continue;
		}

		if (nodo.tipo === 'BloqueSwitch') {
			const switchRegistro = crearRegistroSwitchSemantico(nodo);
			contexto.dispositivos.push(switchRegistro);
			contexto.switches.push(switchRegistro);
			continue;
		}

		if (nodo.tipo === 'SentenciaProbarPing') {
			contexto.pings.push(nodo);
			continue;
		}

		if (nodo.tipo === 'SentenciaMostrarRedes') {
			contexto.mostrarRedes.push(nodo);
		}
	}

	return contexto;
}

function crearRegistroRouterSemantico(bloque) {
	const router = {
		nodo: bloque,
		nombre: bloque.atributos.nombre || 'sin_nombre',
		tipoDispositivo: 'ROUTER',
		interfaces: [],
		puertosTroncales: [],
		subpuertos: [],
		pools: [],
		exclusiones: []
	};

	for (const instruccion of bloque.hijos) {
		if (instruccion.tipo === 'ConfiguracionPuertoRouter') {
			if (instruccion.atributos.modo === 'troncal') {
				router.puertosTroncales.push(instruccion);
			} else {
				router.interfaces.push(instruccion);
			}
		}

		if (instruccion.tipo === 'ConfiguracionSubpuertoRouter') {
			router.interfaces.push(instruccion);
			router.subpuertos.push(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionPoolDhcp') {
			router.pools.push(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionExcluirIp') {
			router.exclusiones.push(instruccion);
		}
	}

	return router;
}

function crearRegistroSwitchSemantico(bloque) {
	const switchRegistro = {
		nodo: bloque,
		nombre: bloque.atributos.nombre || 'sin_nombre',
		tipoDispositivo: 'SWITCH',
		vlans: [],
		puertosAcceso: [],
		troncales: [],
		administraciones: []
	};

	for (const instruccion of bloque.hijos) {
		if (instruccion.tipo === 'ConfiguracionVlan') {
			switchRegistro.vlans.push(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionPuertoSwitch') {
			switchRegistro.puertosAcceso.push(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionTroncalSwitch') {
			switchRegistro.troncales.push(instruccion);
		}

		if (instruccion.tipo === 'ConfiguracionAdministracionSwitch') {
			switchRegistro.administraciones.push(instruccion);
		}
	}

	return switchRegistro;
}

function esValorValido(valor, valorInvalido) {
	return valor && valor !== valorInvalido;
}

function ipANumero(ip) {
	const partes = ip.split('.').map(Number);
	return (((partes[0] * 256 + partes[1]) * 256 + partes[2]) * 256 + partes[3]) >>> 0;
}

function numeroAIp(numero) {
	return [
		(numero >>> 24) & 255,
		(numero >>> 16) & 255,
		(numero >>> 8) & 255,
		numero & 255
	].join('.');
}

function mascaraCidrANumero(mascara) {
	const bits = Number(String(mascara).replace('/', ''));

	if (bits === 0) {
		return 0;
	}

	return (0xffffffff << (32 - bits)) >>> 0;
}

function obtenerInformacionRed(ip, mascara) {
	if (!esIpValida(ip) || !expresionMascara.test(mascara)) {
		return null;
	}

	const ipNumero = ipANumero(ip);
	const mascaraNumero = mascaraCidrANumero(mascara);
	const redNumero = (ipNumero & mascaraNumero) >>> 0;
	const broadcastNumero = (redNumero | (~mascaraNumero >>> 0)) >>> 0;

	return {
		ip,
		mascara,
		red: numeroAIp(redNumero),
		broadcast: numeroAIp(broadcastNumero),
		redNumero,
		broadcastNumero,
		ipNumero
	};
}

function ipPerteneceARed(ip, red, mascara) {
	const informacionRed = obtenerInformacionRed(red, mascara);

	if (!informacionRed || !esIpValida(ip)) {
		return false;
	}

	const ipNumero = ipANumero(ip);
	return ipNumero >= informacionRed.redNumero && ipNumero <= informacionRed.broadcastNumero;
}

function rangosSeCruzan(inicioA, finA, inicioB, finB) {
	return inicioA <= finB && inicioB <= finA;
}

function obtenerInterfacesRouterConIp(contexto) {
	const registros = [];

	for (const router of contexto.routers) {
		for (const interfaz of router.interfaces) {
			if (!esValorValido(interfaz.atributos.ip, 'sin_ip') || !esValorValido(interfaz.atributos.mascara, 'sin_mascara')) {
				continue;
			}

			registros.push({
				dispositivo: router.nombre,
				tipoDispositivo: router.tipoDispositivo,
				interfaz: interfaz.atributos.interfaz || 'sin_interfaz',
				ip: interfaz.atributos.ip,
				mascara: interfaz.atributos.mascara,
				nodo: interfaz
			});
		}
	}

	return registros;
}

function obtenerIpsRouter(contexto) {
	const registros = obtenerInterfacesRouterConIp(contexto);
	const ips = [];

	for (const registro of registros) {
		ips.push(registro.ip);
	}

	return ips;
}

function buscarRouterPorIp(contexto, ip) {
	const registros = obtenerInterfacesRouterConIp(contexto);

	for (const registro of registros) {
		if (registro.ip === ip) {
			return registro;
		}
	}

	return null;
}

function routerTieneIp(router, ip) {
	for (const interfaz of router.interfaces) {
		if (interfaz.atributos.ip === ip) {
			return true;
		}
	}

	return false;
}

function obtenerVlansSwitch(switchRegistro) {
	const vlans = new Set();

	for (const vlan of switchRegistro.vlans) {
		if (esValorValido(vlan.atributos.numero, 'sin_numero')) {
			vlans.add(vlan.atributos.numero);
		}
	}

	return vlans;
}

function obtenerListaVlansTroncal(troncal) {
	if (!troncal.atributos.vlansPermitidas) {
		return [];
	}

	const vlans = troncal.atributos.vlansPermitidas.split(',');
	const resultado = [];

	for (const vlan of vlans) {
		const valor = vlan.trim();

		if (valor) {
			resultado.push(valor);
		}
	}

	return resultado;
}

function obtenerInterfazPadre(interfaz) {
	return String(interfaz || '').split('.')[0];
}

function expandirListaInterfacesSwitch(interfacesTexto) {
	const interfaces = [];

	for (const interfazTexto of interfacesTexto) {
		const interfacesExpandidas = expandirInterfazSwitch(interfazTexto);

		for (const interfazExpandida of interfacesExpandidas) {
			interfaces.push(interfazExpandida);
		}
	}

	return interfaces;
}

function expandirInterfazSwitch(interfaz) {
	const coincidencia = String(interfaz || '').match(/^((fa|Fa|g|Gi)\d+\/)(\d+)-(\d+)$/);

	if (!coincidencia) {
		return [interfaz];
	}

	const prefijo = coincidencia[1];
	const inicio = Number(coincidencia[3]);
	const fin = Number(coincidencia[4]);

	if (inicio > fin) {
		return [interfaz];
	}

	const interfaces = [];

	for (let numero = inicio; numero <= fin; numero++) {
		interfaces.push(`${prefijo}${numero}`);
	}

	return interfaces;
}

function obtenerInterfacesConfiguracionSwitch(configuracionInterfaz) {
	if (!configuracionInterfaz || !configuracionInterfaz.atributos) {
		return [];
	}

	if (Array.isArray(configuracionInterfaz.atributos.interfaces)) {
		return configuracionInterfaz.atributos.interfaces;
	}

	if (!esValorValido(configuracionInterfaz.atributos.interfaz, 'sin_interfaz')) {
		return [];
	}

	return expandirInterfazSwitch(configuracionInterfaz.atributos.interfaz);
}


// Extensión de tokens y sintaxis para subpuertos, troncales, helper y administración
const palabrasReservadasRealistas = {
	subpuerto: 'TK_RES_SUBPUERTO',
	troncal: 'TK_RES_TRONCAL',
	nativa: 'TK_RES_NATIVA',
	vlans: 'TK_RES_VLANS',
	helper: 'TK_RES_HELPER',
	administracion: 'TK_RES_ADMINISTRACION',
	sin_ip: 'TK_RES_SIN_IP'
};

for (const lexema in palabrasReservadasRealistas) {
	if (!Object.prototype.hasOwnProperty.call(palabrasReservadasRealistas, lexema)) {
		continue;
	}

	const token = palabrasReservadasRealistas[lexema];
	palabrasReservadas[lexema] = token;
	palabrasReservadasNormalizadas[lexema.toLowerCase()] = {
		lexema,
		token
	};
	descripcionesTokens[token] = 'Palabra reservada';
	lexemasEsperados[token] = lexema;
}

descripcionesTokens.TK_COMA = 'Símbolo';
lexemasEsperados.TK_COMA = ',';

sugerenciasBase.push(
	{ texto: 'subpuerto', detalle: 'router-on-a-stick' },
	{ texto: 'troncal', detalle: 'enlace trunk' },
	{ texto: 'nativa', detalle: 'vlan nativa' },
	{ texto: 'vlans', detalle: 'vlans permitidas' },
	{ texto: 'helper', detalle: 'dhcp relay' },
	{ texto: 'administracion', detalle: 'switch' },
	{ texto: 'sin_ip', detalle: 'router' }
);

const analizarLexicoOriginalSemantica = analizarLexico;
analizarLexico = function(texto) {
	const resultado = analizarLexicoOriginalSemantica(texto);
	const tokensReconstruidos = [];
	const erroresFiltrados = [];

	for (const token of resultado.tokens) {
		if (token.tipo === 'TK_ERROR' && token.lexema === ',') {
			tokensReconstruidos.push(crearToken('TK_COMA', ',', token.renglon, token.columna, token.inicioGlobal, token.finGlobal));
			continue;
		}

		tokensReconstruidos.push(token);
	}

	for (const error of resultado.errores) {
		if (error.lexema === ',') {
			continue;
		}

		erroresFiltrados.push(error);
	}

	return {
		tokens: tokensReconstruidos,
		tokensValidos: tokensReconstruidos.filter(function(token) {
			return token.tipo !== 'TK_ERROR' && token.tipo !== 'TK_COMENTARIO';
		}),
		errores: erroresFiltrados
	};
};

AnalizadorSintactico.prototype.esInicioInstruccionRouter = function(tipo) {
	return [
		'TK_RES_BASICA',
		'TK_RES_HOSTNAME',
		'TK_RES_SSH',
		'TK_RES_PUERTO',
		'TK_RES_SUBPUERTO',
		'TK_RES_POOL',
		'TK_RES_EXCLUIR'
	].includes(tipo);
};

AnalizadorSintactico.prototype.esInicioInstruccionSwitch = function(tipo) {
	return [
		'TK_RES_BASICA',
		'TK_RES_HOSTNAME',
		'TK_RES_SSH',
		'TK_RES_VLAN',
		'TK_RES_PUERTO',
		'TK_RES_TRONCAL',
		'TK_RES_ADMINISTRACION'
	].includes(tipo);
};

AnalizadorSintactico.prototype.obtenerTiposDetencionDentroDeBloque = function() {
	return [
		'TK_RES_BASICA',
		'TK_RES_HOSTNAME',
		'TK_RES_SSH',
		'TK_RES_PUERTO',
		'TK_RES_SUBPUERTO',
		'TK_RES_POOL',
		'TK_RES_EXCLUIR',
		'TK_RES_VLAN',
		'TK_RES_TRONCAL',
		'TK_RES_ADMINISTRACION',
		'TK_RES_FIN',
		'TK_RES_ROUTER',
		'TK_RES_SWITCH',
		'TK_RES_PROBAR',
		'TK_RES_MOSTRAR',
		'TK_RES_VERIFICAR',
		'TK_FNA'
	];
};

AnalizadorSintactico.prototype.obtenerTiposDetencionEncabezado = function() {
	return this.obtenerTiposDetencionDentroDeBloque();
};

AnalizadorSintactico.prototype.analizarInstruccionRouter = function() {
	const tipo = this.tokenActual().tipo;

	if (tipo === 'TK_RES_BASICA') {
		return this.analizarConfiguracionBasica();
	}

	if (tipo === 'TK_RES_HOSTNAME') {
		return this.analizarConfiguracionHostname();
	}

	if (tipo === 'TK_RES_SSH') {
		return this.analizarConfiguracionSsh();
	}

	if (tipo === 'TK_RES_PUERTO') {
		return this.analizarConfiguracionPuertoRouter();
	}

	if (tipo === 'TK_RES_SUBPUERTO') {
		return this.analizarConfiguracionSubpuertoRouter();
	}

	if (tipo === 'TK_RES_POOL') {
		return this.analizarConfiguracionPoolDhcp();
	}

	if (tipo === 'TK_RES_EXCLUIR') {
		return this.analizarConfiguracionExcluirIp();
	}

	this.avanzar();
	return null;
};

AnalizadorSintactico.prototype.analizarInstruccionSwitch = function() {
	const tipo = this.tokenActual().tipo;

	if (tipo === 'TK_RES_BASICA') {
		return this.analizarConfiguracionBasica();
	}

	if (tipo === 'TK_RES_HOSTNAME') {
		return this.analizarConfiguracionHostname();
	}

	if (tipo === 'TK_RES_SSH') {
		return this.analizarConfiguracionSsh();
	}

	if (tipo === 'TK_RES_VLAN') {
		return this.analizarConfiguracionVlan();
	}

	if (tipo === 'TK_RES_PUERTO') {
		return this.analizarConfiguracionPuertoSwitch();
	}

	if (tipo === 'TK_RES_TRONCAL') {
		return this.analizarConfiguracionTroncalSwitch();
	}

	if (tipo === 'TK_RES_ADMINISTRACION') {
		return this.analizarConfiguracionAdministracionSwitch();
	}

	this.avanzar();
	return null;
};

AnalizadorSintactico.prototype.validarFinInstruccionExtendida = function(nombreEstructura, sugerenciaBase) {
	const tokenExtra = this.tokenActual();

	if (!this.esTipoDetencion(tokenExtra.tipo, this.obtenerTiposDetencionDentroDeBloque()) && tokenExtra.tipo !== 'TK_FNA') {
		this.registrarError({
			token: tokenExtra,
			esperado: `fin de la instrucción ${nombreEstructura}`,
			descripcion: `La estructura "${nombreEstructura}" recibió un parámetro extra o fuera de lugar: "${tokenExtra.lexema}".`,
			sugerencia: sugerenciaBase
		});

		this.recuperarHastaSiguienteEstructura(this.obtenerTiposDetencionDentroDeBloque());
	}
};

AnalizadorSintactico.prototype.analizarConfiguracionPuertoRouter = function() {
	const nodo = crearNodo('ConfiguracionPuertoRouter');
	const sugerenciaBase = 'Usa: puerto g0/0 ip 192.168.1.1 /24, puerto g0/0 ip 192.168.1.1 /24 helper 10.0.0.1, puerto g0/1 troncal o puerto g0/1 sin_ip.';

	this.consumir('TK_RES_PUERTO', 'La configuración de puerto debe iniciar con puerto.');
	const tokenInterfaz = this.consumir('TK_IFACE', 'Después de puerto se esperaba una interfaz.');

	if (tokenInterfaz) {
		nodo.atributos.interfaz = tokenInterfaz.lexema;
		nodo.tokenInterfaz = tokenInterfaz;
		nodo.tokenReferencia = tokenInterfaz;
	} else {
		nodo.atributos.interfaz = 'sin_interfaz';
	}

	if (this.coincide('TK_RES_TRONCAL')) {
		this.avanzar();
		nodo.atributos.modo = 'troncal';
		nodo.atributos.ip = 'sin_ip';
		nodo.atributos.mascara = 'sin_mascara';
		this.validarFinInstruccionExtendida('puerto de router', sugerenciaBase);
		return nodo;
	}

	if (this.coincide('TK_RES_SIN_IP')) {
		this.avanzar();
		nodo.atributos.modo = 'sin_ip';
		nodo.atributos.ip = 'sin_ip';
		nodo.atributos.mascara = 'sin_mascara';
		this.validarFinInstruccionExtendida('puerto de router', sugerenciaBase);
		return nodo;
	}

	this.consumir('TK_RES_IP', 'Después de la interfaz se esperaba ip, troncal o sin_ip.');
	const tokenIp = this.consumir('TK_IP', 'Después de ip se esperaba una dirección IPv4.');
	const tokenMascara = this.consumir('TK_MASK', 'Después de la IP se esperaba una máscara CIDR.');

	if (tokenIp) {
		nodo.atributos.ip = tokenIp.lexema;
		nodo.tokenIp = tokenIp;
		nodo.tokenReferencia = tokenIp;
	} else {
		nodo.atributos.ip = 'sin_ip';
	}

	if (tokenMascara) {
		nodo.atributos.mascara = tokenMascara.lexema;
		nodo.tokenMascara = tokenMascara;
	} else {
		nodo.atributos.mascara = 'sin_mascara';
	}

	if (this.coincide('TK_RES_HELPER')) {
		this.avanzar();
		const tokenHelper = this.consumir('TK_IP', 'Después de helper se esperaba una IP de servidor DHCP.');

		if (tokenHelper) {
			nodo.atributos.helper = tokenHelper.lexema;
			nodo.tokenHelper = tokenHelper;
		}
	}

	this.validarFinInstruccionExtendida('puerto de router', sugerenciaBase);
	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionSubpuertoRouter = function() {
	const nodo = crearNodo('ConfiguracionSubpuertoRouter');
	const sugerenciaBase = 'Usa: subpuerto g0/1.50 vlan 50 ip 180.10.3.129 /26, subpuerto g0/1.50 vlan 50 ip 180.10.3.129 /26 helper 10.0.0.1 o subpuerto g0/1.99 vlan 99 nativa.';

	this.consumir('TK_RES_SUBPUERTO', 'La configuración de subpuerto debe iniciar con subpuerto.');
	const tokenInterfaz = this.consumir('TK_IFACE', 'Después de subpuerto se esperaba una subinterfaz, por ejemplo g0/1.50.');
	this.consumir('TK_RES_VLAN', 'Después de la subinterfaz se esperaba vlan.');
	const tokenVlan = this.consumir('TK_NUM', 'Después de vlan se esperaba el número de VLAN.');

	if (tokenInterfaz) {
		nodo.atributos.interfaz = tokenInterfaz.lexema;
		nodo.tokenInterfaz = tokenInterfaz;
		nodo.tokenReferencia = tokenInterfaz;
	} else {
		nodo.atributos.interfaz = 'sin_interfaz';
	}

	if (tokenVlan) {
		nodo.atributos.vlan = tokenVlan.lexema;
		nodo.tokenVlan = tokenVlan;
	} else {
		nodo.atributos.vlan = 'sin_vlan';
	}

	if (this.coincide('TK_RES_NATIVA')) {
		this.avanzar();
		nodo.atributos.modo = 'nativa';
		nodo.atributos.ip = 'sin_ip';
		nodo.atributos.mascara = 'sin_mascara';
		this.validarFinInstruccionExtendida('subpuerto de router', sugerenciaBase);
		return nodo;
	}

	this.consumir('TK_RES_IP', 'Después de vlan se esperaba ip o nativa.');
	const tokenIp = this.consumir('TK_IP', 'Después de ip se esperaba una dirección IPv4.');
	const tokenMascara = this.consumir('TK_MASK', 'Después de la IP se esperaba una máscara CIDR.');

	if (tokenIp) {
		nodo.atributos.ip = tokenIp.lexema;
		nodo.tokenIp = tokenIp;
	} else {
		nodo.atributos.ip = 'sin_ip';
	}

	if (tokenMascara) {
		nodo.atributos.mascara = tokenMascara.lexema;
		nodo.tokenMascara = tokenMascara;
	} else {
		nodo.atributos.mascara = 'sin_mascara';
	}

	if (this.coincide('TK_RES_HELPER')) {
		this.avanzar();
		const tokenHelper = this.consumir('TK_IP', 'Después de helper se esperaba una IP de servidor DHCP.');

		if (tokenHelper) {
			nodo.atributos.helper = tokenHelper.lexema;
			nodo.tokenHelper = tokenHelper;
		}
	}

	this.validarFinInstruccionExtendida('subpuerto de router', sugerenciaBase);
	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionTroncalSwitch = function() {
	const nodo = crearNodo('ConfiguracionTroncalSwitch');
	const sugerenciaBase = 'Usa el formato: troncal g0/1 nativa 99 vlans 50,90,98,99.';

	this.consumir('TK_RES_TRONCAL', 'La configuración troncal debe iniciar con troncal.');
	const tokenInterfaz = this.consumir('TK_IFACE', 'Después de troncal se esperaba una interfaz.');
	this.consumir('TK_RES_NATIVA', 'Después de la interfaz se esperaba nativa.');
	const tokenVlanNativa = this.consumir('TK_NUM', 'Después de nativa se esperaba el número de VLAN nativa.');
	this.consumir('TK_RES_VLANS', 'Después de la VLAN nativa se esperaba vlans.');

	const vlans = [];
	let tokenVlansPermitidas = null;
	let esperaNumero = true;

	while (!this.esTipoDetencion(this.tokenActual().tipo, this.obtenerTiposDetencionDentroDeBloque()) && !this.coincide('TK_FNA')) {
		if (esperaNumero && this.coincide('TK_NUM')) {
			const tokenNumero = this.avanzar();
			vlans.push(tokenNumero.lexema);

			if (!tokenVlansPermitidas) {
				tokenVlansPermitidas = tokenNumero;
			}

			esperaNumero = false;
			continue;
		}

		if (!esperaNumero && this.coincide('TK_COMA')) {
			this.avanzar();
			esperaNumero = true;
			continue;
		}

		this.registrarError({
			token: this.tokenActual(),
			esperado: 'lista de VLANs separadas por coma',
			descripcion: 'La lista de VLANs permitidas debe usar números separados por coma.',
			sugerencia: sugerenciaBase
		});
		this.recuperarHastaSiguienteEstructura(this.obtenerTiposDetencionDentroDeBloque());
		break;
	}

	if (tokenInterfaz) {
		nodo.atributos.interfaz = tokenInterfaz.lexema;
		nodo.tokenInterfaz = tokenInterfaz;
		nodo.tokenReferencia = tokenInterfaz;
	} else {
		nodo.atributos.interfaz = 'sin_interfaz';
	}

	if (tokenVlanNativa) {
		nodo.atributos.vlanNativa = tokenVlanNativa.lexema;
		nodo.tokenVlanNativa = tokenVlanNativa;
	} else {
		nodo.atributos.vlanNativa = 'sin_vlan_nativa';
	}

	nodo.atributos.vlansPermitidas = vlans.join(',');
	nodo.tokenVlansPermitidas = tokenVlansPermitidas;

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionAdministracionSwitch = function() {
	const nodo = crearNodo('ConfiguracionAdministracionSwitch');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'administracion de switch',
		patron: [
			{ tipo: 'TK_RES_ADMINISTRACION' },
			{ tipo: 'TK_RES_VLAN' },
			{ tipo: 'TK_NUM', nombre: 'vlan' },
			{ tipo: 'TK_RES_IP' },
			{ tipo: 'TK_IP', nombre: 'ip' },
			{ tipo: 'TK_MASK', nombre: 'mascara' },
			{ tipo: 'TK_RES_GATEWAY' },
			{ tipo: 'TK_IP', nombre: 'gateway' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La administración de SWITCH acepta vlan, ip, máscara y gateway en ese orden.',
		sugerenciaBase: 'Usa el formato: administracion vlan 98 ip 180.10.4.2 /30 gateway 180.10.4.1.'
	});

	if (resultado.vlan) {
		nodo.atributos.vlan = resultado.vlan.lexema;
		nodo.tokenVlan = resultado.vlan;
		nodo.tokenReferencia = resultado.vlan;
	} else {
		nodo.atributos.vlan = 'sin_vlan';
	}

	if (resultado.ip) {
		nodo.atributos.ip = resultado.ip.lexema;
		nodo.tokenIp = resultado.ip;
	} else {
		nodo.atributos.ip = 'sin_ip';
	}

	if (resultado.mascara) {
		nodo.atributos.mascara = resultado.mascara.lexema;
		nodo.tokenMascara = resultado.mascara;
	} else {
		nodo.atributos.mascara = 'sin_mascara';
	}

	if (resultado.gateway) {
		nodo.atributos.gateway = resultado.gateway.lexema;
		nodo.tokenGateway = resultado.gateway;
	} else {
		nodo.atributos.gateway = 'sin_gateway';
	}

	return nodo;
};

const obtenerClaseResaltadoTokenOriginalSemantica = obtenerClaseResaltadoToken;
obtenerClaseResaltadoToken = function(tipoToken) {
	if (tipoToken === 'TK_COMA') {
		return 'token-simbolo-resaltado';
	}

	return obtenerClaseResaltadoTokenOriginalSemantica(tipoToken);
};
function generarReglasSemanticasEjecutadas(contexto) {
	const reglas = [];
	let paso = 0;

	function agregarRegla(descripcion, nivel = 0) {
		paso++;
		const tabulacion = '\t'.repeat(nivel);
		reglas.push(`${tabulacion}p${paso} ${descripcion}`);
	}

	agregarRegla('Programa.sem = iniciarAnalisisSemantico()');

	for (const dispositivo of contexto.dispositivos) {
		agregarRegla(`Dispositivo.lexema=${dispositivo.tipoDispositivo}<${dispositivo.nombre}>; insertar(${dispositivo.nombre}) en tablaDispositivos`, 1);

		const instrucciones = Array.isArray(dispositivo.nodo.hijos) ? dispositivo.nodo.hijos : [];

		for (const instruccion of instrucciones) {
			if (instruccion.tipo === 'ConfiguracionBasica') {
				agregarRegla(`${dispositivo.nombre}.basica=true; generarConfiguracionBasica(${dispositivo.nombre})`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionHostname') {
				agregarRegla(`${dispositivo.nombre}.hostname=${instruccion.atributos.nombre}; validarHostname(${instruccion.atributos.nombre})`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionSsh') {
				agregarRegla(`${dispositivo.nombre}.ssh={usuario:${instruccion.atributos.usuario}, dominio:${instruccion.atributos.dominio}}; validarCredencialesSsh()`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPuertoRouter') {
				if (instruccion.atributos.modo === 'troncal') {
					agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.modo=troncal; registrarPuertoTroncalRouter()`, 2);
					continue;
				}

				if (instruccion.atributos.modo === 'sin_ip') {
					agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.ip=null; registrarPuertoSinIp()`, 2);
					continue;
				}

				agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.red=calcularRed(${instruccion.atributos.ip}, ${instruccion.atributos.mascara}); validarIpInterfazRouter()`, 2);

				if (instruccion.atributos.helper) {
					agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.helper=${instruccion.atributos.helper}; validarHelperAddress()`, 3);
				}

				continue;
			}

			if (instruccion.tipo === 'ConfiguracionSubpuertoRouter') {
				if (instruccion.atributos.modo === 'nativa') {
					agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.vlanNativa=${instruccion.atributos.vlan}; validarSubpuertoNativo()`, 2);
					continue;
				}

				agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.encapsulation=dot1q(${instruccion.atributos.vlan}); calcularRedSubpuerto(${instruccion.atributos.ip}, ${instruccion.atributos.mascara})`, 2);

				if (instruccion.atributos.helper) {
					agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.helper=${instruccion.atributos.helper}; validarHelperAddress()`, 3);
				}

				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPoolDhcp') {
				agregarRegla(`${dispositivo.nombre}.pool[${instruccion.atributos.nombre}].red=${instruccion.atributos.red}${instruccion.atributos.mascara}; validarPoolDhcp()`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionExcluirIp') {
				agregarRegla(`${dispositivo.nombre}.excluir=${instruccion.atributos.ipInicial}-${instruccion.atributos.ipFinal}; validarRangoExclusion()`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionVlan') {
				agregarRegla(`${dispositivo.nombre}.vlan[${instruccion.atributos.numero}]=${instruccion.atributos.nombre}; insertarVlan(${instruccion.atributos.numero})`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPuertoSwitch') {
				const interfaces = obtenerInterfacesConfiguracionSwitch(instruccion).join(', ');
				agregarRegla(`${dispositivo.nombre}.puertosAcceso={${interfaces}} -> vlan ${instruccion.atributos.vlan}; validarVlanAcceso()`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionTroncalSwitch') {
				agregarRegla(`${dispositivo.nombre}.${instruccion.atributos.interfaz}.troncal={nativa:${instruccion.atributos.vlanNativa}, permitidas:${instruccion.atributos.vlansPermitidas}}; validarTroncal()`, 2);
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionAdministracionSwitch') {
				agregarRegla(`${dispositivo.nombre}.administracion=vlan ${instruccion.atributos.vlan}, ip ${instruccion.atributos.ip}${instruccion.atributos.mascara}; validarGatewayAdministracion()`, 2);
			}
		}
	}

	if (contexto.dispositivos.length > 0) {
		agregarRegla('validacionesGlobales(tablaDispositivos, routers, switches)', 1);
		agregarRegla('validarIdentificadoresDispositivosUnicos(tablaDispositivos)', 2);
	}

	if (contexto.routers.length > 0) {
		agregarRegla('validacionesRouters(routers)', 1);
		agregarRegla('validarInterfacesRouterRepetidas(routers)', 2);
		agregarRegla('validarDireccionesIpDuplicadas(interfacesRouter, administracionesSwitch)', 2);
		agregarRegla('validarRedesTraslapadasEnInterfacesRouter(routers)', 2);
	}

	if (contexto.switches.length > 0) {
		agregarRegla('validacionesSwitches(switches)', 1);
		agregarRegla('validarInterfacesSwitchRepetidas(switches)', 2);
		agregarRegla('validarVlansDuplicadas(switches)', 2);
	}

	if (contexto.routers.some(router => router.pools.length > 0)) {
		agregarRegla('validacionesDhcp(routers)', 1);
		agregarRegla('validarPoolsDhcp(routers): gateway, red base, helper y relación con interfaz', 2);
	}

	if (contexto.routers.some(router => router.exclusiones.length > 0)) {
		agregarRegla('validarExclusionesDhcp(routers): rango dentro del pool, repetido, cruzado o invertido', 2);
	}

	if (contexto.switches.some(switchRegistro => switchRegistro.puertosAcceso.length > 0)) {
		agregarRegla('validarPuertosAccesoContraVlansDeclaradas(switches)', 2);
	}

	if (contexto.switches.some(switchRegistro => switchRegistro.troncales.length > 0) || contexto.routers.some(router => router.subpuertos.length > 0)) {
		agregarRegla('validacionesTroncales(routerOnAStick)', 1);
		agregarRegla('validarRelacionTroncalSubpuertos(routerOnAStick)', 2);
	}

	if (contexto.switches.some(switchRegistro => switchRegistro.administraciones.length > 0)) {
		agregarRegla('validacionesAdministracionSwitch(switches)', 1);
		agregarRegla('validarAdministracionSwitch(switches): vlan, gateway y red de administración', 2);
	}

	for (const ping of contexto.pings) {
		agregarRegla(`sentenciaPing(origen:${ping.atributos.origen}, destino:${ping.atributos.destino})`, 1);
		agregarRegla(`validarPing(origen:${ping.atributos.origen}, destino:${ping.atributos.destino})`, 2);
	}

	if (contexto.mostrarRedes.length > 0) {
		agregarRegla('sentenciaMostrarRedes()', 1);
		agregarRegla('mostrarRedes=construirResumenRedes(interfaces, pools, administraciones)', 2);
	}

	return reglas;
}

function analizarSemantico(arbol) {
	const errores = [];
	const reglasEjecutadas = [];

	if (!arbol || !Array.isArray(arbol.hijos)) {
		return { errores, reglasEjecutadas };
	}

	const contexto = crearContextoSemantico(arbol);
	reglasEjecutadas.push(...generarReglasSemanticasEjecutadas(contexto));

	validarIdentificadorDispositivoDuplicado(contexto, errores);
	validarInterfazRouterRepetida(contexto, errores);
	validarInterfazSwitchRepetida(contexto, errores);
	validarDireccionIpDuplicada(contexto, errores);
	validarNombrePoolDhcpRepetido(contexto, errores);
	validarVlanDuplicada(contexto, errores);
	validarPuertoAsignadoAVlanInexistente(contexto, errores);
	validarGatewayFueraDeRedPoolDhcp(contexto, errores);
	validarGatewayNoConfiguradoEnInterfazRouter(contexto, errores);
	validarPoolDhcpSinInterfazRelacionada(contexto, errores);
	validarIpExcluidaFueraDelPoolDhcp(contexto, errores);
	validarRangoExclusionInvertido(contexto, errores);
	validarRangoExclusionRepetido(contexto, errores);
	validarRangoExclusionCruzado(contexto, errores);
	validarDireccionRedUsadaComoIpInterfaz(contexto, errores);
	validarDireccionBroadcastUsadaComoIpInterfaz(contexto, errores);
	validarDireccionRedPoolDhcpMalCalculada(contexto, errores);
	validarRedesTraslapadasEnInterfacesRouter(contexto, errores);
	validarOrigenPingInexistente(contexto, errores);
	validarDestinoPingInexistente(contexto, errores);
	validarPingEntreDispositivosSinIp(contexto, errores);
	validarMostrarRedesSinRedesConfiguradas(contexto, errores);
	validarSubinterfazConVlanNoRelacionadaATroncal(contexto, errores);
	validarVlanNativaInexistenteEnSwitch(contexto, errores);
	validarVlanPermitidaInexistenteEnSwitch(contexto, errores);
	validarHelperAddressApuntandoARouterInexistente(contexto, errores);
	validarVlanAdministracionInexistenteEnSwitch(contexto, errores);
	validarGatewayAdministracionSwitchFueraDeLaRed(contexto, errores);
	validarGatewayAdministracionSwitchNoExisteEnTopologia(contexto, errores);

	return { errores, reglasEjecutadas };
}

//--1. Identificador de dispositivo duplicado
function validarIdentificadorDispositivoDuplicado(contexto, errores) {
	const identificadores = new Map();

	for (const dispositivo of contexto.dispositivos) {
		if (!esValorValido(dispositivo.nombre, 'sin_nombre')) {
			continue;
		}

		const clave = dispositivo.nombre.toLowerCase();

		if (identificadores.has(clave)) {
			const anterior = identificadores.get(clave);
			errores.push(crearErrorSemantico({
				nombre: 'Identificador de dispositivo duplicado',
				token: dispositivo.nodo.tokenReferencia,
				esperado: 'identificador de dispositivo único',
				descripcion: `El identificador "${dispositivo.nombre}" ya fue usado en un ${anterior.tipoDispositivo}.`,
				sugerencia: `Cambia el identificador "${dispositivo.nombre}" por otro nombre, por ejemplo ${sugerirNombreDispositivo(dispositivo.nombre)}.`
			}));
			continue;
		}

		identificadores.set(clave, dispositivo);
	}
}

//--2. Interfaz de router repetida
function validarInterfazRouterRepetida(contexto, errores) {
	for (const router of contexto.routers) {
		const interfaces = new Map();

		for (const interfaz of router.interfaces.concat(router.puertosTroncales)) {
			if (!esValorValido(interfaz.atributos.interfaz, 'sin_interfaz')) {
				continue;
			}

			const clave = interfaz.atributos.interfaz.toLowerCase();

			if (interfaces.has(clave)) {
				errores.push(crearErrorSemantico({
					nombre: 'Interfaz de router repetida',
					token: interfaz.tokenInterfaz || interfaz.tokenReferencia,
					esperado: 'interfaz de router no repetida',
					descripcion: `La interfaz ${interfaz.atributos.interfaz} ya fue configurada en el ROUTER ${router.nombre}.`,
					sugerencia: `Usa otra interfaz o elimina la configuración repetida de ${interfaz.atributos.interfaz}.`
				}));
				continue;
			}

			interfaces.set(clave, interfaz);
		}
	}
}

//--3. Interfaz de switch repetida
function validarInterfazSwitchRepetida(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const interfaces = new Map();
		const interfacesSwitch = switchRegistro.puertosAcceso.concat(switchRegistro.troncales);

		for (const configuracionInterfaz of interfacesSwitch) {
			const interfacesConfiguradas = obtenerInterfacesConfiguracionSwitch(configuracionInterfaz);

			for (const nombreInterfaz of interfacesConfiguradas) {
				const clave = nombreInterfaz.toLowerCase();

				if (interfaces.has(clave)) {
					errores.push(crearErrorSemantico({
						nombre: 'Interfaz de switch repetida',
						token: configuracionInterfaz.tokenInterfaz || configuracionInterfaz.tokenReferencia,
						esperado: 'interfaz de switch no repetida',
						descripcion: `La interfaz ${nombreInterfaz} ya fue configurada en el SWITCH ${switchRegistro.nombre}.`,
						sugerencia: `Usa otro puerto o elimina la configuración repetida de ${nombreInterfaz}.`
					}));
					continue;
				}

				interfaces.set(clave, configuracionInterfaz);
			}
		}
	}
}

//--4. Dirección IP duplicada
function validarDireccionIpDuplicada(contexto, errores) {
	const direcciones = new Map();
	const registrosRouter = obtenerInterfacesRouterConIp(contexto);

	for (const registro of registrosRouter) {
		if (direcciones.has(registro.ip)) {
			const anterior = direcciones.get(registro.ip);
			errores.push(crearErrorSemantico({
				nombre: 'Dirección IP duplicada',
				token: registro.nodo.tokenIp || registro.nodo.tokenReferencia,
				esperado: 'dirección IP única',
				descripcion: `La IP ${registro.ip} ya fue asignada al ${anterior.tipoDispositivo} ${anterior.dispositivo}, en la interfaz ${anterior.interfaz}.`,
				sugerencia: `Asigna una IP diferente a la interfaz ${registro.interfaz} del ${registro.tipoDispositivo} ${registro.dispositivo}.`
			}));
			continue;
		}

		direcciones.set(registro.ip, registro);
	}

	for (const switchRegistro of contexto.switches) {
		for (const administracion of switchRegistro.administraciones) {
			const ip = administracion.atributos.ip;

			if (!esValorValido(ip, 'sin_ip')) {
				continue;
			}

			if (direcciones.has(ip)) {
				const anterior = direcciones.get(ip);
				errores.push(crearErrorSemantico({
					nombre: 'Dirección IP duplicada',
					token: administracion.tokenIp || administracion.tokenReferencia,
					esperado: 'dirección IP única',
					descripcion: `La IP ${ip} ya fue asignada al ${anterior.tipoDispositivo} ${anterior.dispositivo}.`,
					sugerencia: `Asigna otra IP de administración al SWITCH ${switchRegistro.nombre}.`
				}));
				continue;
			}

			direcciones.set(ip, {
				dispositivo: switchRegistro.nombre,
				tipoDispositivo: 'SWITCH',
				interfaz: `vlan ${administracion.atributos.vlan}`,
				ip,
				nodo: administracion
			});
		}
	}
}

//--5. Nombre de pool DHCP repetido
function validarNombrePoolDhcpRepetido(contexto, errores) {
	for (const router of contexto.routers) {
		const pools = new Map();

		for (const pool of router.pools) {
			if (!esValorValido(pool.atributos.nombre, 'sin_nombre')) {
				continue;
			}

			const clave = pool.atributos.nombre.toLowerCase();

			if (pools.has(clave)) {
				errores.push(crearErrorSemantico({
					nombre: 'Nombre de pool DHCP repetido',
					token: pool.tokenReferencia,
					esperado: 'nombre de pool DHCP único',
					descripcion: `El pool ${pool.atributos.nombre} ya existe dentro del ROUTER ${router.nombre}.`,
					sugerencia: `Usa otro nombre de pool o elimina el pool repetido ${pool.atributos.nombre}.`
				}));
				continue;
			}

			pools.set(clave, pool);
		}
	}
}

//--6. VLAN duplicada
function validarVlanDuplicada(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const vlans = new Map();

		for (const vlan of switchRegistro.vlans) {
			if (!esValorValido(vlan.atributos.numero, 'sin_numero')) {
				continue;
			}

			if (vlans.has(vlan.atributos.numero)) {
				errores.push(crearErrorSemantico({
					nombre: 'VLAN duplicada',
					token: vlan.tokenNumero || vlan.tokenReferencia,
					esperado: 'VLAN única dentro del switch',
					descripcion: `La VLAN ${vlan.atributos.numero} ya fue declarada en el SWITCH ${switchRegistro.nombre}.`,
					sugerencia: `Usa otro número de VLAN o elimina la VLAN repetida ${vlan.atributos.numero}.`
				}));
				continue;
			}

			vlans.set(vlan.atributos.numero, vlan);
		}
	}
}

//--7. Puerto asignado a una VLAN inexistente
function validarPuertoAsignadoAVlanInexistente(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const vlans = obtenerVlansSwitch(switchRegistro);

		for (const puerto of switchRegistro.puertosAcceso) {
			const vlan = puerto.atributos.vlan;

			if (!esValorValido(vlan, 'sin_vlan')) {
				continue;
			}

			if (!vlans.has(vlan)) {
				errores.push(crearErrorSemantico({
					nombre: 'Puerto asignado a una VLAN inexistente',
					token: puerto.tokenVlan || puerto.tokenReferencia,
					esperado: 'VLAN declarada en el switch',
					descripcion: `El puerto ${puerto.atributos.interfaz} usa la VLAN ${vlan}, pero esa VLAN no fue declarada en el SWITCH ${switchRegistro.nombre}.`,
					sugerencia: `Declara la VLAN ${vlan} antes de asignarla al puerto ${puerto.atributos.interfaz}.`
				}));
			}
		}
	}
}

//--8. Gateway fuera de la red del pool DHCP
function validarGatewayFueraDeRedPoolDhcp(contexto, errores) {
	for (const router of contexto.routers) {
		for (const pool of router.pools) {
			const red = pool.atributos.red;
			const mascara = pool.atributos.mascara;
			const gateway = pool.atributos.gateway;

			if (!esValorValido(red, 'sin_red') || !esValorValido(mascara, 'sin_mascara') || !esValorValido(gateway, 'sin_gateway')) {
				continue;
			}

			if (!ipPerteneceARed(gateway, red, mascara)) {
				errores.push(crearErrorSemantico({
					nombre: 'Gateway fuera de la red del pool DHCP',
					token: pool.tokenGateway,
					esperado: 'gateway dentro de la red del pool',
					descripcion: `El gateway ${gateway} no pertenece a la red ${red}${mascara} del pool ${pool.atributos.nombre}.`,
					sugerencia: `Usa un gateway que pertenezca a ${red}${mascara}.`
				}));
			}
		}
	}
}

//--9. Gateway no configurado en una interfaz del router
function validarGatewayNoConfiguradoEnInterfazRouter(contexto, errores) {
	for (const router of contexto.routers) {
		for (const pool of router.pools) {
			const gateway = pool.atributos.gateway;

			if (!esValorValido(gateway, 'sin_gateway')) {
				continue;
			}

			if (!buscarRouterPorIp(contexto, gateway)) {
				errores.push(crearErrorSemantico({
					nombre: 'Gateway no configurado en una interfaz del router',
					token: pool.tokenGateway,
					esperado: 'gateway configurado en alguna interfaz de router',
					descripcion: `El gateway ${gateway} del pool ${pool.atributos.nombre} no está configurado en ninguna interfaz o subinterfaz de router de la topología.`,
					sugerencia: `Configura ${gateway} en el router que será la puerta de enlace de esa red.`
				}));
			}
		}
	}
}

//--10. Pool DHCP sin interfaz relacionada
function validarPoolDhcpSinInterfazRelacionada(contexto, errores) {
	for (const routerDhcp of contexto.routers) {
		for (const pool of routerDhcp.pools) {
			const gateway = pool.atributos.gateway;

			if (!esValorValido(gateway, 'sin_gateway')) {
				continue;
			}

			const registroGateway = buscarRouterPorIp(contexto, gateway);

			if (!registroGateway) {
				continue;
			}

			if (registroGateway.dispositivo === routerDhcp.nombre) {
				continue;
			}

			const helper = registroGateway.nodo.atributos.helper;

			if (!helper || !routerTieneIp(routerDhcp, helper)) {
				errores.push(crearErrorSemantico({
					nombre: 'Pool DHCP sin interfaz relacionada',
					token: registroGateway.nodo.tokenHelper || pool.tokenReferencia || pool.tokenGateway,
					esperado: 'helper hacia el router que declara el pool',
					descripcion: `El pool ${pool.atributos.nombre} está declarado en ${routerDhcp.nombre}, pero su gateway ${gateway} pertenece a ${registroGateway.dispositivo} y no hay helper hacia el servidor DHCP.`,
					sugerencia: `Agrega helper en ${registroGateway.interfaz} apuntando a una IP del ROUTER ${routerDhcp.nombre}.`
				}));
			}
		}
	}
}

//--11. IP excluida fuera del pool DHCP
function validarIpExcluidaFueraDelPoolDhcp(contexto, errores) {
	for (const router of contexto.routers) {
		for (const exclusion of router.exclusiones) {
			const ipInicial = exclusion.atributos.ipInicial;
			const ipFinal = exclusion.atributos.ipFinal;

			if (!esValorValido(ipInicial, 'sin_ip_inicial') || !esValorValido(ipFinal, 'sin_ip_final')) {
				continue;
			}

			let perteneceAPool = false;

			for (const pool of router.pools) {
				if (
					esValorValido(pool.atributos.red, 'sin_red') &&
					esValorValido(pool.atributos.mascara, 'sin_mascara') &&
					ipPerteneceARed(ipInicial, pool.atributos.red, pool.atributos.mascara) &&
					ipPerteneceARed(ipFinal, pool.atributos.red, pool.atributos.mascara)
				) {
					perteneceAPool = true;
					break;
				}
			}

			if (!perteneceAPool) {
				errores.push(crearErrorSemantico({
					nombre: 'IP excluida fuera del pool DHCP',
					token: exclusion.tokenReferencia,
					esperado: 'rango dentro de algún pool DHCP del router',
					descripcion: `El rango ${ipInicial} - ${ipFinal} no pertenece a ningún pool DHCP declarado en el ROUTER ${router.nombre}.`,
					sugerencia: 'Ajusta el rango excluir para que pertenezca a la red de un pool DHCP existente.'
				}));
			}
		}
	}
}

//--12. Rango de exclusión invertido
function validarRangoExclusionInvertido(contexto, errores) {
	for (const router of contexto.routers) {
		for (const exclusion of router.exclusiones) {
			const ipInicial = exclusion.atributos.ipInicial;
			const ipFinal = exclusion.atributos.ipFinal;

			if (!esValorValido(ipInicial, 'sin_ip_inicial') || !esValorValido(ipFinal, 'sin_ip_final')) {
				continue;
			}

			if (ipANumero(ipInicial) > ipANumero(ipFinal)) {
				errores.push(crearErrorSemantico({
					nombre: 'Rango de exclusión invertido',
					token: exclusion.tokenReferencia,
					esperado: 'IP inicial menor o igual que IP final',
					descripcion: `El rango de exclusión está invertido: ${ipInicial} es mayor que ${ipFinal}.`,
					sugerencia: `Escribe primero la IP menor y después la mayor: excluir ${ipFinal} ${ipInicial}.`
				}));
			}
		}
	}
}

//--13. Rango de exclusión repetido
function validarRangoExclusionRepetido(contexto, errores) {
	for (const router of contexto.routers) {
		const rangos = new Map();

		for (const exclusion of router.exclusiones) {
			const ipInicial = exclusion.atributos.ipInicial;
			const ipFinal = exclusion.atributos.ipFinal;

			if (!esValorValido(ipInicial, 'sin_ip_inicial') || !esValorValido(ipFinal, 'sin_ip_final')) {
				continue;
			}

			const clave = `${ipInicial}-${ipFinal}`;

			if (rangos.has(clave)) {
				errores.push(crearErrorSemantico({
					nombre: 'Rango de exclusión repetido',
					token: exclusion.tokenReferencia,
					esperado: 'rango de exclusión no repetido',
					descripcion: `El rango ${ipInicial} - ${ipFinal} ya fue declarado en el ROUTER ${router.nombre}.`,
					sugerencia: 'Elimina uno de los rangos repetidos.'
				}));
				continue;
			}

			rangos.set(clave, exclusion);
		}
	}
}

//--14. Rango de exclusión cruzado
function validarRangoExclusionCruzado(contexto, errores) {
	for (const router of contexto.routers) {
		const rangos = [];

		for (const exclusion of router.exclusiones) {
			const ipInicial = exclusion.atributos.ipInicial;
			const ipFinal = exclusion.atributos.ipFinal;

			if (!esValorValido(ipInicial, 'sin_ip_inicial') || !esValorValido(ipFinal, 'sin_ip_final')) {
				continue;
			}

			const inicio = ipANumero(ipInicial);
			const fin = ipANumero(ipFinal);

			for (const rangoAnterior of rangos) {
				if (rangosSeCruzan(inicio, fin, rangoAnterior.inicio, rangoAnterior.fin)) {
					errores.push(crearErrorSemantico({
						nombre: 'Rango de exclusión cruzado',
						token: exclusion.tokenReferencia,
						esperado: 'rangos de exclusión separados',
						descripcion: `El rango ${ipInicial} - ${ipFinal} se cruza con el rango ${rangoAnterior.ipInicial} - ${rangoAnterior.ipFinal}.`,
						sugerencia: 'Ajusta los rangos para que no compartan direcciones IP.'
					}));
					break;
				}
			}

			rangos.push({ inicio, fin, ipInicial, ipFinal });
		}
	}
}

//--15. Dirección de red usada como IP de interfaz
function validarDireccionRedUsadaComoIpInterfaz(contexto, errores) {
	const registros = obtenerInterfacesRouterConIp(contexto);

	for (const registro of registros) {
		const informacionRed = obtenerInformacionRed(registro.ip, registro.mascara);

		if (!informacionRed) {
			continue;
		}

		if (registro.ip === informacionRed.red) {
			errores.push(crearErrorSemantico({
				nombre: 'Dirección de red usada como IP de interfaz',
				token: registro.nodo.tokenIp || registro.nodo.tokenReferencia,
				esperado: 'IP de host válida',
				descripcion: `La IP ${registro.ip} no puede asignarse a una interfaz porque es la dirección de red de ${informacionRed.red}${registro.mascara}.`,
				sugerencia: `Usa una IP de host dentro de la red, por ejemplo una diferente a ${informacionRed.red}.`
			}));
		}
	}
}

//--16. Dirección broadcast usada como IP de interfaz
function validarDireccionBroadcastUsadaComoIpInterfaz(contexto, errores) {
	const registros = obtenerInterfacesRouterConIp(contexto);

	for (const registro of registros) {
		const informacionRed = obtenerInformacionRed(registro.ip, registro.mascara);

		if (!informacionRed) {
			continue;
		}

		if (registro.ip === informacionRed.broadcast) {
			errores.push(crearErrorSemantico({
				nombre: 'Dirección broadcast usada como IP de interfaz',
				token: registro.nodo.tokenIp || registro.nodo.tokenReferencia,
				esperado: 'IP de host válida',
				descripcion: `La IP ${registro.ip} no puede asignarse a una interfaz porque es la dirección broadcast de ${informacionRed.red}${registro.mascara}.`,
				sugerencia: `Usa una IP de host diferente al broadcast ${informacionRed.broadcast}.`
			}));
		}
	}
}

//--17. Dirección de red del pool DHCP mal calculada
function validarDireccionRedPoolDhcpMalCalculada(contexto, errores) {
	for (const router of contexto.routers) {
		for (const pool of router.pools) {
			const red = pool.atributos.red;
			const mascara = pool.atributos.mascara;

			if (!esValorValido(red, 'sin_red') || !esValorValido(mascara, 'sin_mascara')) {
				continue;
			}

			const informacionRed = obtenerInformacionRed(red, mascara);

			if (!informacionRed) {
				continue;
			}

			if (red !== informacionRed.red) {
				errores.push(crearErrorSemantico({
					nombre: 'Dirección de red del pool DHCP mal calculada',
					token: pool.tokenRed,
					esperado: 'dirección base de la subred',
					descripcion: `La dirección ${red}${mascara} no corresponde a la red base. La red correcta sería ${informacionRed.red}${mascara}.`,
					sugerencia: `Cambia la red del pool por ${informacionRed.red}${mascara}.`
				}));
			}
		}
	}
}

//--18. Redes traslapadas en interfaces del router
function validarRedesTraslapadasEnInterfacesRouter(contexto, errores) {
	for (const router of contexto.routers) {
		const redes = [];

		for (const interfaz of router.interfaces) {
			if (!esValorValido(interfaz.atributos.ip, 'sin_ip') || !esValorValido(interfaz.atributos.mascara, 'sin_mascara')) {
				continue;
			}

			const informacionRed = obtenerInformacionRed(interfaz.atributos.ip, interfaz.atributos.mascara);

			if (!informacionRed) {
				continue;
			}

			for (const redAnterior of redes) {
				if (rangosSeCruzan(informacionRed.redNumero, informacionRed.broadcastNumero, redAnterior.redNumero, redAnterior.broadcastNumero)) {
					errores.push(crearErrorSemantico({
						nombre: 'Redes traslapadas en interfaces del router',
						token: interfaz.tokenIp || interfaz.tokenReferencia,
						esperado: 'redes de interfaces separadas',
						descripcion: `La red ${informacionRed.red}${interfaz.atributos.mascara} de ${interfaz.atributos.interfaz} se traslapa con ${redAnterior.red}${redAnterior.mascara}.`,
						sugerencia: 'Ajusta las máscaras o direcciones para que las interfaces pertenezcan a redes diferentes.'
					}));
					break;
				}
			}

			redes.push({
				red: informacionRed.red,
				mascara: interfaz.atributos.mascara,
				redNumero: informacionRed.redNumero,
				broadcastNumero: informacionRed.broadcastNumero
			});
		}
	}
}

//--19. Origen de ping inexistente
function validarOrigenPingInexistente(contexto, errores) {
	const dispositivos = new Set();

	for (const dispositivo of contexto.dispositivos) {
		dispositivos.add(dispositivo.nombre.toLowerCase());
	}

	for (const ping of contexto.pings) {
		const origen = ping.atributos.origen;

		if (!esValorValido(origen, 'sin_origen')) {
			continue;
		}

		if (!dispositivos.has(origen.toLowerCase())) {
			errores.push(crearErrorSemantico({
				nombre: 'Origen de ping inexistente',
				token: ping.tokenOrigen || ping.tokenReferencia,
				esperado: 'dispositivo origen existente',
				descripcion: `El origen del ping ${origen} no existe en la topología.`,
				sugerencia: `Declara un ROUTER o SWITCH llamado ${origen}, o cambia el origen del ping.`
			}));
		}
	}
}

//--20. Destino de ping inexistente
function validarDestinoPingInexistente(contexto, errores) {
	const dispositivos = new Set();

	for (const dispositivo of contexto.dispositivos) {
		dispositivos.add(dispositivo.nombre.toLowerCase());
	}

	for (const ping of contexto.pings) {
		const destino = ping.atributos.destino;

		if (!esValorValido(destino, 'sin_destino')) {
			continue;
		}

		if (!dispositivos.has(destino.toLowerCase())) {
			errores.push(crearErrorSemantico({
				nombre: 'Destino de ping inexistente',
				token: ping.tokenDestino || ping.tokenReferencia,
				esperado: 'dispositivo destino existente',
				descripcion: `El destino del ping ${destino} no existe en la topología.`,
				sugerencia: `Declara un ROUTER o SWITCH llamado ${destino}, o cambia el destino del ping.`
			}));
		}
	}
}

//--21. Ping entre dispositivos sin IP
function validarPingEntreDispositivosSinIp(contexto, errores) {
	for (const ping of contexto.pings) {
		const origen = buscarDispositivoPorNombre(contexto, ping.atributos.origen);
		const destino = buscarDispositivoPorNombre(contexto, ping.atributos.destino);

		if (!origen || !destino) {
			continue;
		}

		if (!dispositivoTieneIp(origen) || !dispositivoTieneIp(destino)) {
			errores.push(crearErrorSemantico({
				nombre: 'Ping entre dispositivos sin IP',
				token: ping.tokenReferencia,
				esperado: 'origen y destino con IP configurada',
				descripcion: `No se puede probar ping entre ${ping.atributos.origen} y ${ping.atributos.destino} porque uno o ambos dispositivos no tienen IP configurada.`,
				sugerencia: 'Configura al menos una IP en cada dispositivo antes de probar ping.'
			}));
		}
	}
}

function buscarDispositivoPorNombre(contexto, nombre) {
	if (!nombre) {
		return null;
	}

	for (const dispositivo of contexto.dispositivos) {
		if (dispositivo.nombre.toLowerCase() === nombre.toLowerCase()) {
			return dispositivo;
		}
	}

	return null;
}

function dispositivoTieneIp(dispositivo) {
	if (dispositivo.tipoDispositivo === 'ROUTER') {
		for (const interfaz of dispositivo.interfaces) {
			if (esValorValido(interfaz.atributos.ip, 'sin_ip')) {
				return true;
			}
		}
	}

	if (dispositivo.tipoDispositivo === 'SWITCH') {
		for (const administracion of dispositivo.administraciones) {
			if (esValorValido(administracion.atributos.ip, 'sin_ip')) {
				return true;
			}
		}
	}

	return false;
}

//--22. mostrar redes sin redes configuradas
function validarMostrarRedesSinRedesConfiguradas(contexto, errores) {
	if (!contexto.mostrarRedes.length) {
		return;
	}

	let existenRedes = false;

	for (const router of contexto.routers) {
		if (router.interfaces.length || router.pools.length) {
			existenRedes = true;
			break;
		}
	}

	if (!existenRedes) {
		for (const switchRegistro of contexto.switches) {
			if (switchRegistro.administraciones.length) {
				existenRedes = true;
				break;
			}
		}
	}

	if (existenRedes) {
		return;
	}

	for (const mostrar of contexto.mostrarRedes) {
		errores.push(crearErrorSemantico({
			nombre: 'mostrar redes sin redes configuradas',
			token: mostrar.tokenReferencia,
			esperado: 'redes configuradas para mostrar',
			descripcion: 'Se pidió mostrar redes, pero no hay interfaces, administraciones o pools desde donde obtener redes.',
			sugerencia: 'Configura al menos una interfaz con IP o un pool DHCP antes de usar mostrar redes.'
		}));
	}
}

//--23. Subinterfaz con VLAN no relacionada a troncal
function validarSubinterfazConVlanNoRelacionadaATroncal(contexto, errores) {
	for (const router of contexto.routers) {
		const troncales = new Set();

		for (const puertoTroncal of router.puertosTroncales) {
			if (esValorValido(puertoTroncal.atributos.interfaz, 'sin_interfaz')) {
				troncales.add(puertoTroncal.atributos.interfaz.toLowerCase());
			}
		}

		for (const subpuerto of router.subpuertos) {
			const interfazPadre = obtenerInterfazPadre(subpuerto.atributos.interfaz);

			if (!troncales.has(interfazPadre.toLowerCase())) {
				errores.push(crearErrorSemantico({
					nombre: 'Subinterfaz con VLAN no relacionada a troncal',
					token: subpuerto.tokenInterfaz || subpuerto.tokenReferencia,
					esperado: 'puerto padre declarado como troncal',
					descripcion: `El subpuerto ${subpuerto.atributos.interfaz} usa VLAN ${subpuerto.atributos.vlan}, pero el puerto padre ${interfazPadre} no está declarado como troncal en el ROUTER ${router.nombre}.`,
					sugerencia: `Agrega puerto ${interfazPadre} troncal antes de declarar subpuertos sobre esa interfaz.`
				}));
			}
		}
	}
}

//--24. VLAN nativa inexistente en switch
function validarVlanNativaInexistenteEnSwitch(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const vlans = obtenerVlansSwitch(switchRegistro);

		for (const troncal of switchRegistro.troncales) {
			const vlanNativa = troncal.atributos.vlanNativa;

			if (!esValorValido(vlanNativa, 'sin_vlan_nativa')) {
				continue;
			}

			if (!vlans.has(vlanNativa)) {
				errores.push(crearErrorSemantico({
					nombre: 'VLAN nativa inexistente en switch',
					token: troncal.tokenVlanNativa || troncal.tokenReferencia,
					esperado: 'VLAN nativa declarada en el switch',
					descripcion: `La troncal ${troncal.atributos.interfaz} usa la VLAN nativa ${vlanNativa}, pero esa VLAN no fue declarada en el SWITCH ${switchRegistro.nombre}.`,
					sugerencia: `Declara la VLAN ${vlanNativa} antes de usarla como nativa.`
				}));
			}
		}
	}
}

//--25. VLAN permitida inexistente en switch
function validarVlanPermitidaInexistenteEnSwitch(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const vlans = obtenerVlansSwitch(switchRegistro);

		for (const troncal of switchRegistro.troncales) {
			const vlansPermitidas = obtenerListaVlansTroncal(troncal);

			for (const vlan of vlansPermitidas) {
				if (!vlans.has(vlan)) {
					errores.push(crearErrorSemantico({
						nombre: 'VLAN permitida inexistente en switch',
						token: troncal.tokenVlansPermitidas || troncal.tokenReferencia,
						esperado: 'VLAN permitida declarada en el switch',
						descripcion: `La troncal ${troncal.atributos.interfaz} permite la VLAN ${vlan}, pero esa VLAN no fue declarada en el SWITCH ${switchRegistro.nombre}.`,
						sugerencia: `Declara la VLAN ${vlan} o elimínala de la lista de VLANs permitidas.`
					}));
				}
			}
		}
	}
}

//--26. Helper-address apuntando a un router inexistente
function validarHelperAddressApuntandoARouterInexistente(contexto, errores) {
	const ipsRouter = obtenerIpsRouter(contexto);

	for (const router of contexto.routers) {
		for (const interfaz of router.interfaces) {
			const helper = interfaz.atributos.helper;

			if (!helper) {
				continue;
			}

			if (!ipsRouter.includes(helper)) {
				errores.push(crearErrorSemantico({
					nombre: 'Helper-address apuntando a un router inexistente',
					token: interfaz.tokenHelper || interfaz.tokenReferencia,
					esperado: 'helper hacia una IP de router existente',
					descripcion: `El helper ${helper} de la interfaz ${interfaz.atributos.interfaz} no corresponde a ninguna IP de router declarada en la topología.`,
					sugerencia: 'Corrige el helper para que apunte a una IP existente del router servidor DHCP.'
				}));
			}
		}
	}
}

//--27. VLAN de administración inexistente en switch
function validarVlanAdministracionInexistenteEnSwitch(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		const vlans = obtenerVlansSwitch(switchRegistro);

		for (const administracion of switchRegistro.administraciones) {
			const vlan = administracion.atributos.vlan;

			if (!esValorValido(vlan, 'sin_vlan')) {
				continue;
			}

			if (!vlans.has(vlan)) {
				errores.push(crearErrorSemantico({
					nombre: 'VLAN de administración inexistente en switch',
					token: administracion.tokenVlan || administracion.tokenReferencia,
					esperado: 'VLAN de administración declarada en el switch',
					descripcion: `La administración del SWITCH ${switchRegistro.nombre} usa la VLAN ${vlan}, pero esa VLAN no fue declarada.`,
					sugerencia: `Declara la VLAN ${vlan} antes de usarla para administración.`
				}));
			}
		}
	}
}

//--28. Gateway de administración del switch fuera de la red
function validarGatewayAdministracionSwitchFueraDeLaRed(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		for (const administracion of switchRegistro.administraciones) {
			const ip = administracion.atributos.ip;
			const mascara = administracion.atributos.mascara;
			const gateway = administracion.atributos.gateway;

			if (!esValorValido(ip, 'sin_ip') || !esValorValido(mascara, 'sin_mascara') || !esValorValido(gateway, 'sin_gateway')) {
				continue;
			}

			if (!ipPerteneceARed(gateway, ip, mascara)) {
				errores.push(crearErrorSemantico({
					nombre: 'Gateway de administración del switch fuera de la red',
					token: administracion.tokenGateway || administracion.tokenReferencia,
					esperado: 'gateway dentro de la red de administración',
					descripcion: `El gateway ${gateway} no pertenece a la red de la IP administrativa ${ip}${mascara} del SWITCH ${switchRegistro.nombre}.`,
					sugerencia: 'Usa un gateway que pertenezca a la misma red de administración del switch.'
				}));
			}
		}
	}
}

//--29. Gateway de administración del switch no existe en la topología
function validarGatewayAdministracionSwitchNoExisteEnTopologia(contexto, errores) {
	for (const switchRegistro of contexto.switches) {
		for (const administracion of switchRegistro.administraciones) {
			const gateway = administracion.atributos.gateway;

			if (!esValorValido(gateway, 'sin_gateway')) {
				continue;
			}

			if (!buscarRouterPorIp(contexto, gateway)) {
				errores.push(crearErrorSemantico({
					nombre: 'Gateway de administración del switch no existe en la topología',
					token: administracion.tokenGateway || administracion.tokenReferencia,
					esperado: 'gateway configurado como IP de router',
					descripcion: `El gateway de administración ${gateway} del SWITCH ${switchRegistro.nombre} no está configurado en ningún router de la topología.`,
					sugerencia: `Configura ${gateway} en una interfaz o subinterfaz de router.`
				}));
			}
		}
	}
}


// A partir de aquí empieza lo de los recorridos, talba de simbolos y codigo 3 direcciones

const botonPestanaRecorridos = document.querySelector('#botonPestanaRecorridos');
const panelSalidaRecorridos = document.querySelector('#panelSalidaRecorridos');
const salidaPreOrden = document.querySelector('#salidaPreOrden');
const salidaInOrden = document.querySelector('#salidaInOrden');
const salidaPostOrden = document.querySelector('#salidaPostOrden');
const botonPestanaCodigoTresDirecciones = document.querySelector('#botonPestanaCodigoTresDirecciones');
const panelSalidaCodigoTresDirecciones = document.querySelector('#panelSalidaCodigoTresDirecciones');
const salidaCodigoTresDirecciones = document.querySelector('#salidaCodigoTresDirecciones');
const botonPestanaTablaSimbolos = document.querySelector('#botonPestanaTablaSimbolos');
const panelSalidaTablaSimbolos = document.querySelector('#panelSalidaTablaSimbolos');
const cuerpoTablaSimbolos = document.querySelector('#cuerpoTablaSimbolos');

cambiarPestanaSalida = function(pestanaActiva) {
	const pestanas = [
		{ nombre: 'arbol', boton: botonPestanaArbol, panel: panelSalidaArbol },
		{ nombre: 'recorridos', boton: botonPestanaRecorridos, panel: panelSalidaRecorridos },
		{ nombre: 'codigoTresDirecciones', boton: botonPestanaCodigoTresDirecciones, panel: panelSalidaCodigoTresDirecciones },
		{ nombre: 'tablaSimbolos', boton: botonPestanaTablaSimbolos, panel: panelSalidaTablaSimbolos },
		{ nombre: 'semantica', boton: botonPestanaSemantica, panel: panelSalidaSemantica },
	];

	for (const pestana of pestanas) {
		const estaActiva = pestana.nombre === pestanaActiva;

		if (pestana.boton) {
			pestana.boton.classList.toggle('activo', estaActiva);
			pestana.boton.setAttribute('aria-selected', String(estaActiva));
		}

		if (pestana.panel) {
			pestana.panel.classList.toggle('oculto', !estaActiva);
		}
	}
};

botonPestanaRecorridos.addEventListener('click', () => cambiarPestanaSalida('recorridos'));

botonPestanaCodigoTresDirecciones.addEventListener('click', () => cambiarPestanaSalida('codigoTresDirecciones'));

botonPestanaTablaSimbolos.addEventListener('click', () => cambiarPestanaSalida('tablaSimbolos'));

function crearArbolParaRecorridos(nodo) {
	if (!nodo) {
		return null;
	}

	const hijos = [];
	const atributos = nodo.atributos || {};

	for (const [nombre, valor] of Object.entries(atributos)) {
		if (nombre === 'interfaces' && atributos.interfaz) {
			continue;
		}

		if (valor === undefined || valor === null || valor === '') {
			continue;
		}

		const valorTexto = Array.isArray(valor) ? valor.join(', ') : String(valor);
		hijos.push({
			etiqueta: `${nombre} = ${valorTexto}`,
			hijos: []
		});
	}

	for (const hijo of nodo.hijos || []) {
		const hijoConvertido = crearArbolParaRecorridos(hijo);

		if (hijoConvertido) {
			hijos.push(hijoConvertido);
		}
	}

	return {
		etiqueta: nodo.tipo,
		hijos
	};
}

function recorrerPreOrden(nodo, recorrido) {
	if (!nodo) {
		return;
	}

	recorrido.push(nodo.etiqueta);

	for (const hijo of nodo.hijos) {
		recorrerPreOrden(hijo, recorrido);
	}
}

function recorrerInOrdenNArio(nodo, recorrido) {
	if (!nodo) {
		return;
	}

	if (!nodo.hijos.length) {
		recorrido.push(nodo.etiqueta);
		return;
	}

	recorrerInOrdenNArio(nodo.hijos[0], recorrido);
	recorrido.push(nodo.etiqueta);

	for (let indice = 1; indice < nodo.hijos.length; indice++) {
		recorrerInOrdenNArio(nodo.hijos[indice], recorrido);
	}
}

function recorrerPostOrden(nodo, recorrido) {
	if (!nodo) {
		return;
	}

	for (const hijo of nodo.hijos) {
		recorrerPostOrden(hijo, recorrido);
	}

	recorrido.push(nodo.etiqueta);
}

function generarRecorridosAst(arbol) {
	const arbolRecorridos = crearArbolParaRecorridos(arbol);
	const preOrden = [];
	const inOrden = [];
	const postOrden = [];

	recorrerPreOrden(arbolRecorridos, preOrden);
	recorrerInOrdenNArio(arbolRecorridos, inOrden);
	recorrerPostOrden(arbolRecorridos, postOrden);

	return {
		preOrden,
		inOrden,
		postOrden
	};
}

function formatearRecorrido(recorrido) {
	return recorrido
		.map((etiqueta, indice) => `${indice + 1}. ${etiqueta}`)
		.join('\n');
}

function mostrarRecorridos(arbol, puedeGenerarse) {
	if (!salidaPreOrden || !salidaInOrden || !salidaPostOrden) {
		return;
	}

	if (!entradaCodigo.value.trim()) {
		salidaPreOrden.textContent = 'Sin recorrido generado.';
		salidaInOrden.textContent = 'Sin recorrido generado.';
		salidaPostOrden.textContent = 'Sin recorrido generado.';
		return;
	}

	if (!puedeGenerarse || !arbol) {
		const mensaje = 'No se generó el recorrido porque existen errores léxicos o sintácticos.';
		salidaPreOrden.textContent = mensaje;
		salidaInOrden.textContent = mensaje;
		salidaPostOrden.textContent = mensaje;
		return;
	}

	const recorridos = generarRecorridosAst(arbol);
	salidaPreOrden.textContent = formatearRecorrido(recorridos.preOrden);
	salidaInOrden.textContent = formatearRecorrido(recorridos.inOrden);
	salidaPostOrden.textContent = formatearRecorrido(recorridos.postOrden);
}

function generarCodigoTresDirecciones(arbol) {
	const lineas = [];
	const temporalesDispositivos = new Map();
	let numeroTemporal = 0;

	function emitir(operador, argumento1 = '', argumento2 = '') {
		numeroTemporal++;
		const temporal = `T${numeroTemporal}`;
		let expresion = operador;

		if (argumento1 !== '') {
			expresion += ` ${argumento1}`;
		}

		if (argumento2 !== '') {
			expresion += `, ${argumento2}`;
		}

		lineas.push(`${temporal} = ${expresion}`);
		return temporal;
	}

	function generarInstruccionDispositivo(instruccion, temporalDispositivo) {
		const atributos = instruccion.atributos || {};

		if (instruccion.tipo === 'ConfiguracionBasica') {
			emitir('basica', temporalDispositivo);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionHostname') {
			emitir('hostname', temporalDispositivo, atributos.nombre);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionSsh') {
			const temporalCredencial = emitir('credencial', atributos.usuario, atributos.password);
			const temporalDominio = emitir('dominio', temporalCredencial, atributos.dominio);
			emitir('ssh', temporalDispositivo, temporalDominio);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionPuertoRouter') {
			let temporalPuerto = emitir('puerto', temporalDispositivo, atributos.interfaz);

			if (atributos.modo === 'troncal') {
				emitir('modo_troncal', temporalPuerto);
				return;
			}

			if (atributos.modo === 'sin_ip') {
				emitir('sin_ip', temporalPuerto);
				return;
			}

			temporalPuerto = emitir('ip', temporalPuerto, atributos.ip);
			temporalPuerto = emitir('mascara', temporalPuerto, atributos.mascara);

			if (atributos.helper) {
				emitir('helper', temporalPuerto, atributos.helper);
			}
			return;
		}

		if (instruccion.tipo === 'ConfiguracionSubpuertoRouter') {
			let temporalSubpuerto = emitir('subpuerto', temporalDispositivo, atributos.interfaz);
			temporalSubpuerto = emitir('vlan', temporalSubpuerto, atributos.vlan);

			if (atributos.modo === 'nativa') {
				emitir('nativa', temporalSubpuerto);
				return;
			}

			temporalSubpuerto = emitir('ip', temporalSubpuerto, atributos.ip);
			temporalSubpuerto = emitir('mascara', temporalSubpuerto, atributos.mascara);

			if (atributos.helper) {
				emitir('helper', temporalSubpuerto, atributos.helper);
			}
			return;
		}

		if (instruccion.tipo === 'ConfiguracionPoolDhcp') {
			let temporalPool = emitir('pool', temporalDispositivo, atributos.nombre);
			temporalPool = emitir('red', temporalPool, atributos.red);
			temporalPool = emitir('mascara', temporalPool, atributos.mascara);
			temporalPool = emitir('gateway', temporalPool, atributos.gateway);
			emitir('dns', temporalPool, atributos.dns);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionExcluirIp') {
			const temporalRango = emitir('rango', atributos.ipInicial, atributos.ipFinal);
			emitir('excluir', temporalDispositivo, temporalRango);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionVlan') {
			const temporalVlan = emitir('vlan', temporalDispositivo, atributos.numero);
			emitir('nombre', temporalVlan, atributos.nombre);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionPuertoSwitch') {
			const interfaces = obtenerInterfacesConfiguracionSwitch(instruccion);
			const temporalLista = emitir('lista_interfaces', `{${interfaces.join('; ')}}`);
			const temporalPuertos = emitir('puertos', temporalDispositivo, temporalLista);
			emitir('acceso', temporalPuertos, atributos.vlan);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionTroncalSwitch') {
			let temporalTroncal = emitir('troncal', temporalDispositivo, atributos.interfaz);
			temporalTroncal = emitir('nativa', temporalTroncal, atributos.vlanNativa);
			emitir('vlans_permitidas', temporalTroncal, `{${String(atributos.vlansPermitidas).split(',').map(vlan => vlan.trim()).filter(Boolean).join('; ')}}`);
			return;
		}

		if (instruccion.tipo === 'ConfiguracionAdministracionSwitch') {
			let temporalAdministracion = emitir('administracion', temporalDispositivo, atributos.vlan);
			temporalAdministracion = emitir('ip', temporalAdministracion, atributos.ip);
			temporalAdministracion = emitir('mascara', temporalAdministracion, atributos.mascara);
			emitir('gateway', temporalAdministracion, atributos.gateway);
		}
	}

	for (const nodo of arbol.hijos || []) {
		if (nodo.tipo === 'BloqueRouter' || nodo.tipo === 'BloqueSwitch') {
			const tipoDispositivo = nodo.tipo === 'BloqueRouter' ? 'ROUTER' : 'SWITCH';
			const nombreDispositivo = nodo.atributos.nombre;
			const temporalDispositivo = emitir('dispositivo', tipoDispositivo, nombreDispositivo);
			temporalesDispositivos.set(String(nombreDispositivo).toLowerCase(), temporalDispositivo);

			for (const instruccion of nodo.hijos || []) {
				generarInstruccionDispositivo(instruccion, temporalDispositivo);
			}
			continue;
		}

		if (nodo.tipo === 'SentenciaProbarPing') {
			const origen = nodo.atributos.origen;
			const destino = nodo.atributos.destino;
			const temporalOrigen = temporalesDispositivos.get(String(origen).toLowerCase()) || origen;
			const temporalDestino = temporalesDispositivos.get(String(destino).toLowerCase()) || destino;
			emitir('ping', temporalOrigen, temporalDestino);
			continue;
		}

		if (nodo.tipo === 'SentenciaMostrarRedes') {
			emitir('mostrar', 'redes');
			continue;
		}

		if (nodo.tipo === 'SentenciaVerificar') {
			emitir('verificar', 'programa');
		}
	}

	return lineas;
}

function mostrarCodigoTresDirecciones(arbol, puedeGenerarse) {
	if (!salidaCodigoTresDirecciones) {
		return;
	}

	if (!entradaCodigo.value.trim()) {
		salidaCodigoTresDirecciones.textContent = 'Sin código intermedio generado.';
		return;
	}

	if (!puedeGenerarse || !arbol) {
		salidaCodigoTresDirecciones.textContent = 'No se generó código de tres direcciones porque el programa contiene errores.';
		return;
	}

	const codigo = generarCodigoTresDirecciones(arbol);
	salidaCodigoTresDirecciones.textContent = codigo.length
		? codigo.join('\n')
		: 'No hay instrucciones válidas para generar código intermedio.';
}

AnalizadorSintactico.prototype.analizarConfiguracionHostname = function() {
	const nodo = crearNodo('ConfiguracionHostname');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'hostname',
		patron: [
			{ tipo: 'TK_RES_HOSTNAME', nombre: 'hostname' },
			{ tipo: 'TK_ID', nombre: 'nombre' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La instrucción hostname solo acepta un identificador como nombre del dispositivo.',
		sugerenciaBase: 'Usa el formato: hostname R1.'
	});

	if (resultado.nombre) {
		nodo.atributos.nombre = resultado.nombre.lexema;
		nodo.tokenNombre = resultado.nombre;
		nodo.tokenReferencia = resultado.nombre;
	} else {
		nodo.atributos.nombre = 'sin_nombre';
		nodo.tokenReferencia = resultado.hostname || null;
	}

	return nodo;
};

AnalizadorSintactico.prototype.analizarConfiguracionSsh = function() {
	const nodo = crearNodo('ConfiguracionSsh');
	const resultado = this.validarPatronFlexible({
		nombreEstructura: 'ssh',
		patron: [
			{ tipo: 'TK_RES_SSH', nombre: 'ssh' },
			{ tipo: 'TK_RES_USUARIO' },
			{ tipo: 'TK_ID', nombre: 'usuario' },
			{ tipo: 'TK_RES_PASSWORD' },
			{ tipo: 'TK_ID', nombre: 'password' },
			{ tipo: 'TK_RES_DOMINIO' },
			{ tipo: 'TK_DOMINIO', nombre: 'dominio' }
		],
		tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
		descripcionBase: 'La instrucción ssh solo acepta usuario, password y dominio en ese orden.',
		sugerenciaBase: 'Usa el formato: ssh usuario admin password cisco123 dominio cisco.com.'
	});

	if (resultado.usuario) {
		nodo.atributos.usuario = resultado.usuario.lexema;
		nodo.tokenUsuario = resultado.usuario;
	} else {
		nodo.atributos.usuario = 'sin_usuario';
	}

	if (resultado.password) {
		nodo.atributos.password = resultado.password.lexema;
		nodo.tokenPassword = resultado.password;
	} else {
		nodo.atributos.password = 'sin_password';
	}

	if (resultado.dominio) {
		nodo.atributos.dominio = resultado.dominio.lexema;
		nodo.tokenDominio = resultado.dominio;
	} else {
		nodo.atributos.dominio = 'sin_dominio';
	}

	nodo.tokenReferencia = resultado.ssh || resultado.usuario || resultado.password || resultado.dominio || null;
	return nodo;
};

function crearEntradaTablaSimbolos(datos) {
	const token = datos.token || null;

	return {
		nombre: datos.nombre,
		tipo: datos.tipo,
		valor: datos.valor,
		ambito: datos.ambito,
		renglon: token && Number.isInteger(token.renglon) ? token.renglon : '—',
		columna: token && Number.isInteger(token.columna) ? token.columna : '—'
	};
}

function esValorTablaSimbolosValido(valor, valorInvalido = '') {
	if (valor === undefined || valor === null || valor === '') {
		return false;
	}

	return String(valor) !== valorInvalido && !String(valor).startsWith('sin_');
}

function obtenerPoolRelacionadoConExclusion(instrucciones, exclusion) {
	const ipInicial = exclusion.atributos.ipInicial;
	const ipFinal = exclusion.atributos.ipFinal;

	if (
		!esValorTablaSimbolosValido(ipInicial, 'sin_ip_inicial') ||
		!esValorTablaSimbolosValido(ipFinal, 'sin_ip_final')
	) {
		return null;
	}

	const poolsRelacionados = instrucciones.filter(instruccion => {
		if (instruccion.tipo !== 'ConfiguracionPoolDhcp') {
			return false;
		}

		const red = instruccion.atributos.red;
		const mascara = instruccion.atributos.mascara;

		if (
			!esValorTablaSimbolosValido(red, 'sin_red') ||
			!esValorTablaSimbolosValido(mascara, 'sin_mascara')
		) {
			return false;
		}

		return ipPerteneceARed(ipInicial, red, mascara) &&
			ipPerteneceARed(ipFinal, red, mascara);
	});

	return poolsRelacionados.length === 1 ? poolsRelacionados[0] : null;
}

function generarTablaSimbolos(arbol) {
	const simbolos = [];

	function agregar(datos) {
		if (
			!esValorTablaSimbolosValido(datos.nombre) ||
			!esValorTablaSimbolosValido(datos.valor)
		) {
			return;
		}

		simbolos.push(crearEntradaTablaSimbolos(datos));
	}

	for (const nodo of arbol.hijos || []) {
		if (!['BloqueRouter', 'BloqueSwitch'].includes(nodo.tipo)) {
			continue;
		}

		const tipoDispositivo = nodo.tipo === 'BloqueRouter' ? 'ROUTER' : 'SWITCH';
		const nombreDispositivo = nodo.atributos.nombre;
		const ambitoDispositivo = `${tipoDispositivo} ${nombreDispositivo}`;
		const instrucciones = Array.isArray(nodo.hijos) ? nodo.hijos : [];

		agregar({
			nombre: `dispositivo ${nombreDispositivo}`,
			tipo: 'dispositivo',
			valor: tipoDispositivo,
			ambito: 'global',
			token: nodo.tokenReferencia
		});

		const contadoresExclusion = new Map();

		for (const instruccion of instrucciones) {
			const atributos = instruccion.atributos || {};

			if (instruccion.tipo === 'ConfiguracionHostname') {
				agregar({
					nombre: `hostname ${nombreDispositivo}`,
					tipo: 'identificador',
					valor: atributos.nombre,
					ambito: ambitoDispositivo,
					token: instruccion.tokenNombre || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionSsh') {
				agregar({
					nombre: `usuario ${nombreDispositivo}`,
					tipo: 'identificador',
					valor: atributos.usuario,
					ambito: `${ambitoDispositivo} > SSH`,
					token: instruccion.tokenUsuario || instruccion.tokenReferencia
				});
				agregar({
					nombre: `contraseña ${atributos.usuario}`,
					tipo: 'cadena',
					valor: atributos.password,
					ambito: `${ambitoDispositivo} > SSH`,
					token: instruccion.tokenPassword || instruccion.tokenReferencia
				});
				agregar({
					nombre: `dominio ${nombreDispositivo}`,
					tipo: 'dominio',
					valor: atributos.dominio,
					ambito: `${ambitoDispositivo} > SSH`,
					token: instruccion.tokenDominio || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPuertoRouter') {
				const interfaz = atributos.interfaz;
				const ambitoInterfaz = `${ambitoDispositivo} > ${interfaz}`;

				if (atributos.modo === 'troncal' || atributos.modo === 'sin_ip') {
					agregar({
						nombre: `modo ${nombreDispositivo}.${interfaz}`,
						tipo: 'modo de interfaz',
						valor: atributos.modo,
						ambito: ambitoInterfaz,
						token: instruccion.tokenInterfaz || instruccion.tokenReferencia
					});
				}

				agregar({
					nombre: `ip ${nombreDispositivo}.${interfaz}`,
					tipo: 'IPv4',
					valor: atributos.ip,
					ambito: ambitoInterfaz,
					token: instruccion.tokenIp || instruccion.tokenReferencia
				});
				agregar({
					nombre: `máscara ${nombreDispositivo}.${interfaz}`,
					tipo: 'CIDR',
					valor: atributos.mascara,
					ambito: ambitoInterfaz,
					token: instruccion.tokenMascara || instruccion.tokenReferencia
				});
				agregar({
					nombre: `helper ${nombreDispositivo}.${interfaz}`,
					tipo: 'IPv4',
					valor: atributos.helper,
					ambito: ambitoInterfaz,
					token: instruccion.tokenHelper || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionSubpuertoRouter') {
				const interfaz = atributos.interfaz;
				const ambitoSubinterfaz = `${ambitoDispositivo} > ${interfaz}`;

				agregar({
					nombre: `vlan ${nombreDispositivo}.${interfaz}`,
					tipo: 'VLAN',
					valor: atributos.vlan,
					ambito: ambitoSubinterfaz,
					token: instruccion.tokenVlan || instruccion.tokenReferencia
				});
				agregar({
					nombre: `modo ${nombreDispositivo}.${interfaz}`,
					tipo: 'modo de subinterfaz',
					valor: atributos.modo,
					ambito: ambitoSubinterfaz,
					token: instruccion.tokenInterfaz || instruccion.tokenReferencia
				});
				agregar({
					nombre: `ip ${nombreDispositivo}.${interfaz}`,
					tipo: 'IPv4',
					valor: atributos.ip,
					ambito: ambitoSubinterfaz,
					token: instruccion.tokenIp || instruccion.tokenReferencia
				});
				agregar({
					nombre: `máscara ${nombreDispositivo}.${interfaz}`,
					tipo: 'CIDR',
					valor: atributos.mascara,
					ambito: ambitoSubinterfaz,
					token: instruccion.tokenMascara || instruccion.tokenReferencia
				});
				agregar({
					nombre: `helper ${nombreDispositivo}.${interfaz}`,
					tipo: 'IPv4',
					valor: atributos.helper,
					ambito: ambitoSubinterfaz,
					token: instruccion.tokenHelper || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPoolDhcp') {
				const nombrePool = atributos.nombre;
				const ambitoPool = `${ambitoDispositivo} > pool ${nombrePool}`;

				agregar({
					nombre: `red ${nombrePool}`,
					tipo: 'IPv4',
					valor: atributos.red,
					ambito: ambitoPool,
					token: instruccion.tokenRed || instruccion.tokenReferencia
				});
				agregar({
					nombre: `máscara ${nombrePool}`,
					tipo: 'CIDR',
					valor: atributos.mascara,
					ambito: ambitoPool,
					token: instruccion.tokenMascara || instruccion.tokenReferencia
				});
				agregar({
					nombre: `gateway ${nombrePool}`,
					tipo: 'IPv4',
					valor: atributos.gateway,
					ambito: ambitoPool,
					token: instruccion.tokenGateway || instruccion.tokenReferencia
				});
				agregar({
					nombre: `dns ${nombrePool}`,
					tipo: 'IPv4',
					valor: atributos.dns,
					ambito: ambitoPool,
					token: instruccion.tokenDns || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionExcluirIp') {
				const poolRelacionado = obtenerPoolRelacionadoConExclusion(instrucciones, instruccion);
				const propietario = poolRelacionado
					? poolRelacionado.atributos.nombre
					: nombreDispositivo;
				const ambitoExclusion = poolRelacionado
					? `${ambitoDispositivo} > pool ${poolRelacionado.atributos.nombre}`
					: ambitoDispositivo;
				const numeroExclusion = (contadoresExclusion.get(propietario) || 0) + 1;
				contadoresExclusion.set(propietario, numeroExclusion);

				agregar({
					nombre: `exclusión ${propietario} ${numeroExclusion}`,
					tipo: 'rango IPv4',
					valor: `${atributos.ipInicial} - ${atributos.ipFinal}`,
					ambito: ambitoExclusion,
					token: instruccion.tokenIpInicial || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionVlan') {
				agregar({
					nombre: `nombre VLAN ${nombreDispositivo}.${atributos.numero}`,
					tipo: 'identificador',
					valor: atributos.nombre,
					ambito: `${ambitoDispositivo} > VLAN ${atributos.numero}`,
					token: instruccion.tokenNombre || instruccion.tokenNumero || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionPuertoSwitch') {
				for (const interfaz of obtenerInterfacesConfiguracionSwitch(instruccion)) {
					agregar({
						nombre: `acceso ${nombreDispositivo}.${interfaz}`,
						tipo: 'VLAN',
						valor: atributos.vlan,
						ambito: `${ambitoDispositivo} > ${interfaz}`,
						token: instruccion.tokenVlan || instruccion.tokenInterfaz || instruccion.tokenReferencia
					});
				}
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionTroncalSwitch') {
				const interfaz = atributos.interfaz;
				const ambitoTroncal = `${ambitoDispositivo} > ${interfaz}`;

				agregar({
					nombre: `vlan nativa ${nombreDispositivo}.${interfaz}`,
					tipo: 'VLAN',
					valor: atributos.vlanNativa,
					ambito: ambitoTroncal,
					token: instruccion.tokenVlanNativa || instruccion.tokenReferencia
				});
				agregar({
					nombre: `vlans permitidas ${nombreDispositivo}.${interfaz}`,
					tipo: 'lista de VLAN',
					valor: atributos.vlansPermitidas,
					ambito: ambitoTroncal,
					token: instruccion.tokenVlansPermitidas || instruccion.tokenReferencia
				});
				continue;
			}

			if (instruccion.tipo === 'ConfiguracionAdministracionSwitch') {
				const ambitoAdministracion = `${ambitoDispositivo} > administración`;

				agregar({
					nombre: `vlan administración ${nombreDispositivo}`,
					tipo: 'VLAN',
					valor: atributos.vlan,
					ambito: ambitoAdministracion,
					token: instruccion.tokenVlan || instruccion.tokenReferencia
				});
				agregar({
					nombre: `ip administración ${nombreDispositivo}`,
					tipo: 'IPv4',
					valor: atributos.ip,
					ambito: ambitoAdministracion,
					token: instruccion.tokenIp || instruccion.tokenReferencia
				});
				agregar({
					nombre: `máscara administración ${nombreDispositivo}`,
					tipo: 'CIDR',
					valor: atributos.mascara,
					ambito: ambitoAdministracion,
					token: instruccion.tokenMascara || instruccion.tokenReferencia
				});
				agregar({
					nombre: `gateway administración ${nombreDispositivo}`,
					tipo: 'IPv4',
					valor: atributos.gateway,
					ambito: ambitoAdministracion,
					token: instruccion.tokenGateway || instruccion.tokenReferencia
				});
			}
		}
	}

	return simbolos;
}

function mostrarTablaSimbolos(arbol, puedeGenerarse) {
	if (!cuerpoTablaSimbolos) {
		return;
	}

	if (!entradaCodigo.value.trim()) {
		cuerpoTablaSimbolos.innerHTML = '<tr><td colspan="7" class="celda-vacia">No hay símbolos para mostrar.</td></tr>';
		return;
	}

	if (!puedeGenerarse || !arbol) {
		cuerpoTablaSimbolos.innerHTML = '<tr><td colspan="7" class="celda-vacia">No se generó la tabla porque existen errores léxicos o sintácticos.</td></tr>';
		return;
	}

	const simbolos = generarTablaSimbolos(arbol);

	if (!simbolos.length) {
		cuerpoTablaSimbolos.innerHTML = '<tr><td colspan="7" class="celda-vacia">No se encontraron símbolos con valores asignados en el programa.</td></tr>';
		return;
	}

	cuerpoTablaSimbolos.innerHTML = simbolos.map((simbolo, indice) => `
		<tr>
			<td>${indice + 1}</td>
			<td><strong>${escaparHtml(simbolo.nombre)}</strong></td>
			<td>${escaparHtml(simbolo.tipo)}</td>
			<td><code>${escaparHtml(simbolo.valor)}</code></td>
			<td>${escaparHtml(simbolo.ambito)}</td>
			<td>${escaparHtml(simbolo.renglon)}</td>
			<td>${escaparHtml(simbolo.columna)}</td>
		</tr>
	`).join('');
}

analizarCodigo = function() {
	const texto = entradaCodigo.value;
	const resultadoLexico = analizarLexico(texto);
	const resultadoSintactico = analizarSintactico(resultadoLexico.tokensValidos);
	const resultadoSemantico = resultadoSintactico.arbol
		? analizarSemantico(resultadoSintactico.arbol)
		: { errores: [], reglasEjecutadas: [] };

	const erroresEstructurales = [
		...resultadoLexico.errores,
		...resultadoSintactico.errores
	];
	const errores = [
		...erroresEstructurales,
		...resultadoSemantico.errores
	];
	const tokensParaTabla = crearTokensParaTabla(resultadoLexico.tokens, errores);
	const puedeConstruirseAst = erroresEstructurales.length === 0;
	const puedeGenerarseCodigoIntermedio = errores.length === 0;

	actualizarNumerosRenglon(texto);
	actualizarResaltado(texto, errores, resultadoLexico.tokens);
	mostrarTokens(tokensParaTabla);
	mostrarErrores(errores);
	mostrarSugerencias(errores);
	mostrarResumen(tokensParaTabla, errores);
	mostrarArbol(puedeConstruirseAst ? resultadoSintactico.arbol : null);
	mostrarRecorridos(resultadoSintactico.arbol, puedeConstruirseAst);
	mostrarCodigoTresDirecciones(resultadoSintactico.arbol, puedeGenerarseCodigoIntermedio);
	mostrarTablaSimbolos(resultadoSintactico.arbol, puedeConstruirseAst);
	mostrarReglasSemanticas(resultadoSemantico.reglasEjecutadas || []);
	actualizarAutocompletado();

	sincronizarDesplazamiento();
};

analizarCodigo();