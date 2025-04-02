const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const edge = require('selenium-webdriver/edge'); // Asegúrate de usar esta línea

(async function testRegistroVehiculos() {
    // Crear una instancia del navegador Edge
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')  // Asegúrate de usar MicrosoftEdge
        .setEdgeService(new edge.ServiceBuilder("C:\\Users\\smith\\Desktop\\msedgedriver.exe")) // Ruta correcta
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
        // Navegar a la carpeta donde está el index.html
        await driver.get('http://127.0.0.1:3000/index.html');
        await takeScreenshot('01_Navegar a la página de inicio');

        // Intentar iniciar sesión sin registrarse
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(1000); // Esperar un segundo para ver el mensaje
        await takeScreenshot('02_Clic en el botón de inicio de sesión');

        // Verificar el mensaje de error de Toastr
        let errorLoginMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorLoginMessage.replace('Error\n', '').trim(), 'Nombre de usuario o contraseña incorrectos');
        reportContent += `<li><strong>Mensaje de error de inicio de sesión:</strong> ${errorLoginMessage}</li>`;

        // Ir al formulario de registro
        await driver.findElement(By.id('btnGoToRegister')).click();
        await driver.sleep(1000); // Esperar para ver el formulario
        await takeScreenshot('03_Ir al formulario de registro');

        // Intentar registrarse sin contraseña
        await driver.findElement(By.id('username')).sendKeys('Rosanna Mejia Acosta');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('04_Clic en el botón de registro sin contraseña');

        // Verificar que se muestre el mensaje de error
        let errorRegisterMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorRegisterMessage.replace('Error\n', '').trim(), 'Todos los campos son requeridos');
        reportContent += `<li><strong>Mensaje de error de registro:</strong> ${errorRegisterMessage}</li>`;

        // Ahora ingresar la contraseña y registrarse
        await driver.findElement(By.id('password')).sendKeys('rosanna09243');
        await driver.findElement(By.id('btnRegister')).click();
        await driver.sleep(1000); // Esperar para ver el mensaje
        await takeScreenshot('05_Clic en el botón de registro con contraseña');

        // Verificar el mensaje de éxito
        let successMessage = await driver.findElement(By.css('.toast-success')).getText();
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
        // Cerrar el navegador
        await driver.quit();
    }
})();
