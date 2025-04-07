Registro Vehicular - Pruebas Automatizadas con Selenium 🚗💻
✨ Descripción del Proyecto
Este proyecto consiste en automatizar pruebas para una aplicación web de registro vehicular. Usé Selenium WebDriver con JavaScript para asegurar que todas las funciones principales del sistema (como registrar usuarios, iniciar sesión, registrar vehículos, etc.) funcionen correctamente. La idea es validar que el sistema responda bien ante diferentes escenarios, tanto exitosos como con errores.

Todo esto lo realicé con el objetivo de aplicar buenas prácticas de testing y asegurar la calidad del sistema de manera automatizada.

⚙️ Tecnologías Utilizadas
Node.js

Selenium WebDriver

Mocha (para las pruebas)

Chai (para las aserciones)

Mochawesome (para los reportes en HTML)

Microsoft Edge WebDriver

HTML/CSS (en el frontend de la app)

💻 Requisitos del Sistema
Antes de ejecutar el proyecto, asegúrate de tener lo siguiente:

Node.js (versión 14 o superior)

npm (gestor de paquetes)

Microsoft Edge instalado

Edge WebDriver configurado y disponible en el PATH

Un sistema operativo compatible (Windows, macOS o Linux)

📦 Instalación y Configuración
Para poner en marcha el proyecto:

Clona el repositorio:

bash
Copiar
Editar
git clone https://github.com/smith-ch/registrovehicular.git
cd registrovehicular
Instala las dependencias:

bash
Copiar
Editar
npm install
Verifica que Edge WebDriver esté correctamente instalado y accesible desde el sistema.

📁 Estructura del Proyecto
bash
Copiar
Editar
registrovehicular/
├── pruebas/
│   ├── test.js                # Pruebas automatizadas
│   ├── screenshots/           # Capturas generadas
│   └── mochawesome-report/   # Reporte HTML
├── src/                      # Código fuente de la app
├── README.md                 # Este archivo 🙂
├── package.json              # Configuración npm
└── ...
🧪 Ejecución de las Pruebas
Para correr las pruebas:

bash
Copiar
Editar
npm test
Esto generará un reporte HTML dentro de pruebas/mochawesome-report/.

📊 Ver Reportes
Al terminar las pruebas:

Abre pruebas/mochawesome-report/mochawesome.html para ver los resultados.

Ahí verás cada prueba detallada con capturas si hubo errores o validaciones importantes.

📋 Historias de Usuario
Aquí te dejo las historias de usuario que desarrollé, cada una con sus criterios bien definidos:

✅ Historia 1: Registro de Usuario
Como nuevo usuario, quiero registrarme, para poder usar la app.

✔ Aceptación: campos completos, registro exitoso, mensaje de confirmación.

❌ Rechazo: campos vacíos o usuario ya existente muestran errores.

✅ Historia 2: Inicio de Sesión
Como usuario registrado, quiero iniciar sesión, para acceder al sistema.

✔ Aceptación: credenciales válidas redirigen correctamente.

❌ Rechazo: credenciales inválidas o campos vacíos generan error.

✅ Historia 3: Registro de Vehículo
Como usuario logueado, quiero registrar mi vehículo, para guardarlo en el sistema.

✔ Aceptación: todos los campos llenos permiten avanzar.

❌ Rechazo: campos vacíos o año inválido detienen el proceso.

✅ Historia 4: Características del Vehículo
Como usuario, quiero seleccionar características, para detallar más mi vehículo.

✔ Aceptación: selección mínima requerida y guardado correcto.

❌ Rechazo: sin selección, no debe continuar.

✅ Historia 5: Resumen y PDF
Como usuario, quiero ver y descargar un resumen en PDF, para tener un respaldo.

✔ Aceptación: se muestra resumen, botón descarga funciona.

❌ Rechazo: sin datos cargados o errores en generación del PDF.

🖼️ Capturas de Pantalla
Las pruebas generan capturas automáticamente en la carpeta pruebas/screenshots. Esto ayuda a validar visualmente qué ocurrió en cada prueba.

✅ Buenas Prácticas
Código organizado y separado.

Validaciones claras con assert.

Reportes HTML fáciles de revisar.

Documentación de historias de usuario.

Capturas automáticas en escenarios clave.

📚 Información Adicional
Si deseas ver más detalles técnicos, explicación de flujos, documentación más formal, etc., puedes revisar el archivo PDF incluido en el proyecto. Ahí encontrarás todo organizado de forma estructurada para cumplir con los requerimientos del curso.

