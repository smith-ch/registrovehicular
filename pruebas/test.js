const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const assert = require('assert');
const mocha = require('mocha');
require('mochawesome/register'); // Para generar el reporte HTML

const edge = require('selenium-webdriver/edge');
const options = new edge.Options();
const service = new edge.ServiceBuilder('C:\\Users\\smith\\Desktop\\msedgedriver.exe'); // Ruta del driver de Edge

// Dirección base de la aplicación (asegúrate de que esté corriendo)
const baseUrl = 'http://127.0.0.1:3000/index.html';

// Usuario y contraseña fijos
const USER = "smith";
const PASS = "123";

// Función para tomar capturas de pantalla
async function takeScreenshot(driver, name) {
  const screenshot = await driver.takeScreenshot();
  fs.writeFileSync(`./screenshots/${name}.png`, screenshot, 'base64');
}

// Helper: Espera a que el elemento esté ubicado, visible y habilitado (clickeable)
async function waitForClickable(driver, locator, timeout = 20000) {
  const element = await driver.wait(until.elementLocated(locator), timeout);
  await driver.wait(until.elementIsVisible(element), timeout);
  await driver.wait(until.elementIsEnabled(element), timeout);
  return element;
}

// Función auxiliar para habilitar y asignar valor a un campo mediante JavaScript
async function setCampo(driver, campo, valor) {
  await driver.executeScript(
    "arguments[0].removeAttribute('readonly'); arguments[0].removeAttribute('disabled'); arguments[0].value = '';",
    campo
  );
  await driver.executeScript("arguments[0].value = arguments[1];", campo, valor);
}

// Helper para registrar un usuario nuevo
async function registrarUsuario(driver, username, password) {
  await waitForClickable(driver, By.id('btnGoToRegister'));
  await driver.findElement(By.id('btnGoToRegister')).click();
  await waitForClickable(driver, By.id('btnRegister'));
  
  const userField = await waitForClickable(driver, By.id('username'));
  await setCampo(driver, userField, username);
  
  const passField = await waitForClickable(driver, By.id('password'));
  await setCampo(driver, passField, password);
  
  await driver.findElement(By.id('btnRegister')).click();
  await driver.sleep(1500);
}

// Helper para iniciar sesión
async function iniciarSesion(driver, username, password) {
  const userField = await waitForClickable(driver, By.id('loginUsername'));
  await userField.clear();
  await userField.sendKeys(username);
  
  const passField = await waitForClickable(driver, By.id('loginPassword'));
  await passField.clear();
  await passField.sendKeys(password);
  
  await driver.findElement(By.id('btnLogin')).click();
  await driver.wait(until.elementLocated(By.id('vehicleForm')), 20000);
}

// Helper para completar el formulario del vehículo
async function completarFormularioVehiculo(driver, datos) {
  const { marca, modelo, anio, color, placa, tipo } = datos;
  
  const marcaField = await waitForClickable(driver, By.id('marca'));
  await setCampo(driver, marcaField, marca);
  
  const modeloField = await waitForClickable(driver, By.id('modelo'));
  await setCampo(driver, modeloField, modelo);
  
  const anioField = await waitForClickable(driver, By.id('anio'));
  await setCampo(driver, anioField, anio);
  
  const colorField = await waitForClickable(driver, By.id('color'));
  await setCampo(driver, colorField, color);
  
  const placaField = await waitForClickable(driver, By.id('placa'));
  await setCampo(driver, placaField, placa);
  
  // Actualizamos el campo 'tipo' y disparar el evento change para cargar características
  const tipoField = await waitForClickable(driver, By.id('tipo'));
  await setCampo(driver, tipoField, tipo);
  // Ejecutar jQuery change para cargar las opciones en #caracteristicas
  await driver.executeScript("$('#tipo').change();");

  await waitForClickable(driver, By.id('btnSiguiente'));
  await driver.findElement(By.id('btnSiguiente')).click();
  await driver.sleep(1500);
}

// Helper para seleccionar características del vehículo
async function seleccionarCaracteristicas(driver, seleccionar = true) {
  await waitForClickable(driver, By.id('btnRegistrar'));
  if (seleccionar) {
    // Esperar que se cargue el contenedor de características
    await driver.wait(until.elementLocated(By.css('#caracteristicas input[type="checkbox"]')), 10000);
    // Se espera un tiempo adicional para que se rendericen todos los checkboxes
    await driver.sleep(3000);
    // Actualizamos el selector para buscar en el contenedor '#caracteristicas'
    const checkboxes = await driver.findElements(By.css('#caracteristicas input[type="checkbox"]'));
    if (checkboxes.length === 0) {
      throw new Error('No se encontraron checkboxes de características');
    }
    await checkboxes[0].click();
  }
  await driver.findElement(By.id('btnRegistrar')).click();
  await driver.sleep(1500);
}

describe('Pruebas Automatizadas - Sistema de Registro Vehicular', function () {
  this.timeout(60000);
  let driver;

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser('MicrosoftEdge')
      .setEdgeService(service)
      .setEdgeOptions(options)
      .build();
    await driver.get(baseUrl);
  });

  afterEach(async () => {
    await driver.quit();
  });

  // 1. Registro de Usuario
  describe('Registro de Usuario', () => {
    it('Prueba positiva: Registro correcto', async () => {
      const testUser = `test_${Date.now()}`;
      await registrarUsuario(driver, testUser, PASS);
      await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-success')), 20000);
      await takeScreenshot(driver, 'registro_usuario');
    });

    it('Prueba negativa: Usuario ya existe', async () => {
      const testUser = "user_existente";
      await registrarUsuario(driver, testUser, PASS);
      await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-success')), 20000);
      await driver.sleep(2000);
      await registrarUsuario(driver, testUser, PASS);
      await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 20000);
      const errorElem = await driver.findElement(By.css('#toast-container > div.toast-error'));
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace('×', '').trim();
      assert.strictEqual(errorMessage, 'El usuario ya existe');
      await takeScreenshot(driver, 'registro_usuario_error');
    });
  });

  // 2. Inicio de Sesión
  describe('Inicio de Sesión', () => {
    beforeEach(async () => {
      await registrarUsuario(driver, USER, PASS);
      await driver.get(baseUrl);
    });

    it('Prueba positiva: Inicio de sesión correcto', async () => {
      await iniciarSesion(driver, USER, PASS);
      const form = await driver.findElement(By.id('vehicleForm'));
      assert.ok(form);
      await takeScreenshot(driver, 'inicio_sesion');
    });

    it('Prueba negativa: Credenciales incorrectas', async () => {
      await iniciarSesion(driver, 'wronguser', 'wrongpass');
      await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 20000);
      const errorElem = await driver.findElement(By.css('#toast-container > div.toast-error'));
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace('×', '').trim();
      assert.strictEqual(errorMessage, 'Credenciales incorrectas');
      await takeScreenshot(driver, 'inicio_sesion_error');
    });

    it('Prueba negativa extra: Campos vacíos en login', async () => {
      await waitForClickable(driver, By.id('btnLogin'));
      await driver.findElement(By.id('btnLogin')).click();
      await driver.sleep(1500);
      await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 20000);
      const errorElem = await driver.findElement(By.css('#toast-container > div.toast-error'));
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace('×', '').trim();
      assert.strictEqual(errorMessage, 'Credenciales incorrectas');
      await takeScreenshot(driver, 'login_campos_vacios');
    });
  });

  // 3. Registro de Datos del Vehículo
  describe('Registro de Datos del Vehículo', () => {
    beforeEach(async () => {
      await registrarUsuario(driver, USER, PASS);
      await iniciarSesion(driver, USER, PASS);
      await driver.wait(until.elementLocated(By.id('marca')), 10000);
    });

    it('Prueba positiva: Datos del vehículo ingresados correctamente', async () => {
      const datosVehiculo = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Rojo',
        placa: 'ABC123',
        tipo: 'sedan'
      };
      await completarFormularioVehiculo(driver, datosVehiculo);
      const featuresForm = await driver.wait(until.elementLocated(By.id('featuresForm')), 5000);
      assert.ok(await featuresForm.isDisplayed());
      await takeScreenshot(driver, 'registro_vehiculo');
    });

    it('Prueba negativa: Falta completar campos obligatorios', async () => {
      await driver.findElement(By.id('btnSiguiente')).click();
      const errorElem = await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 5000);
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace(/×/g, '').trim();
      assert.strictEqual(errorMessage, 'Complete todos los campos requeridos');
      await takeScreenshot(driver, 'registro_vehiculo_error');
    });

    it('Prueba negativa extra: Año inválido (no numérico)', async () => {
      const anioField = await waitForClickable(driver, By.id('anio'));
      await setCampo(driver, anioField, 'dos mil veinte');
      await driver.findElement(By.id('btnSiguiente')).click();
      const errorElem = await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 5000);
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace(/×/g, '').trim();
      assert.strictEqual(errorMessage, 'Complete todos los campos requeridos');
      await takeScreenshot(driver, 'registro_vehiculo_anio_invalido');
    });
  });

  // 4. Selección de Características del Vehículo
  describe('Selección de Características del Vehículo', () => {
    beforeEach(async () => {
      await registrarUsuario(driver, USER, PASS);
      await iniciarSesion(driver, USER, PASS);
      const datosVehiculo = {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Rojo',
        placa: 'ABC123',
        tipo: 'sedan'
      };
      await completarFormularioVehiculo(driver, datosVehiculo);
      await driver.wait(until.elementLocated(By.id('featuresForm')), 10000);
      await driver.sleep(3000);
      await driver.wait(until.elementIsVisible(await driver.findElement(By.id('btnRegistrar'))), 5000);
    });

    it('Prueba positiva: Selección correcta de características', async () => {
      // Esperar que se cargue al menos un checkbox dentro de '#caracteristicas'
      await driver.wait(until.elementsLocated(By.css('#caracteristicas input[type="checkbox"]')), 10000);
      const checkboxes = await driver.findElements(By.css('#caracteristicas input[type="checkbox"]'));
      if (checkboxes.length === 0) {
        throw new Error('No se encontraron checkboxes de características');
      }
      await checkboxes[0].click();
      await driver.findElement(By.id('btnRegistrar')).click();
      await driver.wait(until.elementLocated(By.id('resumenForm')), 5000);
      await takeScreenshot(driver, 'caracteristicas');
    });
    
    it('Prueba negativa: No se selecciona ninguna característica', async () => {
      await driver.findElement(By.id('btnRegistrar')).click();
      const errorElem = await driver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 5000);
      let errorMessage = await errorElem.getText();
      errorMessage = errorMessage.replace(/×/g, '').trim();
      assert.strictEqual(errorMessage, 'Seleccione al menos una característica');
      await takeScreenshot(driver, 'caracteristicas_error');
    });
  });

  // 5. Resumen y Descarga de PDF
  describe('Resumen y Descarga de PDF', () => {
    let mainDriver;

    before(async () => {
      mainDriver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(service)
        .setEdgeOptions(options)
        .build();
      
      await mainDriver.get(baseUrl);
      await registrarUsuario(mainDriver, USER, PASS);
      await iniciarSesion(mainDriver, USER, PASS);
      await completarFormularioVehiculo(mainDriver, {
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Rojo',
        placa: 'ABC123',
        tipo: 'sedan'
      });
      await seleccionarCaracteristicas(mainDriver);
    });

    after(async () => {
      await mainDriver.quit();
    });

    it('Prueba positiva: Visualización y descarga de PDF', async () => {
      const btnDescargar = await mainDriver.wait(until.elementLocated(By.id('btnDescargarPDF')), 10000);
      await mainDriver.executeScript("arguments[0].click();", btnDescargar);
      await mainDriver.sleep(5000);
      const toast = await mainDriver.wait(until.elementLocated(By.css('#toast-container > div.toast-success')), 10000);
      const texto = (await toast.getText()).replace(/×/g, '').trim();
      assert.match(texto, /PDF generado/i);
      await takeScreenshot(mainDriver, 'resumen_pdf');
    });

    it('Prueba negativa: Descargar PDF sin completar el registro', async () => {
      const tempDriver = await new Builder()
        .forBrowser('MicrosoftEdge')
        .setEdgeService(service)
        .setEdgeOptions(options)
        .build();

      try {
        await tempDriver.get(baseUrl);
        await registrarUsuario(tempDriver, 'tempUser', PASS);
        await iniciarSesion(tempDriver, 'tempUser', PASS);
        const btnDescargar = await tempDriver.wait(until.elementLocated(By.id('btnDescargarPDF')), 10000);
        await tempDriver.executeScript("arguments[0].click();", btnDescargar);
        const errorElem = await tempDriver.wait(until.elementLocated(By.css('#toast-container > div.toast-error')), 10000);
        const errorMessage = (await errorElem.getText()).replace(/×/g, '').trim();
        assert.strictEqual(errorMessage, 'Debe completar el registro del vehículo antes de descargar el PDF.');
        await takeScreenshot(tempDriver, 'resumen_pdf_error');
      } finally {
        await tempDriver.quit();
      }
    });
  });
});
