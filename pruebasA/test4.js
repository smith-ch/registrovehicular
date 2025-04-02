const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const edge = require('selenium-webdriver/edge'); // Importar Edge

(async function testRegistroVehiculos() {
    // Configurar Edge WebDriver
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(new edge.ServiceBuilder("C:\\Users\\smith\\Desktop\\msedgedriver.exe")) // Ruta correcta al WebDriver de Edge
        .build();

    const screenshotsDir = path.join(__dirname, 'screenshots4');
    const reportFile = path.join(__dirname, 'test_report4.html');
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
        // Navegar al archivo index.html
        await driver.get('file:///' + __dirname + '/../index.html');
        await takeScreenshot('01_Navegar a la página de inicio');

        // Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('02_Clic en el botón de inicio de sesión');

        // Verificar mensaje de error
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.ok(errorLoginMessage.includes('Credenciales incorrectas'), `Mensaje recibido: ${errorLoginMessage}`);
        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(2000);
        await takeScreenshot('03_Ir al formulario de registro');

        // Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000);
        await takeScreenshot('04_Clic en el botón de registro sin contraseña');

        // Verificar mensaje de error en registro
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.ok(errorRegisterMessage.includes('Todos los campos son requeridos'), `Mensaje recibido: ${errorRegisterMessage}`);
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // Registrar usuario con contraseña
        await driver.findElement(By.id('password')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(2000);
        await takeScreenshot('05_Clic en el botón de registro con contraseña');

        // Verificar mensaje de éxito
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.ok(successMessage.includes('Cuenta creada exitosamente'), `Mensaje recibido: ${successMessage}`);
        reportContent += `<li><strong>Mensaje de éxito en registro:</strong> ${successMessage}</li>`;

        // Intentar iniciar sesión con contraseña incorrecta
        await driver.findElement(By.id('loginUsername')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('loginPassword')).sendKeys('PedroLuis123456');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('06_Iniciar sesión con contraseña incorrecta');

        // Verificar mensaje de error
        errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.ok(errorLoginMessage.includes('Credenciales incorrectas'), `Mensaje recibido: ${errorLoginMessage}`);
        reportContent += `<li><strong>Mensaje de error al iniciar sesión:</strong> ${errorLoginMessage}</li>`;

        // Iniciar sesión con contraseña correcta
        await driver.findElement(By.id('loginPassword')).clear();
        await driver.findElement(By.id('loginPassword')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000);
        await takeScreenshot('07_Iniciar sesión con contraseña correcta');

        // Verificar mensaje de éxito
        successMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.ok(successMessage.includes('Inicio de sesión exitoso'), `Mensaje recibido: ${successMessage}`);
        reportContent += `<li><strong>Mensaje de éxito al iniciar sesión:</strong> ${successMessage}</li>`;

        // Completar formulario de datos personales
        await driver.findElement(By.id('nombre')).sendKeys('Juan');
        await driver.findElement(By.id('provincia')).sendKeys('Provincia1');
        await driver.findElement(By.id('ciudad')).sendKeys('');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000);
        await takeScreenshot('08_Clic en siguiente con ciudad vacía');

        // Verificar mensaje de error
        let errorDataMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.ok(errorDataMessage.includes('Toda la información es requerida'), `Mensaje recibido: ${errorDataMessage}`);
        reportContent += `<li><strong>Error en formulario de datos personales:</strong> ${errorDataMessage}</li>`;

        // Corregir formulario y enviarlo
        await driver.findElement(By.id('ciudad')).sendKeys('Ciudad1');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000);
        await takeScreenshot('09_Clic en siguiente con datos completos');

        // Verificar mensaje de éxito
        let successDataMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.ok(successDataMessage.includes('Formulario enviado correctamente'), `Mensaje recibido: ${successDataMessage}`);
        reportContent += `<li><strong>Mensaje de éxito en datos personales:</strong> ${successDataMessage}</li>`;

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
