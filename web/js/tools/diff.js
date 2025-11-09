document.addEventListener('DOMContentLoaded', () => {
    // diff.js - Comparador de textos
    const text1 = document.getElementById('text1');

// Get translations (injected by generator)
const t = window.toolTranslations || {};
    const text2 = document.getElementById('text2');
    const compareBtn = document.getElementById('compareBtn');
    const copyBtn = document.getElementById('copyBtn');
    const diffResult = document.getElementById('diffResult');
    const ignoreCase = document.getElementById('ignoreCase');
    const ignoreWhitespace = document.getElementById('ignoreWhitespace');
    const msg = document.getElementById('msg');

    // Instancia del diff_match_patch
    const dmp = new diff_match_patch();

    // Normalizar texto según opciones
    function normalizeText(text) {
        if (!text) return '';
        let normalized = text;
        if (ignoreCase.checked) {
            normalized = normalized.toLowerCase();
        }
        if (ignoreWhitespace.checked) {
            normalized = normalized.replace(/\s+/g, ' ').trim();
        }
        return normalized;
    }

    // Generar HTML con las diferencias resaltadas
    function prettyDiff(diffs) {
        const html = [];
        for (let i = 0; i < diffs.length; i++) {
            const operation = diffs[i][0];
            const text = diffs[i][1];
            const escapedText = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

            switch (operation) {
                case 1:  // Inserción
                    html.push(`<span class="diff-added">${escapedText}</span>`);
                    break;
                case -1: // Eliminación
                    html.push(`<span class="diff-removed">${escapedText}</span>`);
                    break;
                case 0:  // Igual
                    html.push(escapedText);
                    break;
            }
        }
        return html.join('');
    }

    // Comparar textos
    compareBtn?.addEventListener('click', () => {
        const input1 = normalizeText(text1.value);
        const input2 = normalizeText(text2.value);

        if (!input1 && !input2) {
            msg.textContent = 'Por favor, introduce algún texto para comparar';
            return;
        }

        try {
            // Configurar la sensibilidad del diff
            dmp.Diff_Timeout = 1.0;
            dmp.Diff_EditCost = 4;

            // Obtener las diferencias
            const diffs = dmp.diff_main(input1, input2);

            // Limpiar diferencias triviales
            dmp.diff_cleanupSemantic(diffs);

            // Mostrar resultado
            diffResult.innerHTML = prettyDiff(diffs);
            msg.textContent = 'Textos comparados exitosamente';
        } catch (e) {
            msg.textContent = 'Error al comparar los textos: ' + e.message;
        }
    });

    // Copiar al portapapeles
    copyBtn?.addEventListener('click', async () => {
        if (!diffResult.textContent || diffResult.textContent === 'Los resultados aparecerán aquí...') {
            msg.textContent = 'No hay resultado para copiar';
            return;
        }
        try {
            // Crear un elemento temporal sin formato
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = diffResult.innerHTML;
            const textToCopy = tempDiv.textContent;

            await navigator.clipboard.writeText(textToCopy);
            const originalText = copyBtn.textContent;
            copyBtn.innerHTML = '✔';
            msg.textContent = t.copied || 'Copiado al portapapeles';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                msg.textContent = '';
            }, 1800);
        } catch (e) {
            try {
                // Fallback: seleccionar y copiar
                const range = document.createRange();
                range.selectNode(diffResult);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                document.execCommand('copy');
                window.getSelection().removeAllRanges();

                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '✔';
                msg.textContent = t.copied || 'Copiado al portapapeles';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    msg.textContent = '';
                }, 1800);
            } catch (err) {
                msg.textContent = 'Error al copiar: ' + e.message;
            }
        }
    });
});
