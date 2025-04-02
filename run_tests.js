const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Obtener todos los archivos de prueba
const testFiles = fs.readdirSync(__dirname)
    .filter(file => file.startsWith('test') && file.endsWith('.js'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })); // Ordenar numéricamente

console.log(`Ejecutando ${testFiles.length} pruebas...\n`);

testFiles.forEach((testFile, index) => {
    console.log(`Ejecutando: ${testFile}`);
    exec(`node ${path.join(__dirname, testFile)}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error en ${testFile}:`, error.message);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Advertencia en ${testFile}:`, stderr);
            return;
        }
        console.log(`✅ ${testFile} completado con éxito:\n${stdout}`);
    });
});
