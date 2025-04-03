const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const assert = require('assert');
const mocha = require('mocha');
require('mochawesome/register'); // Para generar el reporte HTML

const edge = require('selenium-webdriver/edge');
const options = new edge.Options();
const service = new edge.ServiceBuilder('C:\\Users\\smith\\Desktop\\msedgedriver.exe'); // Ruta del driver de Edge

const baseUrl = 'http://127.0.0.1:3000/index.html'; // Asegúrate de que tu app esté corriendo localmente

// Función para tomar capturas de pantalla
async function takeScreenshot(driver, name) {
  const screenshot = await driver.takeScreenshot();
  fs.writeFileSync(`./screenshots/${name}.png`, screenshot, 'base64');
}

// Descripción de las pruebas
describe('Pruebas Automatizadas - Sistema de Registro Vehicular', function () {
  this.timeout(30000);
  let driver;

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser('MicrosoftEdge')  // Usamos Microsoft Edge
      .setEdgeService(service)  // Configuración del servicio de Edge
      .setEdgeOptions(options)  // Configuración de opciones adicionales si es necesario
      .build();

    await driver.get(baseUrl);  // Navegar a la URL base
  });

  afterEach(async () => {
    await driver.quit();  // Cerrar el navegador después de cada prueba
  });

  // 1. Registro de nuevo usuario
  it('1. Registro de nuevo usuario - Prueba positiva', async () => {
    await driver.findElement(By.id('btnGoToRegister')).click();
    await driver.wait(until.elementLocated(By.id('btnRegister')), 5000);

    await driver.findElement(By.id('username')).sendKeys('testuser');
    await driver.findElement(By.id('password')).sendKeys('test123');
    await driver.findElement(By.id('btnRegister')).click();

    await takeScreenshot(driver, 'registro_usuario');
  });

  it('1. Registro de nuevo usuario - Prueba negativa (usuario ya existe)', async () => {
    await driver.findElement(By.id('btnGoToRegister')).click();
    await driver.wait(until.elementLocated(By.id('btnRegister')), 5000);

    await driver.findElement(By.id('username')).sendKeys('testuser'); // Usuario ya existente
    await driver.findElement(By.id('password')).sendKeys('test123');
    await driver.findElement(By.id('btnRegister')).click();

    // Validar mensaje de error
    const errorMessage = await driver.findElement(By.css('.error-message')).getText();
    assert.strictEqual(errorMessage, 'El usuario ya existe.');

    await takeScreenshot(driver, 'registro_usuario_error');
  });

  // 2. Inicio de sesión
  it('2. Inicio de sesión - Prueba positiva', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();

    await driver.wait(until.elementLocated(By.id('vehicleForm')), 5000);
    await takeScreenshot(driver, 'inicio_sesion');
  });

  it('2. Inicio de sesión - Prueba negativa (credenciales incorrectas)', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('wronguser');
    await driver.findElement(By.id('loginPassword')).sendKeys('wrongpass');
    await driver.findElement(By.id('btnLogin')).click();

    // Validar mensaje de error
    const errorMessage = await driver.findElement(By.css('.error-message')).getText();
    assert.strictEqual(errorMessage, 'Usuario o contraseña incorrectos.');

    await takeScreenshot(driver, 'inicio_sesion_error');
  });

  // 3. Registro de datos del vehículo
  it('3. Registro de datos del vehículo - Prueba positiva', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();

    await driver.wait(until.elementLocated(By.id('marca')), 5000);
    await driver.findElement(By.id('marca')).sendKeys('Toyota');
    await driver.findElement(By.id('modelo')).sendKeys('Corolla');
    await driver.findElement(By.id('anio')).sendKeys('2020');
    await driver.findElement(By.id('color')).sendKeys('Rojo');
    await driver.findElement(By.id('placa')).sendKeys('ABC123');
    await driver.findElement(By.id('tipo')).sendKeys('sedan');
    await driver.findElement(By.id('btnSiguiente')).click();

    await takeScreenshot(driver, 'registro_vehiculo');
  });

  it('3. Registro de datos del vehículo - Prueba negativa (campo vacío)', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();

    await driver.wait(until.elementLocated(By.id('marca')), 5000);
    await driver.findElement(By.id('btnSiguiente')).click();

    // Validar que el sistema no avanza y muestra un mensaje de error
    const errorMessage = await driver.findElement(By.css('.error-message')).getText();
    assert.strictEqual(errorMessage, 'El campo marca es obligatorio.');

    await takeScreenshot(driver, 'registro_vehiculo_error');
  });

  // 4. Selección de características
  it('4. Selección de características - Prueba positiva', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();
    await driver.findElement(By.id('btnSiguiente')).click();

    await driver.wait(until.elementLocated(By.id('btnRegistrar')), 5000);
    // Simula selección de características (asumiendo que son checkboxes agregados con JS)
    // Ejemplo: await driver.findElement(By.css('input[value="Aire Acondicionado"]')).click();

    await driver.findElement(By.id('btnRegistrar')).click();
    await takeScreenshot(driver, 'caracteristicas');
  });

  it('4. Selección de características - Prueba negativa (sin selección)', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();
    await driver.findElement(By.id('btnSiguiente')).click();

    await driver.findElement(By.id('btnRegistrar')).click();

    // Validar que el sistema no avanza sin seleccionar características
    const errorMessage = await driver.findElement(By.css('.error-message')).getText();
    assert.strictEqual(errorMessage, 'Debe seleccionar al menos una característica.');

    await takeScreenshot(driver, 'caracteristicas_error');
  });

  // 5. Visualización del resumen y descarga del PDF
  it('5. Visualización del resumen y descarga del PDF - Prueba positiva', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();
    await driver.findElement(By.id('btnSiguiente')).click();
    await driver.findElement(By.id('btnRegistrar')).click();

    await driver.wait(until.elementLocated(By.id('btnDescargarPDF')), 5000);
    await takeScreenshot(driver, 'resumen_pdf');
  });

  it('5. Visualización del resumen y descarga del PDF - Prueba negativa (sin completar registro)', async () => {
    await driver.findElement(By.id('loginUsername')).sendKeys('testuser');
    await driver.findElement(By.id('loginPassword')).sendKeys('test123');
    await driver.findElement(By.id('btnLogin')).click();

    await driver.findElement(By.id('btnDescargarPDF')).click();

    // Validar que no se puede descargar sin completar el registro
    const errorMessage = await driver.findElement(By.css('.error-message')).getText();
    assert.strictEqual(errorMessage, 'Debe completar el registro del vehículo antes de descargar el PDF.');

    await takeScreenshot(driver, 'resumen_pdf_error');
  });

});
