const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const edge = require('selenium-webdriver/edge');

(async function testRegistroVehiculos() {
    // Configurar Microsoft Edge WebDriver
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(new edge.ServiceBuilder("C:\\Users\\smith\\Desktop\\msedgedriver.exe")) // Ajusta la ruta
        .build();

    const screenshotsDir = path.join(__dirname, 'screenshots5');
    const reportFile = path.join(__dirname, 'test_report5.html');
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

    // Crear carpeta de capturas si no existe
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    // Función para tomar capturas de pantalla
    async function takeScreenshot(stepName) {
        const screenshot = await driver.takeScreenshot();
        const filePath = path.join(screenshotsDir, `${stepName}.png`);
        fs.writeFileSync(filePath, screenshot, 'base64');
        reportContent += `<li><strong>${stepName}:</strong> Captura tomada</li>`;
    }

    try {
        // 1. Abrir la página
        await driver.get('http://127.0.0.1:3000/index.html');
        await takeScreenshot('01_Navegar_pagina_inicio');

        // 2. Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('02_Clic_boton_login_sin_registro');

        // Verificar mensaje de error
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.trim(), '×\nCredenciales incorrectas');
        reportContent += `<li><strong>Error Login:</strong> ${errorLoginMessage}</li>`;

        // 3. Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(2000);
        await takeScreenshot('03_Navegar_registro');

        // 4. Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('btnRegister')).click();
        
        // Esperar al mensaje de error
        let errorRegisterMessage = await driver.wait(until.elementLocated(By.css('.toast-error')), 5000).getText();
        assert.strictEqual(errorRegisterMessage.trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Error Registro:</strong> ${errorRegisterMessage}</li>`;

        // 5. Registrar una cuenta correctamente con nombre de usuario y contraseña
        await driver.findElement(By.id('password')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000);
        await takeScreenshot('05_Registro_exitoso');

        // Verificar éxito en el registro
        let successMessage = await driver.wait(until.elementLocated(By.css('.toast-success')), 5000).getText();
        assert.strictEqual(successMessage.trim(), 'Cuenta creada exitosamente');
        reportContent += `<li><strong>Registro exitoso:</strong> ${successMessage}</li>`;

        // 6. Intentar iniciar sesión con contraseña incorrecta
        await driver.findElement(By.id('loginUsername')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('loginPassword')).sendKeys('incorrecto123');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('06_Login_contraseña_incorrecta');

        // Validar mensaje de error
        errorLoginMessage = await driver.wait(until.elementLocated(By.css('.toast-error')), 5000).getText();
        assert.strictEqual(errorLoginMessage.trim(), '×\nCredenciales incorrectas');
        reportContent += `<li><strong>Error Login:</strong> ${errorLoginMessage}</li>`;

        // 7. Iniciar sesión con la contraseña correcta
        await driver.findElement(By.id('loginPassword')).clear();
        await driver.findElement(By.id('loginPassword')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('07_Login_exitoso');

        // Validar mensaje de éxito
        successMessage = await driver.wait(until.elementLocated(By.css('.toast-success')), 5000).getText();
        assert.strictEqual(successMessage.trim(), 'Inicio de sesión exitoso');
        reportContent += `<li><strong>Inicio de sesión:</strong> ${successMessage}</li>`;

        // 8. Completar el registro del vehículo
        await driver.findElement(By.id('marca')).sendKeys('Toyota');
        await driver.findElement(By.id('modelo')).sendKeys('Corolla');
        await driver.findElement(By.id('anio')).sendKeys('2022');
        await driver.findElement(By.id('color')).sendKeys('Rojo');
        await driver.findElement(By.id('placa')).sendKeys('ABC123');
        await driver.findElement(By.id('tipo')).sendKeys('sedan');
        await driver.findElement(By.id('btnSiguiente')).click();
        await driver.sleep(2000);
        await takeScreenshot('08_Registro_vehiculo');

        // 9. Seleccionar características del vehículo y registrar el vehículo
        await driver.findElement(By.css('input[value="Automática"]')).click();
        await driver.findElement(By.css('input[value="Gasolina"]')).click();
        await driver.findElement(By.css('input[value="Aire Acondicionado"]')).click();
        await driver.sleep(1000);
        await driver.findElement(By.id('btnRegistrar')).click();
        await driver.sleep(2000);
        await takeScreenshot('09_Registrar_caracteristicas');

        // 10. Verificar registro exitoso del vehículo
        let successRegisterMessage = await driver.wait(until.elementLocated(By.css('.toast-success')), 5000).getText();
        assert.strictEqual(successRegisterMessage.trim(), 'Registro exitoso');
        reportContent += `<li><strong>Registro de vehículo:</strong> ${successRegisterMessage}</li>`;

        console.log('✅ Prueba completada con éxito');

    } catch (error) {
        console.error('❌ Error en la prueba:', error);
        reportContent += `<li><strong>Error:</strong> ${error.message}</li>`;
    } finally {
        reportContent += '</ul><p>Prueba completada.</p></body></html>';
        fs.writeFileSync(reportFile, reportContent);
        console.log(`Reporte generado: ${reportFile}`);
        await driver.quit();
    }
})();
