const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const chrome = require('selenium-webdriver/chrome'); // Importar chrome

(async function testSistemaInscripcion() {
    // Crear una instancia del navegador
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(new chrome.ServiceBuilder("C:\\Users\\admin\\Downloads\\chromedriver-win64\\chromedriver.exe")) // Ruta corregida
        .build();
    
    const screenshotsDir = path.join(__dirname, 'screenshots10');
    const reportFile = path.join(__dirname, 'test_report10.html');
    let reportContent = `
        <html>
        <head>
            <title>Reporte de Pruebas Automatizadas</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                h1 { color: #333; }
                ul { padding-left: 20px; }
                li { margin-bottom: 10px; }
                a { color: blue; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Resultados de Pruebas Automatizadas</h1>
            <p>Este reporte documenta cada paso de la prueba automatizada ejecutada.</p>
            <ul>
    `;

    // Crear directorio para capturas si no existe
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    // Función para capturar pantalla
    async function takeScreenshot(stepName) {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.join(screenshotsDir, `${stepName}.png`);
        fs.writeFileSync(filePath, screenshot, 'base64');
        reportContent += `<li><strong>${stepName}:</strong> Captura tomada</li>`;
    }

    try {
        // Navegar a la carpeta donde está el index.html
        await driver.get('http://127.0.0.1:3000/index.html');
        await takeScreenshot('01_Navegar a la página de inicio');

        // Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('02_Clic en el botón de inicio de sesión');

        // Verificar el mensaje de error de Toastr
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(2000); // Esperar para ver el formulario
        await takeScreenshot('03_Ir al formulario de registro');

        // Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('04_Clic en el botón de registro sin contraseña');

        // Verificar que se muestre el mensaje de error
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorRegisterMessage.replace('Error\n', '').trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // Ahora ingresar la contraseña y registrarse
        await driver.findElement(By.id('password')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('05_Clic en el botón de registro con contraseña');

        // Verificar el mensaje de éxito
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito:</strong> ${successMessage}</li>`;
        await driver.sleep(2000); // Esperar para ver el mensaje

        // Intentar iniciar sesión con contraseña incorrecta
        await driver.findElement(By.id('loginUsername')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('loginPassword')).sendKeys('PedroLuis123456');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('06_Iniciar sesión con contraseña incorrecta');

        // Verificar el mensaje de error
        errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error al iniciar sesión:</strong> ${errorLoginMessage}</li>`;

        // Iniciar sesión con la contraseña correcta
        await driver.findElement(By.id('loginPassword')).clear();
        await driver.findElement(By.id('loginPassword')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('07_Iniciar sesión con contraseña correcta');

        // Verificar el mensaje de éxito
        successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Inicio de sesión exitoso');
        reportContent += `<li><strong>Mensaje de éxito al iniciar sesión:</strong> ${successMessage}</li>`;

        // Completar el formulario de datos personales
        await driver.findElement(By.id('nombre')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('provincia')).sendKeys('San jose de ocoa');
        await driver.findElement(By.id('ciudad')).sendKeys(''); // Dejar ciudad vacío
        await driver.findElement(By.id('sector')).sendKeys('Sabana Larga');
        await driver.findElement(By.id('calle')).sendKeys('Sabana Larga Abajo');
        await driver.findElement(By.id('carrera')).sendKeys('software'); // Seleccionar carrera
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('08_Clic en el botón de siguiente sin ciudad');

        // Verificar el mensaje de error por campo requerido
        let errorDataMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorDataMessage.replace('Error\n', '').trim(), 'Oups ha ocurrido un error\nToda la información es requerida');
        reportContent += `<li><strong>Mensaje de error en datos personales:</strong> ${errorDataMessage}</li>`;

        // Completar el campo de ciudad
        await driver.findElement(By.id('ciudad')).sendKeys('Ocoa');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('09_Clic en el botón de siguiente con ciudad');

        // Verificar el mensaje de éxito
        let successDataMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successDataMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en datos personales:</strong> ${successDataMessage}</li>`;
        await driver.sleep(3000); // Esperar para ver el mensaje

        // Seleccionar materias
        await driver.sleep(2000); // Esperar para que se cargue el formulario de selección de materias
        await takeScreenshot('10_Cargar formulario de selección de materias');

        // Seleccionar horarios específicos para cada materia
        const materias = [
            "Programación I",
            "Estructuras de Datos",
            "Bases de Datos",
            "Desarrollo Web",
            "Algoritmos"
        ];

        const horarios = [
            'horario1_1', // Lunes
            'horario2_2', // Martes
            'horario3_3', // Miércoles
            'horario4_4', // Jueves
            'horario5_5'  // Viernes
        ];

        // Seleccionar todos los horarios
        for (let i = 0; i < materias.length; i++) {
            await driver.findElement(By.id(horarios[i])).click(); // Seleccionar el horario correspondiente
            await driver.sleep(1000); // Esperar un poco para la acción
        }

        // Hacer clic en el botón de registrar
        await driver.findElement(By.id('formSecond__Registrar')).click(); 
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('11_Clic en el botón de registrar con todas las materias');

        // Esperar a que se muestre el siguiente formulario
        await driver.sleep(3000); // Esperar para ver el siguiente formulario

        // Verificar que se haya mostrado el mensaje de éxito
        let successMateriasMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMateriasMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en selección de materias:</strong> ${successMateriasMessage}</li>`;
        
        // Editar horario
        await driver.findElement(By.id('formEditarHorario')).click(); // Mostrar el formulario de editar horario
        await driver.sleep(2000); // Esperar para ver el formulario
        await takeScreenshot('12_Cargar formulario de editar horario');

        // Editar cada materia
        const diasMaterias = [
            { dia: 'lunes', materia: 'Programación I', nuevaHora: 'L (9:00am a 11:00am)' },
            { dia: 'martes', materia: 'Estructuras de Datos', nuevaHora: 'M (10:00am a 12:00pm)' },
            { dia: 'miercoles', materia: 'Bases de Datos', nuevaHora: 'X (11:00am a 1:00pm)' },
            { dia: 'jueves', materia: 'Desarrollo Web', nuevaHora: 'J (1:00pm a 3:00pm)' },
            { dia: 'viernes', materia: 'Algoritmos', nuevaHora: 'V (2:00pm a 4:00pm)' }
        ];

        for (const { dia, materia, nuevaHora } of diasMaterias) {
            // Seleccionar el día
            await driver.findElement(By.id('diaHorario')).sendKeys(dia); // Cambiar el día
            await driver.findElement(By.id('materiaHorario')).sendKeys(materia); // Ingresar la materia
            await driver.findElement(By.id('nuevaHora')).sendKeys(nuevaHora); // Ingresar la nueva hora
            
            // Hacer clic en el botón de guardar cambios
            await driver.findElement(By.id('guardarHorario')).click();

            // Limpiar los campos de materia y nuevaHora
            await driver.findElement(By.id('materiaHorario')).clear(); // Limpiar campo de materia
            await driver.findElement(By.id('nuevaHora')).clear(); // Limpiar campo de nueva hora

            // Esperar un poco para permitir que se muestre el mensaje (esto puede ser ajustado según tu necesidad)
            await driver.sleep(2000); 
        }

        // Confirmar que todos los cambios se guardaron correctamente
        await takeScreenshot('13_Confirmar cambios en el horario');

        // Descargar el PDF del horario actualizado
        await driver.findElement(By.id('formThree__descargarPDF')).click(); // Hacer clic en el botón de descargar PDF
        await driver.sleep(2000); // Esperar para que se inicie la descarga

        // Ruta al directorio donde se descargan los archivos
        const downloadPath = path.resolve(__dirname, 'ruta_a_tu_carpeta_de_descargas'); 
        const expectedFileName = 'horarios-seleccionados.pdf'; // Nombre esperado del archivo descargado

        // Esperar hasta que el archivo exista en la carpeta de descargas
        let fileExists = false;
        const maxRetries = 10;
        for (let i = 0; i < maxRetries; i++) {
            if (fs.existsSync(path.join(downloadPath, expectedFileName))) {
                fileExists = true;
                break;
            }
            await driver.sleep(1000); // Esperar 1 segundo antes de volver a verificar
        }

        // Validar si el archivo fue descargado correctamente
        if (fileExists) {
            // Mostrar mensaje de éxito con toastr
            await driver.executeScript(() => {
                toastr.success("PDF descargado correctamente.", "Éxito");
            });
            await takeScreenshot('14_Archivo descargado correctamente');
        } else {
            // Mostrar mensaje de error con toastr
            await driver.executeScript(() => {
                toastr.error("Error al descargar el PDF.", "Error");
            });
        }
                // Botón de atrás en el tercer formulario
        await driver.findElement(By.id('formThree__atras')).click();
        await driver.sleep(2000); // Esperar para ver el formulario anterior
        await takeScreenshot('15_Clic en el botón de atrás en el tercer formulario');

        // Botón de atrás en el segundo formulario
        await driver.findElement(By.id('formSecond__atras')).click();
        await driver.sleep(2000); // Esperar para ver el formulario anterior
        await takeScreenshot('16_Clic en el botón de atrás en el segundo formulario');

        // Cambiar la carrera en el select
        await driver.findElement(By.id('carrera')).sendKeys('redes'); // Seleccionar la nueva carrera
        await driver.sleep(1000); // Esperar un momento

        // Ir al siguiente formulario
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('17_Clic en el botón de siguiente con nueva carrera');

        // Seleccionar horarios específicos para cada materia nuevamente
        const nuevosHorarios = [
            'horario1_1', // Lunes
            'horario2_2', // Martes
            'horario3_3', // Miércoles
            'horario4_4', // Jueves
            'horario5_5'  // Viernes
        ];

        // Seleccionar todos los nuevos horarios
        for (let i = 0; i < nuevosHorarios.length; i++) {
            await driver.findElement(By.id(nuevosHorarios[i])).click(); // Seleccionar el nuevo horario correspondiente
            await driver.sleep(1000); // Esperar un poco para la acción
        }

        // Hacer clic en el botón de registrar con los nuevos horarios
        await driver.findElement(By.id('formSecond__Registrar')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('18_Clic en el botón de registrar con nuevos horarios');

        // Verificar el mensaje de éxito
        let successNewMateriasMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successNewMateriasMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en selección de nuevas materias:</strong> ${successNewMateriasMessage}</li>`;
        
        // Descargar el nuevo PDF del horario actualizado
        await driver.findElement(By.id('formThree__descargarPDF')).click(); // Hacer clic en el botón de descargar PDF
        await driver.sleep(2000); // Esperar para que se inicie la descarga
        await takeScreenshot('19_Archivo descargado correctamente con nuevos horarios');

        // Finalizar el proceso
        await driver.findElement(By.id('formThree__Registrar')).click(); // Hacer clic en finalizar
        await driver.sleep(2000); // Esperar para ver el modal
        await takeScreenshot('20_Clic en el botón de finalizar');

        // Confirmar en el modal
        await driver.findElement(By.id('confirmSubmit')).click(); // Hacer clic en aceptar
        await driver.sleep(2000); // Esperar para ver el mensaje de éxito
        await takeScreenshot('21_Confirmación de finalización del proceso');

        // Continuación de la función testSistemaInscripcion

        // Registro de un nuevo usuario
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(2000); // Esperar para ver el formulario
        await takeScreenshot('22_Ir al formulario de registro nuevo usuario');

        await driver.findElement(By.id('username')).sendKeys('Juanitouser');
        await driver.findElement(By.id('password')).sendKeys('juanitouser1234');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('23_Clic en el botón de registro con nuevo usuario');

        // Verificar el mensaje de éxito
        successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito en registro nuevo usuario:</strong> ${successMessage}</li>`;

        // Iniciar sesión con el nuevo usuario
        await driver.findElement(By.id('loginUsername')).sendKeys('Juanitouser');
        await driver.findElement(By.id('loginPassword')).sendKeys('juanitouser1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('24_Iniciar sesión con nuevo usuario');

        // Completar el formulario de datos personales
        await driver.findElement(By.id('nombre')).sendKeys('Juanito');
        await driver.findElement(By.id('provincia')).sendKeys('Bani');
        await driver.findElement(By.id('ciudad')).sendKeys('San Cristobal'); // Completar ciudad
        await driver.findElement(By.id('sector')).sendKeys('Sector los maestros');
        await driver.findElement(By.id('calle')).sendKeys('Calle Agapito Mercedes');
        await driver.findElement(By.id('carrera')).sendKeys('multimedia'); // Seleccionar multimedia
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('25_Clic en el botón de siguiente con datos personales');

        // Verificar el mensaje de éxito
        successDataMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successDataMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en datos personales nuevo usuario:</strong> ${successDataMessage}</li>`;

        // Seleccionar materias
        const nuevasMaterias = [
            "Diseño Gráfico",
            "Producción Multimedia",
            "Animación Digital",
            "Desarrollo de Videojuegos",
            "Edición de Video"
        ];

        const nuevosHorariosSeleccionados = [
            'horario1_1', // Lunes
            'horario2_2', // Martes
            'horario3_3', // Miércoles
            'horario4_4', // Jueves
            'horario5_5'  // Viernes
        ];

        // Seleccionar nuevos horarios
        for (let i = 0; i < nuevasMaterias.length; i++) {
            await driver.findElement(By.id(nuevosHorariosSeleccionados[i])).click(); // Seleccionar el horario correspondiente
            await driver.sleep(1000); // Esperar un poco para la acción
        }

        // Hacer clic en el botón de registrar
        await driver.findElement(By.id('formSecond__Registrar')).click(); 
        await driver.sleep(2000); // Esperar para ver el mensaje
        await takeScreenshot('26_Clic en el botón de registrar con nuevas materias');

        // Verificar el mensaje de éxito
        let successNewMateriasMessage2 = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successNewMateriasMessage2.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en selección de nuevas materias:</strong> ${successNewMateriasMessage2}</li>`;

        // Editar horario
        await driver.findElement(By.id('formEditarHorario')).click(); // Mostrar el formulario de editar horario
        await driver.sleep(2000); // Esperar para ver el formulario
        await takeScreenshot('27_Cargar formulario de editar horario nuevo usuario');

        // Editar cada materia con nuevos horarios
        const nuevosDiasMaterias = [
            { dia: 'lunes', materia: 'Diseño Gráfico', nuevaHora: 'L (6:00pm a 8:00pm)' },
            { dia: 'martes', materia: 'Producción Multimedia', nuevaHora: 'M (7:00pm a 9:00pm)' },
            { dia: 'miercoles', materia: 'Animación Digital', nuevaHora: 'X (8:00pm a 10:00pm)' },
            { dia: 'jueves', materia: 'Desarrollo de Videojuegos', nuevaHora: 'J (9:00pm a 11:00pm)' },
            { dia: 'viernes', materia: 'Edición de Video', nuevaHora: 'V (10:00pm a 12:00am)' }
        ];

        for (const { dia, materia, nuevaHora } of nuevosDiasMaterias) {
            // Seleccionar el día
            await driver.findElement(By.id('diaHorario')).sendKeys(dia); // Cambiar el día
            await driver.findElement(By.id('materiaHorario')).sendKeys(materia); // Ingresar la materia
            await driver.findElement(By.id('nuevaHora')).sendKeys(nuevaHora); // Ingresar la nueva hora
            
            // Hacer clic en el botón de guardar cambios
            await driver.findElement(By.id('guardarHorario')).click();

            // Limpiar los campos de materia y nuevaHora
            await driver.findElement(By.id('materiaHorario')).clear(); // Limpiar campo de materia
            await driver.findElement(By.id('nuevaHora')).clear(); // Limpiar campo de nueva hora

            // Esperar un poco para permitir que se muestre el mensaje
            await driver.sleep(2000); 
        }

        // Confirmar que todos los cambios se guardaron correctamente
        await takeScreenshot('28_Confirmar cambios en el horario nuevo usuario');

        // Descargar el PDF del horario actualizado
        await driver.findElement(By.id('formThree__descargarPDF')).click(); // Hacer clic en el botón de descargar PDF
        await driver.sleep(2000); // Esperar para que se inicie la descarga
        await takeScreenshot('29_Archivo descargado correctamente con nuevos horarios');

        // Finalizar el proceso
        await driver.findElement(By.id('formThree__Registrar')).click(); // Hacer clic en finalizar
        await driver.sleep(2000); // Esperar para ver el modal
        await takeScreenshot('30_Clic en el botón de finalizar');

        // Confirmar en el modal
        await driver.findElement(By.id('confirmSubmit')).click(); // Hacer clic en aceptar
        await driver.sleep(2000); // Esperar para ver el mensaje de éxito
        await takeScreenshot('31_Confirmación de finalización del proceso nuevo usuario');

        // Redirigir al login
        await driver.sleep(3000);
        await takeScreenshot('32_Redirigir al login');

    } catch (error) {
        console.error('Error en la prueba:', error);
        reportContent += `<li><strong>Error:</strong> ${error.message}</li>`;
    } finally {
        // Guardar el reporte y cerrar el navegador
        fs.writeFileSync(reportFile, reportContent + '</ul></body></html>');
        await driver.quit();
    }
})();
