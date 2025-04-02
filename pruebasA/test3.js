const { Builder, By, Key, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const edge = require('selenium-webdriver/edge'); // Usamos Edge

(async function testRegistroVehiculos() {
    // Crear una instancia del navegador Edge
    let driver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(new edge.ServiceBuilder("C:\\Users\\smith\\Desktop\\msedgedriver.exe"))
        .build();

    // Definir directorio de capturas y reporte
    const screenshotsDir = path.join(__dirname, 'screenshots3');
    const reportFile = path.join(__dirname, 'test_report3.html');
    let reportContent = `
        <html>
        <head>
            <title>Reporte de Pruebas Automatizadas - Test 3</title>
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
            <h1>Resultados de Pruebas Automatizadas - Test 3</h1>
            <p>Este reporte documenta cada paso de la prueba automatizada ejecutada.</p>
            <ul>
    `;

    // Crear directorio de capturas si no existe
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
        // 1️⃣ Navegar a la página de inicio y realizar login con un usuario preexistente
        await driver.get('http://127.0.0.1:3000/index.html');
        await takeScreenshot('01_Navegar_a_la_pagina_de_inicio');

        // Rellenar los campos de login (suponiendo que el formulario de login ya está visible)
        await driver.findElement(By.id('loginUsername')).sendKeys('Pedro Luis');
        await driver.findElement(By.id('loginPassword')).sendKeys('pedroLuis1234');
        await driver.findElement(By.id('btnLogin')).click();
        await driver.sleep(2000); // Esperar a que aparezca el mensaje
        await takeScreenshot('02_Iniciar_sesion_con_exito');

        let successLoginMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successLoginMessage.replace('Éxito\n', '').trim(), 'Inicio de sesión exitoso');
        reportContent += `<li><strong>Mensaje de éxito al iniciar sesión:</strong> ${successLoginMessage}</li>`;

        // 2️⃣ Se asume que tras el login se muestra el formulario de datos personales.
        // Llenar el formulario, dejando intencionalmente el campo "ciudad" vacío para provocar un error.
        await driver.findElement(By.id('nombre')).sendKeys('Juan');
        await driver.findElement(By.id('provincia')).sendKeys('Provincia1');
        // Asegurarse de que "ciudad" esté vacío:
        await driver.findElement(By.id('ciudad')).clear();
        await driver.findElement(By.id('sector')).sendKeys('Sector1');
        await driver.findElement(By.id('calle')).sendKeys('Calle1');
        await driver.findElement(By.id('carrera')).sendKeys('software');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000);
        await takeScreenshot('03_Clic_siguiente_sin_ciudad');

        // 3️⃣ Verificar el mensaje de error por falta de información (ciudad)
        let errorDataMessage = await driver.findElement(By.css('.toast-error')).getText();
        assert.strictEqual(errorDataMessage.trim(), '×\nCredenciales incorrectas');
        reportContent += `<li><strong>Mensaje de error en datos personales:</strong> ${errorDataMessage}</li>`;

        // 4️⃣ Completar el campo "ciudad" y enviar el formulario nuevamente
        await driver.findElement(By.id('ciudad')).sendKeys('Ciudad1');
        await driver.findElement(By.id('btnNext')).click();
        await driver.sleep(2000);
        await takeScreenshot('04_Clic_siguiente_con_ciudad');

        // 5️⃣ Verificar el mensaje de éxito al enviar correctamente el formulario
        let successDataMessage = await driver.findElement(By.css('.toast-success')).getText();
        assert.strictEqual(successDataMessage.replace('Éxito\n', '').trim(), 'Enviado\nFormulario enviado correctamente');
        reportContent += `<li><strong>Mensaje de éxito en datos personales:</strong> ${successDataMessage}</li>`;

        reportContent += `</ul><p>✅ Prueba completada correctamente.</p></body></html>`;
    } catch (error) {
        console.error('Error en la prueba:', error);
        reportContent += `<li><strong>Error en la prueba:</strong> ${error.message}</li></ul><p>❌ Prueba finalizada con errores.</p></body></html>`;
    } finally {
        fs.writeFileSync(reportFile, reportContent);
        console.log(`Reporte generado: ${reportFile}`);
        await driver.quit();
    }
})();
