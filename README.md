# selenium-webdriver

Selenium es una biblioteca de automatización de navegadores. Usada con mayor frecuencia para probar aplicaciones web, Selenium puede ser utilizada para cualquier tarea que requiera automatizar la interacción con el navegador.

## Instalación

Selenium puede instalarse a través de npm con:

  npm install selenium-webdriver

Necesitarás descargar componentes adicionales para trabajar con cada uno de los principales navegadores. Los controladores para Chrome, Firefox y los navegadores IE y Edge de Microsoft son ejecutables independientes que deben colocarse en el [PATH] de tu sistema. El `safaridriver` de Apple (v10 y superior) se encuentra en la siguiente ruta: `/usr/bin/safaridriver`. Para habilitar la automatización en Safari, necesitas ejecutar el comando `safaridriver --enable`.

| Navegador         | Componente                        |
| :---------------- | :-------------------------------- |
| Chrome            | [chromedriver(.exe)][chrome]     |
| Internet Explorer | [IEDriverServer.exe][release]    |
| Edge              | [MicrosoftWebDriver.msi][edge]   |
| Firefox           | [geckodriver(.exe)][geckodriver] |
| Opera             | [operadriver(.exe)][operadriver] |
| Safari            | [safaridriver]                   |

## Uso

El siguiente ejemplo y otros están incluidos en el directorio `example`. También puedes encontrar útiles las pruebas de selenium-webdriver.

```javascript
const { Builder, Browser, By, Key, until } = require('selenium-webdriver')

;(async function example() {
  let driver = await new Builder().forBrowser(Browser.FIREFOX).build()
  try {
  await driver.get('https://www.google.com/ncr')
  await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
  await driver.wait(until.titleIs('webdriver - Google Search'), 1000)
  } finally {
  await driver.quit()
  }
})()
```

### Usando la API de Builder

La clase `Builder` es tu herramienta principal para configurar nuevas instancias de WebDriver. En lugar de llenar tu código con ramas para los diferentes navegadores, el constructor te permite configurar todas las opciones en un solo flujo. Cuando llamas a `Builder#build()`, todas las opciones irrelevantes para el navegador seleccionado se descartan:

```javascript
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const firefox = require('selenium-webdriver/firefox')

let driver = new webdriver.Builder()
  .forBrowser(webdriver.Browser.FIREFOX)
  .setChromeOptions(/* ... */)
  .setFirefoxOptions(/* ... */)
  .build()
```

¿Por qué querrías configurar opciones irrelevantes para el navegador objetivo? La API de `Builder` define tu configuración _predeterminada_. Puedes cambiar el navegador objetivo en tiempo de ejecución a través de la variable de entorno `SELENIUM_BROWSER`. Por ejemplo, el script `example/google_search.js` está configurado para ejecutarse en Firefox. Puedes ejecutar el ejemplo en otros navegadores simplemente cambiando el entorno en tiempo de ejecución:

  # cd node_modules/selenium-webdriver
  node example/google_search
  SELENIUM_BROWSER=chrome node example/google_search
  SELENIUM_BROWSER=safari node example/google_search

### El Servidor Independiente de Selenium

El Servidor Independiente de Selenium actúa como un proxy entre tu script y los controladores específicos del navegador. El servidor puede usarse al ejecutar localmente, pero no se recomienda ya que introduce un salto adicional para cada solicitud y ralentizará las cosas. Sin embargo, el servidor es necesario para usar un navegador en un host remoto (la mayoría de los controladores de navegador, como el IEDriverServer, no aceptan conexiones remotas).

Para usar el Servidor de Selenium, necesitarás instalar el [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) y descargar el servidor más reciente desde [Selenium][release]. Una vez descargado, ejecuta el servidor con:

  java -jar selenium-server-4.4.0.jar standalone

Puedes configurar tus pruebas para ejecutarse contra un servidor remoto a través de la API de Builder:

```javascript
let driver = new webdriver.Builder()
  .forBrowser(webdriver.Browser.FIREFOX)
  .usingServer('http://localhost:4444/wd/hub')
  .build()
```

O cambiar la configuración de Builder en tiempo de ejecución con la variable de entorno `SELENIUM_REMOTE_URL`:

  SELENIUM_REMOTE_URL="http://localhost:4444/wd/hub" node script.js

Puedes experimentar con estas opciones usando el script `example/google_search.js` proporcionado con `selenium-webdriver`.

## Documentación

La documentación de la API está disponible en línea desde el [proyecto Selenium][api]. Recursos adicionales incluyen:

- el canal #selenium en IRC freenode
- la lista [selenium-users@googlegroups.com][users]
- la documentación de [SeleniumHQ](https://selenium.dev/documentation/)

## Contribuir

Se aceptan contribuciones a través de solicitudes de extracción en [GitHub][gh] o parches mediante el [rastreador de problemas de Selenium][issues].

## Política de Soporte para Node

Cada versión de selenium-webdriver soportará la última versión _semver-minor_ de las versiones LTS y estables de Node. Todas las versiones _semver-major_ y _semver-minor_ entre la versión LTS y la estable tendrán soporte de "mejor esfuerzo". Después de un lanzamiento de Selenium, cualquier versión _semver-minor_ de Node también tendrá soporte de "mejor esfuerzo". Las versiones anteriores a la última LTS, las versiones _semver-major_ y todas las ramas de lanzamiento inestables (por ejemplo, "v.Next") se consideran estrictamente no soportadas.

Por ejemplo, supongamos que las versiones actuales LTS y estables son v14.20.0 y v18.8.0, respectivamente. Entonces, un lanzamiento de Selenium tendría los siguientes niveles de soporte:

|  Versión  |     Soporte     |
| :-------: | :-------------: |
| <= 14.19  | _no soportado_  |
|  14.20.0  |    soportado    |
|  18.0-7   | mejor esfuerzo  |
|  18.8.0   |    soportado    |
| >= 18.8.0 | mejor esfuerzo  |
|  v.Next   | _no soportado_  |

### Definiciones de Niveles de Soporte

- _soportado:_ Una versión de selenium-webdriver será compatible con la API de la plataforma, sin el uso de banderas de tiempo de ejecución.

- _mejor esfuerzo:_ Los errores serán investigados según el tiempo lo permita. La compatibilidad con la API solo está garantizada donde se requiera por una versión _soportada_. Esto significa que la adopción de nuevas características de JS, como los módulos ES2015, dependerá de lo que sea compatible en el LTS de Node.

- _no soportado:_ Los informes de errores serán cerrados como no solucionables y la compatibilidad con la API no está garantizada.

### Calendario de Soporte Proyectado

Si Node lanza un nuevo [LTS] cada octubre y una nueva versión principal cada 6 meses, la ventana de soporte para selenium-webdriver será aproximadamente:

| Lanzamiento |      Estado      | FIN DE VIDA |
| :---------: | :--------------: | :---------: |
|   v14.x     | LTS de Mantenimiento | 2023-04-30  |
|   v16.x     |    LTS Activo    | 2023-09-11  |
|   v18.x     |     Actual       | 2025-04-30  |
|   v19.x     |     Pendiente    | 2023-06-01  |
|    v20      |     Pendiente    | 2026-04-30  |

## Problemas

Por favor, informa cualquier problema utilizando el [rastreador de problemas de Selenium][issues]. Al usar el rastreador de problemas:

- **Haz** incluir una descripción detallada del problema.
- **Haz** incluir un enlace a un [gist](http://gist.github.com/) con cualquier traza de pila/registros interesantes (también puedes adjuntarlos directamente al informe de errores).
- **Haz** incluir un [caso de prueba reducido][reduction]. Informar "no se puede encontrar el elemento en la página" _no_ es un informe válido; no hay nada que podamos investigar. Espera que tu informe de error sea cerrado si no proporcionas suficiente información para que lo investiguemos.
- **No hagas** solicitudes de ayuda básicas en el rastreador de problemas. Todas las consultas de ayuda deben dirigirse al [foro de usuarios][users] o al canal #selenium en IRC.
- **No hagas** comentarios vacíos como "Yo también veo esto" o "¿Alguna actualización?". Estos no proporcionan información adicional y llenan el registro.
- **No informes** regresiones en errores cerrados, ya que no se monitorean activamente para actualizaciones (especialmente errores que tienen más de 6 meses). Por favor, abre un nuevo problema y referencia el error original en tu informe.

## Licencia

Licenciado a la Software Freedom Conservancy (SFC) bajo uno o más acuerdos de licencia de contribuyentes. Consulta el archivo NOTICE distribuido con este trabajo para obtener información adicional sobre la propiedad de los derechos de autor. La SFC licencia este archivo bajo la Licencia Apache, Versión 2.0 (la "Licencia"); no puedes usar este archivo excepto en cumplimiento con la Licencia. Puedes obtener una copia de la Licencia en:

http://www.apache.org/licenses/LICENSE-2.0

A menos que lo requiera la ley aplicable o se acuerde por escrito, el software distribuido bajo la Licencia se distribuye "TAL CUAL", SIN GARANTÍAS NI CONDICIONES DE NINGÚN TIPO, ya sean expresas o implícitas. Consulta la Licencia para obtener el lenguaje específico que rige los permisos y limitaciones bajo la Licencia.

[LTS]: https://github.com/nodejs/LTS
[PATH]: http://es.wikipedia.org/wiki/PATH_%28variable%29
[api]: https://www.selenium.dev/selenium/docs/api/javascript/
[chrome]: https://googlechromelabs.github.io/chrome-for-testing/#stable
[gh]: https://github.com/SeleniumHQ/selenium/
[issues]: https://github.com/SeleniumHQ/selenium/issues
[edge]: http://go.microsoft.com/fwlink/?LinkId=619687
[geckodriver]: https://github.com/mozilla/geckodriver/releases/
[reduction]: http://www.webkit.org/quality/reduction.html
[release]: https://www.selenium.dev/downloads/
[users]: https://groups.google.com/forum/#!forum/selenium-users
[safaridriver]: https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28
[operadriver]: https://github.com/operasoftware/operachromiumdriver/releases
