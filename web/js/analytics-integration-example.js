/**
 * EJEMPLO DE INTEGRACIÓN DE ANALYTICS EN HERRAMIENTAS
 * 
 * Este archivo muestra cómo integrar el tracking de Analytics
 * en cualquier herramienta de QuickTools.
 * 
 * NO es un archivo funcional, solo documentación de ejemplo.
 */

// ====================
// EJEMPLO 1: Herramienta de Imagen (resize-image.js)
// ====================

function handleImageUpload(file) {
    // Track cuando usuario carga archivo
    if (window.analytics) {
        window.analytics.trackToolUsed({
            'file_type': file.type,
            'file_size': file.size
        });
    }
    
    // ... resto del código de carga ...
}

function resizeImage(width, height) {
    // Track inicio de procesamiento
    if (window.analytics) {
        window.analytics.trackAction('processing_started', {
            'target_width': width,
            'target_height': height
        });
    }
    
    try {
        // ... código de redimensionamiento ...
        
        // Track éxito
        if (window.analytics) {
            window.analytics.trackAction('processing_completed', {
                'output_width': outputWidth,
                'output_height': outputHeight
            });
        }
    } catch (error) {
        // Track error
        if (window.analytics) {
            window.analytics.trackError('resize_failed', error.message);
        }
        throw error;
    }
}

function downloadImage() {
    // Track descarga
    if (window.analytics) {
        window.analytics.trackAction('download', {
            'format': outputFormat
        });
    }
    
    // ... código de descarga ...
}

// ====================
// EJEMPLO 2: Herramienta de PDF (merge-pdf.js)
// ====================

function handlePDFUpload(files) {
    // Track cuando usuario carga PDFs
    if (window.analytics) {
        window.analytics.trackToolUsed({
            'files_count': files.length,
            'total_size': files.reduce((sum, f) => sum + f.size, 0)
        });
    }
    
    // ... resto del código ...
}

function mergePDFs() {
    if (window.analytics) {
        window.analytics.trackAction('merge_started', {
            'pdf_count': pdfFiles.length
        });
    }
    
    try {
        // ... código de merge ...
        
        if (window.analytics) {
            window.analytics.trackAction('merge_completed', {
                'output_pages': totalPages
            });
        }
    } catch (error) {
        if (window.analytics) {
            window.analytics.trackError('merge_failed', error.message);
        }
        throw error;
    }
}

// ====================
// EJEMPLO 3: Herramienta de Datos (json-formatter.js)
// ====================

function formatJSON(input) {
    if (window.analytics) {
        window.analytics.trackToolUsed({
            'input_length': input.length
        });
    }
    
    try {
        const parsed = JSON.parse(input);
        
        if (window.analytics) {
            window.analytics.trackAction('format_completed', {
                'output_length': JSON.stringify(parsed, null, 2).length
            });
        }
        
        return parsed;
    } catch (error) {
        if (window.analytics) {
            window.analytics.trackError('invalid_json', error.message);
        }
        throw error;
    }
}

function copyToClipboard(text) {
    if (window.analytics) {
        window.analytics.trackAction('copy');
    }
    
    navigator.clipboard.writeText(text);
}

// ====================
// EJEMPLO 4: Herramienta de IA (chat-ai.js)
// ====================

function sendMessage(message) {
    if (window.analytics) {
        window.analytics.trackAction('message_sent', {
            'message_length': message.length
        });
    }
    
    try {
        // ... llamada a API ...
        
        if (window.analytics) {
            window.analytics.trackAction('response_received', {
                'response_length': response.length
            });
        }
    } catch (error) {
        if (window.analytics) {
            window.analytics.trackError('api_error', error.message);
        }
        throw error;
    }
}

// ====================
// EJEMPLO 5: Cambio de Idioma
// ====================

function switchLanguage(newLang) {
    const currentLang = document.documentElement.lang;
    
    if (window.analytics) {
        window.analytics.trackLanguageChange(currentLang, newLang);
    }
    
    // ... código de cambio de idioma ...
}

// ====================
// PATRONES COMUNES
// ====================

/**
 * PATRÓN 1: Track al cargar archivo
 */
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && window.analytics) {
        window.analytics.trackToolUsed({
            'file_type': file.type,
            'file_size': file.size
        });
    }
});

/**
 * PATRÓN 2: Track al hacer clic en botón
 */
downloadButton.addEventListener('click', () => {
    if (window.analytics) {
        window.analytics.trackAction('download');
    }
    // ... código de descarga ...
});

/**
 * PATRÓN 3: Track errores en try-catch
 */
try {
    // ... código que puede fallar ...
} catch (error) {
    if (window.analytics) {
        window.analytics.trackError('operation_failed', error.message);
    }
    showError(error.message);
}

/**
 * PATRÓN 4: Track acciones múltiples
 */
function processFile(file) {
    // Track inicio
    if (window.analytics) {
        window.analytics.trackAction('processing_started');
    }
    
    // ... procesamiento ...
    
    // Track progreso
    if (window.analytics) {
        window.analytics.trackAction('processing_progress', {
            'progress': 50
        });
    }
    
    // ... más procesamiento ...
    
    // Track completado
    if (window.analytics) {
        window.analytics.trackAction('processing_completed');
    }
}

// ====================
// EVENTOS DISPONIBLES
// ====================

/**
 * window.analytics.trackToolUsed(details)
 * - Usar cuando el usuario empieza a usar la herramienta
 * - Típicamente al cargar archivo o iniciar acción
 * 
 * window.analytics.trackAction(action, details)
 * - Acciones: 'download', 'copy', 'convert', 'processing_started', etc.
 * - Usar para cualquier acción significativa del usuario
 * 
 * window.analytics.trackError(errorType, errorMessage, details)
 * - Usar en todos los catch blocks
 * - errorType: 'invalid_file', 'processing_failed', 'api_error', etc.
 * 
 * window.analytics.trackLanguageChange(fromLang, toLang)
 * - Usar cuando usuario cambia idioma
 * 
 * window.analytics.trackEngagement()
 * - Se llama automáticamente al salir de la página
 * - No necesitas llamarlo manualmente
 */
