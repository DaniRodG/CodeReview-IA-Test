# Code Review Automático con GLM 4.6

Este repositorio contiene una configuración de GitHub Actions para realizar revisiones de código automáticas usando el modelo GLM 4.6 de Zhipu AI.

## Características

- **Revisión Automática**: Se ejecuta automáticamente en cada Pull Request
- **Feedback Constructivo**: Proporciona análisis detallado del código
- **Personalizable**: Configura tus propias directrices de revisión
- **En Español**: Reviews generados en español por defecto

## Requisitos Previos

1. **API Key de GLM**: Necesitas una clave API de Zhipu AI (GLM 4.6)
   - Obtén tu API key en: https://open.bigmodel.cn/
2. **Permisos en GitHub**: Debes tener permisos de administrador en el repositorio

## Configuración

### 1. Agregar la API Key como Secret

1. Ve a tu repositorio en GitHub
2. Navega a `Settings` → `Secrets and variables` → `Actions`
3. Haz clic en `New repository secret`
4. Nombre: `GLM_API_KEY`
5. Valor: Tu API key de GLM 4.6
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
3. **GLM 4.6 analiza** los cambios del código
4. **Recibe el review** como comentario en el PR

### Ejemplo de Review

El bot publicará un comentario similar a:

```markdown
## 🤖 GLM 4.6 Code Review

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
*Review generado automáticamente por GLM 4.6*
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
4. **API Call**: Envía el código a GLM 4.6 con el prompt de revisión
5. **Resultado**: Publica el review como comentario en el PR

## Personalización Avanzada

### Modificar el Prompt

Edita el archivo `.github/scripts/glm-code-review.js` para:

- Cambiar el prompt enviado a GLM
- Ajustar la cantidad de tokens
- Modificar la temperatura del modelo
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

### Error de API Key

- Verifica que el secret `GLM_API_KEY` esté configurado correctamente
- Asegúrate de que la API key sea válida y tenga créditos

### El review no aparece en el PR

- Revisa los logs del workflow en la pestaña "Actions"
- Verifica que el bot tenga permisos para comentar
- Confirma que no haya errores en el script

## Costos

- **GitHub Actions**: Consumo de minutos de CI/CD (gratis para repos públicos)
- **GLM API**: Cobro por tokens según el plan de Zhipu AI
- **Costo estimado por review**: Varía según el tamaño del PR (generalmente centavos por review)

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
- **API de GLM**: Visita la [documentación de Zhipu AI](https://open.bigmodel.cn/dev/api)

---

**Nota**: Este proyecto utiliza GLM 4.6 de Zhipu AI. Asegúrate de cumplir con los términos de servicio de la API.
