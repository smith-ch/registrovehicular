// Datos iniciales
let usuarios = [];
let vehiculoActual = {};

const caracteristicas = {
    sedan: {
        'Transmisión': ['Automática', 'Manual'],
        'Combustible': ['Gasolina', 'Diésel', 'Híbrido'],
        'Equipamiento': ['Aire Acondicionado', 'Sistema de Navegación', 'Asientos de Cuero']
    },
    suv: {
        'Tracción': ['4x2', '4x4'],
        'Equipamiento': ['Techo Panorámico', 'Sistema Off-Road', 'Portaequipajes'],
        'Seguridad': ['Control de Estabilidad', 'Cámaras 360°', 'Sensores de Estacionamiento']
    },
    pickup: {
        'Capacidad': ['500 kg', '1000 kg', '1500 kg'],
        'Carrocería': ['Simple', 'Doble'],
        'Equipamiento': ['Cabina Extendida', 'Caja de Herramientas', 'Suspensión Reforzada']
    },
    deportivo: {
        'Performance': ['Motor Turbo', 'Sistema de Escape Deportivo', 'Modo Sport'],
        'Equipamiento': ['Asientos Deportivos', 'Volante Multifunción', 'Sistema de Sonido Premium'],
        'Aerodinámica': ['Alerón Trasero', 'Difusor Posterior', 'Entradas de Aire']
    }
};

// Configuración Toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: 'toast-top-right'
};

// Manejo de Autenticación
$('#btnRegister').click(() => {
    const usuario = $('#username').val().trim();
    const contraseña = $('#password').val().trim();

    if (!usuario || !contraseña) {
        toastr.error('Debe completar todos los campos');
        return;
    }

    if (usuarios.some(u => u.usuario === usuario)) {
        toastr.error('El usuario ya existe');
        return;
    }

    usuarios.push({ usuario, contraseña });
    toastr.success('Registro exitoso');
    $('#registerForm').addClass('d-none');
    $('#loginForm').removeClass('d-none');
});

$('#btnLogin').click(() => {
    const usuario = $('#loginUsername').val().trim();
    const contraseña = $('#loginPassword').val().trim();

    const usuarioValido = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);

    if (usuarioValido) {
        $('#loginForm').addClass('d-none');
        $('#mainForm').removeClass('d-none');
        toastr.success(`Bienvenido ${usuario}`);
    } else {
        toastr.error('Credenciales incorrectas');
    }
});

$('#btnGoToRegister').click(() => {
    $('#loginForm').addClass('d-none');
    $('#registerForm').removeClass('d-none');
});

// Manejo del Formulario Principal
$('#tipo').change(function() {
    const tipo = $(this).val();
    $('#caracteristicas').empty();

    if (tipo && caracteristicas[tipo]) {
        Object.entries(caracteristicas[tipo]).forEach(([categoria, opciones]) => {
            const card = `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">${categoria}</div>
                        <div class="card-body">
                            ${opciones.map(opcion => `
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" 
                                           name="${categoria}" 
                                           value="${opcion}"
                                           id="${categoria}-${opcion}">
                                    <label class="form-check-label" for="${categoria}-${opcion}">
                                        ${opcion}
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            $('#caracteristicas').append(card);
        });
    }
});

$('#btnSiguiente').click(() => {
    const camposValidos = ['#marca', '#modelo', '#anio', '#color', '#placa', '#tipo']
        .every(selector => {
            const campo = $(selector);
            const valido = campo.val().trim() !== '';
            campo.toggleClass('is-invalid', !valido);
            return valido;
        });

    if (camposValidos) {
        vehiculoActual = {
            marca: $('#marca').val(),
            modelo: $('#modelo').val(),
            anio: $('#anio').val(),
            color: $('#color').val(),
            placa: $('#placa').val(),
            tipo: $('#tipo').val()
        };
        $('#vehicleForm').addClass('d-none');
        $('#featuresForm').removeClass('d-none');
    } else {
        toastr.error('Complete todos los campos requeridos');
    }
});

$('#btnRegistrar').click(() => {
    const caracteristicasSeleccionadas = [];
    $('input[type="checkbox"]:checked').each(function() {
        caracteristicasSeleccionadas.push({
            categoria: $(this).attr('name'),
            valor: $(this).val()
        });
    });

    if (caracteristicasSeleccionadas.length === 0) {
        toastr.error('Seleccione al menos una característica');
        return;
    }

    // Mostrar resumen
    $('#resumenDetalles').html(`
        <div class="alert alert-info">
            <h5>Datos principales del vehículo</h5>
            <p>Marca: ${vehiculoActual.marca}</p>
            <p>Modelo: ${vehiculoActual.modelo}</p>
            <p>Año: ${vehiculoActual.anio}</p>
            <p>Color: ${vehiculoActual.color}</p>
            <p>Placa: ${vehiculoActual.placa}</p>
            <p>Tipo: ${vehiculoActual.tipo}</p>
        </div>
    `);

    $('#tablaCaracteristicas').empty();
    caracteristicasSeleccionadas.forEach(c => {
        $('#tablaCaracteristicas').append(`
            <tr>
                <td>${c.categoria}</td>
                <td>${c.valor}</td>
                <td>
                    <button class="btn btn-sm btn-outline-warning btn-editar">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                </td>
            </tr>
        `);
    });

    $('#featuresForm').addClass('d-none');
    $('#resumenForm').removeClass('d-none');
});

// Funcionalidades Adicionales
$('#btnAtras').click(() => {
    $('#featuresForm').addClass('d-none');
    $('#vehicleForm').removeClass('d-none');
});

$('#btnEditar').click(() => {
    $('#resumenForm').addClass('d-none');
    $('#featuresForm').removeClass('d-none');
});

$('#btnLimpiar').click(() => {
    $('#vehicleForm')[0].reset();
    $('.is-invalid').removeClass('is-invalid');
});

$('#btnDescargarPDF').click(() => {
    const element = document.getElementById('resumenForm');
    html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`registro_${vehiculoActual.placa}.pdf`);
    });
});

// Manejo de Edición
$(document).on('click', '.btn-editar', function() {
    const fila = $(this).closest('tr');
    const categoria = fila.find('td:eq(0)').text();
    const valorActual = fila.find('td:eq(1)').text();
    
    // Implementar lógica de edición según necesidades
    toastr.info(`Editar: ${categoria} - ${valorActual}`, 'Editar Característica');
});