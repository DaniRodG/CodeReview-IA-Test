# Code Review Automático con Claude (via z.ai)

Este repositorio contiene una configuración de GitHub Actions para realizar revisiones de código automáticas usando Claude a través de z.ai.

## Características

- **Revisión Automática**: Se ejecuta automáticamente en cada Pull Request
- **Feedback Constructivo**: Proporciona análisis detallado del código
- **Personalizable**: Configura tus propias directrices de revisión
- **En Español**: Reviews generados en español por defecto

## Requisitos Previos

1. **Suscripción a z.ai**: Necesitas una suscripción activa a z.ai con acceso a Claude
   - Regístrate en: https://z.ai/
   - Obtén tu API token en: https://z.ai/manage-apikey/apikey-list
2. **Permisos en GitHub**: Debes tener permisos de administrador en el repositorio

## Configuración

### 1. Agregar el API Token como Secret

1. Ve a tu repositorio en GitHub
2. Navega a `Settings` → `Secrets and variables` → `Actions`
3. Haz clic en `New repository secret`
4. Nombre: `ANTHROPIC_AUTH_TOKEN`
5. Valor: Tu API token de z.ai (obtenido de https://z.ai/manage-apikey/apikey-list)
6. Haz clic en `Add secret`

### 2. Verificar el Workflow

El archivo de workflow ya está configurado en `.github/workflows/code-review.yml`. Este workflow:

- Se activa automáticamente cuando se abre, actualiza o reabre un PR
- Ejecuta el script de revisión de código
- Publica el resultado como un comentario en el PR

### 3. Personalizar las Directrices (Opcional)

Edita el archivo `.glmreview.md` para personalizar:

- Estándares de código que debe seguir tu equipo
- Criterios específicos de revisión
- Aspectos de seguridad a evaluar
- Tono y formato del feedback

## Uso

Una vez configurado, el sistema funciona automáticamente:

1. **Crea un Pull Request** en tu repositorio
2. **GitHub Actions se activa** automáticamente
3. **Claude analiza** los cambios del código a través de z.ai
4. **Recibe el review** como comentario en el PR

### Ejemplo de Review

El bot publicará un comentario similar a:

```markdown
## 🤖 Claude Code Review (via z.ai)

### Resumen
Este PR implementa una nueva funcionalidad de autenticación...

### Aspectos Positivos
- Código bien estructurado
- Buena separación de responsabilidades

### Problemas Encontrados
- Falta validación de entrada en línea 45
- Posible vulnerabilidad de seguridad en...

### Sugerencias
- Agregar manejo de errores en...
- Considerar usar async/await para...

---
*Review generado automáticamente por Claude a través de z.ai*
```

## Estructura del Proyecto

```
.
├── .github/
│   ├── workflows/
│   │   └── code-review.yml          # Workflow de GitHub Actions
│   └── scripts/
│       ├── glm-code-review.js       # Script principal de revisión
│       └── package.json             # Dependencias del proyecto
├── .glmreview.md                    # Configuración de directrices
└── README.md                        # Este archivo
```

## Cómo Funciona

1. **Trigger**: El workflow se activa cuando hay cambios en un PR
2. **Checkout**: Descarga el código del repositorio
3. **Análisis**: Obtiene el diff de los cambios
4. **API Call**: Envía el código a Claude a través de z.ai con el prompt de revisión
5. **Resultado**: Publica el review como comentario en el PR

## Personalización Avanzada

### Modificar el Prompt

Edita el archivo `.github/scripts/glm-code-review.js` para:

- Cambiar el prompt enviado a Claude
- Ajustar la cantidad de tokens (max_tokens)
- Modificar el modelo de Claude usado
- Cambiar el formato de salida

### Configurar Eventos

Edita `.github/workflows/code-review.yml` para activar el workflow en otros eventos:

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]
  # Agrega más eventos según necesites
```

### Ajustar Permisos

El workflow requiere los siguientes permisos:

- `contents: read` - Para leer el código del repositorio
- `pull-requests: write` - Para publicar comentarios en PRs

## Solución de Problemas

### El workflow no se ejecuta

- Verifica que el archivo workflow esté en `.github/workflows/`
- Confirma que GitHub Actions esté habilitado en tu repositorio
- Revisa la pestaña "Actions" para ver errores

### Error de API Token

- Verifica que el secret `ANTHROPIC_AUTH_TOKEN` esté configurado correctamente
- Asegúrate de que tu suscripción a z.ai esté activa
- Confirma que el token tenga los permisos necesarios

### El review no aparece en el PR

- Revisa los logs del workflow en la pestaña "Actions"
- Verifica que el bot tenga permisos para comentar
- Confirma que no haya errores en el script

## Costos

- **GitHub Actions**: Consumo de minutos de CI/CD (gratis para repos públicos, límites según plan para privados)
- **z.ai Subscription**: Requiere suscripción activa a z.ai con acceso a Claude
- **Costo estimado por review**: Depende de tu plan de suscripción de z.ai

## Limitaciones

- Tamaño máximo de archivo: 100KB por archivo
- Tamaño máximo de diff: 50KB para el análisis
- Timeout del workflow: 6 horas (configurable)

## Contribuir

Si encuentras problemas o tienes sugerencias:

1. Abre un Issue describiendo el problema
2. Propón cambios mediante un Pull Request
3. El sistema revisará automáticamente tu código!

## Licencia

MIT

## Soporte

Para problemas con:
- **GitHub Actions**: Consulta la [documentación de GitHub](https://docs.github.com/actions)
- **z.ai y Claude**: Visita la [documentación de z.ai](https://docs.z.ai/)

---

**Nota**: Este proyecto utiliza Claude a través de z.ai. Asegúrate de tener una suscripción activa y cumplir con los términos de servicio.
