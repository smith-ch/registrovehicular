const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const edge = require('selenium-webdriver/edge');

(async function testRegistroVehiculos() {
    // Crear una instancia del navegador Edge
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(new edge.ServiceBuilder("C:\\Users\\smith\\Desktop\\msedgedriver.exe"))
        .build();

    const screenshotsDir = path.join(__dirname, 'screenshots1');
    const reportFile = path.join(__dirname, 'test_report1.html');
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
        // 1. Navegar a la página de inicio
        await driver.get('http://127.0.0.1:3000/index.html');
        await takeScreenshot('01_Navegar_a_la_página_de_inicio');

        // 2. Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(1000); // Esperar para que aparezca el mensaje Toastr
        await takeScreenshot('02_Clic_en_boton_inicio_sesión_sin_registro');

        // 3. Verificar el mensaje de error de Toastr (ahora adaptado a "Credenciales incorrectas")
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        // Opción A: Igualdad exacta
        /*
        assert.strictEqual(
            errorLoginMessage.replace('Error\n', '').trim(),
            'Credenciales incorrectas'
        );
        */
        // Opción B: Verificar que contenga la frase (más flexible)
        assert.ok(
            errorLoginMessage.includes('Credenciales incorrectas'),
            'El mensaje de error no coincide: ' + errorLoginMessage
        );

        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // 4. Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        // Esperar a que el formulario de registro sea visible
        const registerForm = await driver.wait(until.elementLocated(By.id('registerForm')), 5000);
        await driver.wait(until.elementIsVisible(registerForm), 5000);
        await takeScreenshot('03_Formulario_de_registro_visible');

        // 5. Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).clear();
        await driver.findElement(By.id('username')).sendKeys('Rosanna Mejia Acosta');
        await driver.findElement(By.id('password')).clear();  // Asegurar campo vacío
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje Toastr
        await takeScreenshot('04_Registro_sin_contraseña');

        // Verificar que se muestre el mensaje de error por falta de contraseña
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorRegisterMessage.replace('Error\n', '').trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // 6. Ahora ingresar la contraseña y registrarse
        await driver.findElement(By.id('password')).sendKeys('rosanna09243');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje Toastr
        await takeScreenshot('05_Registro_con_contraseña');

        // Verificar el mensaje de éxito de registro
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
        // Ajusta el texto a lo que muestre tu Toastr en caso de éxito
        assert.strictEqual(successMessage.replace('Éxito\n', '').trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Mensaje de éxito:</strong> ${successMessage}</li>`;
        await driver.sleep(2000); // Esperar para ver el mensaje

    } catch (error) {
        console.error('Error en la prueba:', error);
        reportContent += `<li><strong>Error en la prueba:</strong> ${error.message}</li>`;
    } finally {
        reportContent += '</ul><p>Prueba completada.</p></body></html>';
        fs.writeFileSync(reportFile, reportContent);
        console.log(`Reporte generado: ${reportFile}`);
        await driver.quit();
    }
})();
