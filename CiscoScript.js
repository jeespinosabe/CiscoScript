const entradaCodigo = document.querySelector('#entradaCodigo');
const capaResaltado = document.querySelector('#capaResaltado');
const numerosRenglon = document.querySelector('#numerosRenglon');
const cuerpoTablaTokens = document.querySelector('#cuerpoTablaTokens');
const contenedorErrores = document.querySelector('#contenedorErrores');
const contenedorSugerencias = document.querySelector('#contenedorSugerencias');
const resumenAnalisis = document.querySelector('#resumenAnalisis');
const salidaArbol = document.querySelector('#salidaArbol');
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
	{ texto: 'Ventas', detalle: 'identificador' },
	{ texto: ':', detalle: 'símbolo' }
];

//estas son las expresiones regulares
//REG TK_IFACE
const expresionInterfaz = /^(fa|Fa|g|Gi|s|Se)\d+\/\d+(\/\d+)?$/;
//REG TK_IP
const expresionIp = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
//REG TK_MASK
const expresionMascara = /^\/([0-9]|[1-2][0-9]|3[0-2])$/;
//REG TK_NUM
const expresionNumero = /^[0-9]+$/;
//REG TK_ID
const expresionIdentificador = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
//REG TK_ERROR
const expresionCaracterValido = /[a-zA-Z0-9 \t\r\n.\/:_-]/;

const codigoEjemplo = `router R1:
	basica
	hostname R1
	ssh usuario admin password cisco123 dominio redlocal
	puerto g0/0 ip 192.168.1.1 /24
	pool LAN1 red 192.168.1.0 /24 gateway 192.168.1.1 dns 8.8.8.8
	excluir 192.168.1.1 192.168.1.10
fin

switch S1:
	basica
	hostname S1
	vlan 10 nombre Ventas
	puerto fa0/1 acceso 10
fin

probar ping PC1 PC2
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

function analizarCodigo() {
	const texto = entradaCodigo.value;
	const resultadoLexico = analizarLexico(texto);
	const resultadoSintactico = analizarSintactico(resultadoLexico.tokensValidos);
	const resultadoRepeticion = resultadoSintactico.arbol
		? analizarRepeticiones(resultadoSintactico.arbol)
		: { errores: [] };

	const errores = [
		...resultadoLexico.errores,
		...resultadoSintactico.errores,
		...resultadoRepeticion.errores
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
	actualizarAutocompletado();

	sincronizarDesplazamiento();
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

			while (indice < texto.length && /[a-zA-Z0-9_\/-]/.test(texto[indice])) {
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
				{ tipo: 'TK_ID', nombre: 'dominio' }
			],
			tiposDetencion: this.obtenerTiposDetencionDentroDeBloque(),
			descripcionBase: 'La instrucción ssh solo acepta usuario, password y dominio en ese orden.',
			sugerenciaBase: 'Usa el formato: ssh usuario admin password cisco123 dominio redlocal.'
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
				{ tipo: 'TK_ID', candidatos: ['redlocal'] }
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
				{ tipo: 'TK_ID', candidatos: ['redlocal'] }
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

analizarCodigo();