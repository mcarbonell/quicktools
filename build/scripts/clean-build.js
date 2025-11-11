const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname, '..', '..', 'web');

// Directories to clean
const dirsToClean = [
    path.join(webDir, 'tools'),
    path.join(webDir, 'es', 'tools')
];

// Files to clean (category pages)
const filesToClean = [
    path.join(webDir, 'developers.html'),
    path.join(webDir, 'designers.html'),
    path.join(webDir, 'writers.html'),
    path.join(webDir, 'data-analysts.html'),
    path.join(webDir, 'marketers.html'),
    path.join(webDir, 'productivity.html'),
    path.join(webDir, 'ai.html'),
    path.join(webDir, 'es', 'desarrolladores.html'),
    path.join(webDir, 'es', 'disenadores.html'),
    path.join(webDir, 'es', 'escritores.html'),
    path.join(webDir, 'es', 'analistas-datos.html'),
    path.join(webDir, 'es', 'marketing.html'),
    path.join(webDir, 'es', 'productividad.html'),
    path.join(webDir, 'es', 'ia.html')
];

function deleteFolderRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const curPath = path.join(dirPath, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

console.log('🧹 Limpiando archivos antiguos...\n');

// Clean directories
dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`  Eliminando: ${path.relative(webDir, dir)}`);
        deleteFolderRecursive(dir);
    }
});

// Clean files
filesToClean.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`  Eliminando: ${path.relative(webDir, file)}`);
        fs.unlinkSync(file);
    }
});

console.log('\n✅ Limpieza completada\n');
