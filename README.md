# Registro Vehicular - Pruebas Automatizadas con Selenium

## Descripción del Proyecto
Este proyecto implementa pruebas automatizadas para una aplicación de registro vehicular utilizando **Selenium WebDriver** en **JavaScript**. La automatización permite verificar el correcto funcionamiento del sistema, asegurando que los usuarios puedan registrar sus cuentas, iniciar sesión y gestionar información de vehículos de manera eficiente.

El objetivo principal es garantizar que todas las funcionalidades clave de la aplicación respondan correctamente bajo distintos escenarios, incluyendo datos válidos, errores comunes y validaciones.

## Características Principales
- Automatización de pruebas funcionales en navegador con Selenium.
- Generación de reportes en HTML con Mochawesome.
- Captura de pantalla automática ante fallas o verificaciones importantes.
- Validaciones de formularios y flujos críticos del sistema.

## Tecnologías Utilizadas
- **Node.js**
- **Selenium WebDriver**
- **Mocha** (framework de pruebas)
- **Chai** (aserciones)
- **Mochawesome** (reportes de prueba en HTML)
- **Chromedriver**
- **HTML/CSS** (para el frontend de la aplicación)

## Requisitos del Sistema
Antes de ejecutar el proyecto, asegúrate de contar con los siguientes requisitos:

- **Node.js** (versión 14 o superior)
- **npm** (gestor de paquetes de Node.js)
- **Google Chrome** (o cualquier otro navegador compatible con Selenium)
- **Chromedriver** (u otro WebDriver según el navegador que uses)
- **Sistema operativo compatible:** Windows, macOS o Linux

## Instalación y Configuración
Para instalar y configurar el proyecto, sigue estos pasos:

1. **Clona este repositorio:**
   ```sh
   git clone https://github.com/smith-ch/registrovehicular.git
   cd registrovehicular
   ```

2. **Instala las dependencias necesarias:**
   ```sh
   npm install
   ```

3. **Configura el WebDriver:**
   Asegúrate de tener `chromedriver` o el driver correspondiente instalado y disponible en el PATH del sistema.

## Estructura del Proyecto
```
registrovehicular/
├── pruebas/
│   ├── test.js                # Pruebas automatizadas principales
│   ├── screenshots/           # Capturas de pantalla generadas
│   └── mochawesome-report/   # Reporte HTML generado por mochawesome
├── src/                      # Código fuente de la aplicación web
├── README.md                 # Documentación del proyecto
├── package.json              # Configuración de npm
└── ...
```

## Ejecución de las Pruebas
Para ejecutar las pruebas automatizadas, usa el siguiente comando:

```sh
npm test
```

Esto ejecutará las pruebas definidas en `pruebas/test.js` y generará un reporte HTML en `pruebas/mochawesome-report/`.

### Ver Reportes de Pruebas
Después de ejecutar las pruebas:
1. Abre el archivo `pruebas/mochawesome-report/mochawesome.html` en tu navegador para visualizar el informe interactivo.
2. Se mostrará el resultado de cada caso de prueba con detalles y capturas si están habilitadas.

## Historias de Usuario
A continuación, se detallan las historias de usuario implementadas en el proyecto:

### ✅ Historia de Usuario 1: Registro de Usuario
**Como nuevo usuario, quiero crear una cuenta en el sistema, para poder iniciar sesión y usar la aplicación.**

- **Criterios de aceptación:**
  ✔ Debe permitir ingresar nombre de usuario y contraseña.
  ✔ Al hacer clic en “Registrar”, debe crearse la cuenta correctamente.
  ✔ Debe mostrarse un mensaje de confirmación.

- **Criterios de rechazo:**
  ❌ Campos vacíos deben impedir el registro.
  ❌ Si el nombre de usuario ya existe, debe mostrar un mensaje de error.

### ✅ Historia de Usuario 2: Inicio de Sesión
**Como usuario registrado, quiero poder iniciar sesión con mi cuenta, para acceder al sistema y registrar vehículos.**

- **Criterios de aceptación:**
  ✔ Debe validar las credenciales ingresadas.
  ✔ Si son correctas, debe redirigir al formulario de vehículos.

- **Criterios de rechazo:**
  ❌ Si las credenciales son inválidas, debe mostrar un error.
  ❌ Campos vacíos deben impedir el inicio de sesión.

### ✅ Historia de Usuario 3: Registro de Datos del Vehículo
**Como usuario autenticado, quiero ingresar los datos de mi vehículo, para tener un registro de sus especificaciones básicas.**

- **Criterios de aceptación:**
  ✔ Debe permitir ingresar marca, modelo, año, color, placa y tipo.
  ✔ Al hacer clic en “Siguiente”, debe guardar los datos y avanzar al siguiente paso.

- **Criterios de rechazo:**
  ❌ Si algún campo obligatorio está vacío, no debe avanzar.
  ❌ Si el año es inválido, debe mostrar un mensaje de error.

### ✅ Historia de Usuario 4: Selección de Características del Vehículo
**Como usuario, quiero seleccionar características adicionales de mi vehículo, para detallar aún más su información.**

- **Criterios de aceptación:**
  ✔ Debe mostrar una lista de características para elegir.
  ✔ Al hacer clic en “Registrar”, debe guardar la selección.

- **Criterios de rechazo:**
  ❌ No se debe permitir avanzar si no se selecciona al menos una característica (si aplica).

### ✅ Historia de Usuario 5: Visualización del Resumen y Descarga de PDF
**Como usuario, quiero ver un resumen de toda la información ingresada y poder descargarla en PDF, para tener un respaldo de los datos del vehículo.**

- **Criterios de aceptación:**
  ✔ Debe mostrar los datos del vehículo y sus características en una tabla.
  ✔ Al hacer clic en “Descargar PDF”, debe generarse el archivo correctamente.

- **Criterios de rechazo:**
  ❌ Si no hay datos cargados, no se debe permitir la descarga.
  ❌ Si el archivo no se genera correctamente, debe mostrar un mensaje de error.

## Capturas de Pantalla
Las capturas de pantalla de cada prueba automatizada se generan automáticamente y se almacenan en la carpeta `pruebas/screenshots`. Esto permite auditar visualmente el comportamiento de la aplicación durante las pruebas.

## Buenas Prácticas Aplicadas
- Separación clara entre lógica de pruebas y código fuente.
- Uso de `assert` para comprobaciones lógicas y validaciones.
- Generación de reportes HTML para facilitar la revisión.
- Documentación de todas las historias de usuario con criterios bien definidos.
- Capturas de pantalla automáticas en escenarios clave.

## Contribuciones
Si deseas contribuir a este proyecto:
1. **Haz un fork del repositorio**
2. **Crea una nueva rama (`git checkout -b feature-nueva-funcionalidad`)**
3. **Realiza los cambios y confirma los commits (`git commit -m 'Añadida nueva funcionalidad'`)**
4. **Sube los cambios (`git push origin feature-nueva-funcionalidad`)**
5. **Abre un Pull Request en GitHub**

## Licencia
Este proyecto está licenciado bajo la Licencia Apache 2.0. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## Contacto
Si tienes dudas o sugerencias, puedes comunicarte a través de:
- GitHub: [smith-ch](https://github.com/smith-ch)
- Correo Electrónico: [smithrodriguez345@gmail.com]

---
¡Gracias por revisar este proyecto! 🚀

