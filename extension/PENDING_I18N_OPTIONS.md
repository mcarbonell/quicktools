# Tarea Pendiente: Completar i18n en Options Page

## 📋 Objetivo
Añadir atributos `data-i18n` a TODOS los elementos de texto en `extension/options/options.html` para que la página se traduzca completamente al cambiar de idioma.

## 📁 Archivos a Modificar

1. **extension/options/options.html** - Añadir `data-i18n` a elementos
2. **extension/i18n/es.json** - Añadir claves en español
3. **extension/i18n/en.json** - Añadir claves en inglés

## ✅ Ya Completado

- ✅ Navegación del sidebar (nav_general, nav_appearance, etc.)
- ✅ Header y footer
- ✅ Selector de idioma
- ✅ Títulos de secciones principales (section_general, section_appearance)
- ✅ Primer grupo de General (group_functionality, auto_start)

## 🔴 Pendiente de Traducir

### Sección: General (general-section)

**Grupo: Funcionalidad**
- [ ] `auto_capture` - "Captura automática al seleccionar"
- [ ] `auto_capture_desc` - "Capturar automáticamente cuando selecciones una región"
- [ ] `save_to_clipboard` - "Guardar automáticamente en el portapapeles"
- [ ] `save_to_clipboard_desc` - "Copiar resultados automáticamente al portapapeles"
- [ ] `show_notifications` - "Mostrar notificaciones"
- [ ] `show_notifications_desc` - "Mostrar notificaciones de éxito y error"

**Grupo: Comportamiento del Popup**
- [ ] `group_popup_behavior` - "Comportamiento del Popup"
- [ ] `open_in_new_tab` - "Abrir herramientas en nueva pestaña"
- [ ] `open_in_new_tab_desc` - "Abrir herramientas web en lugar de usar el popup"
- [ ] `compact_view` - "Vista compacta"
- [ ] `compact_view_desc` - "Mostrar herramientas en vista más compacta"

### Sección: Appearance (appearance-section)

**Grupo: Idioma** (ya hecho)

**Grupo: Tema**
- [ ] `group_theme` - "Tema"
- [ ] `theme_auto` - "Auto"
- [ ] `theme_auto_desc` - "Seguir configuración del sistema"
- [ ] `theme_light` - "Claro"
- [ ] `theme_light_desc` - "Interfaz clara"
- [ ] `theme_dark` - "Oscuro"
- [ ] `theme_dark_desc` - "Interfaz oscura"

**Grupo: Colores**
- [ ] `group_colors` - "Colores"
- [ ] `accent_color` - "Color de acento:"
- [ ] `background_color` - "Color de fondo:"

**Grupo: New Tab**
- [ ] `group_newtab` - "New Tab"
- [ ] `use_custom_newtab` - "Usar QuickTools como página de nueva pestaña"
- [ ] `use_custom_newtab_desc` - "Reemplaza la página de nueva pestaña con el dashboard de QuickTools"
- [ ] `show_weather` - "Mostrar widget del clima"
- [ ] `show_weather_desc` - "Mostrar información del clima en el dashboard"
- [ ] `show_productivity` - "Mostrar métricas de productividad"
- [ ] `show_productivity_desc` - "Mostrar estadísticas de uso y productividad"

### Sección: Shortcuts (shortcuts-section)

- [ ] `section_shortcuts` - "Atajos de Teclado"
- [ ] `group_global_shortcuts` - "Atajos Globales"
- [ ] `shortcuts_description` - "Personaliza los atajos de teclado para acceder rápidamente a las funciones"
- [ ] `reset_shortcuts` - "Restaurar por defecto"
- [ ] `add_shortcut` - "Agregar atajo"

### Sección: Privacy (privacy-section)

- [ ] `section_privacy` - "Privacidad y Datos"
- [ ] `group_data_collection` - "Recolección de Datos"
- [ ] `enable_analytics` - "Enviar analíticas de uso anónimas"
- [ ] `enable_analytics_desc` - "Ayuda a mejorar QuickTools enviando datos de uso anónimos"
- [ ] `crash_reports` - "Enviar reportes de errores"
- [ ] `crash_reports_desc` - "Enviar automáticamente información sobre errores para mejorar la estabilidad"

**Grupo: Almacenamiento Local**
- [ ] `group_local_storage` - "Almacenamiento Local"
- [ ] `notes_saved` - "Notas guardadas:"
- [ ] `captures_saved` - "Capturas guardadas:"
- [ ] `history_saved` - "Historial de herramientas:"
- [ ] `clear` - "Limpiar"

**Grupo: Exportar/Importar**
- [ ] `group_export_import` - "Exportar/Importar Datos"
- [ ] `export_data` - "Exportar datos"
- [ ] `import_data` - "Importar datos"

### Sección: Sync (sync-section)

- [ ] `section_sync` - "Sincronización"
- [ ] `group_sync_status` - "Estado de Sincronización"
- [ ] `sync_not_synced` - "No sincronizado"
- [ ] `sync_description` - "Sincroniza tus notas, configuraciones y datos entre dispositivos"

**Grupo: Opciones de Sincronización**
- [ ] `group_sync_options` - "Opciones de Sincronización"
- [ ] `sync_settings` - "Sincronizar configuraciones"
- [ ] `sync_settings_desc` - "Aplicar la misma configuración en todos los dispositivos"
- [ ] `sync_notes` - "Sincronizar notas"
- [ ] `sync_notes_desc` - "Sincronizar notas entre dispositivos"
- [ ] `sync_favorites` - "Sincronizar herramientas favoritas"
- [ ] `sync_favorites_desc` - "Mantener la misma configuración de favoritos"

**Grupo: Cuenta Premium**
- [ ] `group_premium` - "Cuenta Premium"
- [ ] `premium_title` - "QuickTools Premium"
- [ ] `premium_description` - "Desbloquea sincronización ilimitada, notas ilimitadas, y funciones exclusivas"
- [ ] `upgrade_premium` - "Actualizar a Premium"

### Sección: Profile (profile-section)

- [ ] `section_profile` - "Perfil de Usuario"
- [ ] `group_profile_info` - "Información del Perfil"
- [ ] `profile_description` - "Este perfil se usa para personalizar tu experiencia con IA"
- [ ] `profile_name_label` - "✨ Nombre/Apodo (opcional):"
- [ ] `profile_name_hint` - "La IA te llamará por tu nombre en las conversaciones"
- [ ] `profile_role_label` - "👤 Rol/Profesión:"
- [ ] `profile_level_label` - "📊 Nivel:"
- [ ] `profile_interests_label` - "💡 Intereses (separados por coma):"
- [ ] `profile_stack_label` - "🛠️ Stack (separado por coma):"
- [ ] `profile_workstyle_label` - "💼 Estilo de trabajo:"
- [ ] `profile_hobbies_label` - "🎮 Hobbies (separados por coma):"
- [ ] `profile_gender_label` - "👤 Género:"
- [ ] `profile_gender_unknown` - "No especificado"
- [ ] `profile_gender_male` - "Masculino"
- [ ] `profile_gender_female` - "Femenino"
- [ ] `profile_age_label` - "🎂 Rango de edad:"
- [ ] `profile_age_unknown` - "No especificado"
- [ ] `regenerate_profile` - "🔄 Regenerar con IA"
- [ ] `save_profile` - "💾 Guardar Perfil"

### Sección: Advanced (advanced-section)

- [ ] `section_advanced` - "Configuración Avanzada"

**Grupo: Performance**
- [ ] `group_performance` - "Performance"
- [ ] `lazy_loading` - "Carga diferida de herramientas"
- [ ] `lazy_loading_desc` - "Cargar herramientas solo cuando se necesiten (mejora el rendimiento)"
- [ ] `cache_images` - "Cache de imágenes"
- [ ] `cache_images_desc` - "Cachear imágenes para carga más rápida"

**Grupo: Desarrollo**
- [ ] `group_development` - "Desarrollo"
- [ ] `debug_mode` - "Modo debug"
- [ ] `debug_mode_desc` - "Habilita logs detallados para debugging"
- [ ] `experimental_features` - "Características experimentales"
- [ ] `experimental_features_desc` - "Habilita características en desarrollo"

**Grupo: Reset y Mantenimiento**
- [ ] `group_maintenance` - "Reset y Mantenimiento"
- [ ] `clear_cache` - "Limpiar cache"
- [ ] `update_extensions` - "Buscar actualizaciones"
- [ ] `reset_all` - "Restaurar configuración"

## 📝 Formato de Implementación

### 1. En HTML (options.html)

Cambiar:
```html
<h3>Funcionalidad</h3>
```

Por:
```html
<h3 data-i18n="options.group_functionality">Funcionalidad</h3>
```

Para labels con checkbox:
```html
<label class="setting-label">
    <input type="checkbox" id="auto-capture" checked>
    <span class="checkmark"></span>
    Captura automática al seleccionar
</label>
```

Por:
```html
<label class="setting-label">
    <input type="checkbox" id="auto-capture" checked>
    <span class="checkmark"></span>
    <span data-i18n="options.auto_capture">Captura automática al seleccionar</span>
</label>
```

Para descripciones:
```html
<p class="setting-description">Capturar automáticamente cuando selecciones una región</p>
```

Por:
```html
<p class="setting-description" data-i18n="options.auto_capture_desc">Capturar automáticamente cuando selecciones una región</p>
```

### 2. En JSON (es.json)

Añadir dentro de `"options": { ... }`:
```json
"auto_capture": "Captura automática al seleccionar",
"auto_capture_desc": "Capturar automáticamente cuando selecciones una región",
```

### 3. En JSON (en.json)

Añadir dentro de `"options": { ... }`:
```json
"auto_capture": "Auto capture on select",
"auto_capture_desc": "Automatically capture when you select a region",
```

## 🎯 Criterios de Éxito

- [ ] Todos los textos visibles en options.html tienen `data-i18n`
- [ ] Todas las claves están en es.json y en.json
- [ ] Al cambiar de idioma en Options, TODO el contenido cambia
- [ ] No aparecen warnings de "Translation not found" en consola
- [ ] La sección activa se mantiene al cambiar de idioma

## 📊 Progreso Estimado

- **Total de elementos**: ~80-100 textos
- **Completados**: ~15 (15%)
- **Pendientes**: ~70 (85%)
- **Tiempo estimado**: 2-3 horas

## 🔗 Referencias

- Sistema i18n: `extension/shared/i18n.js`
- Documentación: `extension/i18n/README.md`
- Ejemplo completo: `extension/popup/popup-simple.html`

---

**Nota**: Esta tarea es repetitiva pero importante para la experiencia multiidioma completa. Seguir el patrón establecido en los ejemplos ya implementados.
