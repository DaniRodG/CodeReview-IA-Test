const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_URL = process.env.GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const BASE_BRANCH = process.env.BASE_BRANCH || 'main';
const MAX_FILE_SIZE = 100000; // Maximum file size in bytes to include in review

async function callGLMAPI(prompt) {
  const response = await fetch(GLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'glm-4-plus',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM API request failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function main() {
  try {
    if (!GLM_API_KEY) {
      throw new Error('GLM_API_KEY is not set');
    }

    console.log('Starting GLM 4.6 code review...');

    // Get the diff
    console.log('Getting PR diff...');
    const diff = execSync(`git diff origin/${BASE_BRANCH}...HEAD`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (!diff || diff.trim().length === 0) {
      console.log('No changes detected in this PR');
      const noChangesMessage = `## 🤖 GLM Code Review

No se detectaron cambios en este pull request.`;
      fs.writeFileSync('review-output.md', noChangesMessage);
      return;
    }

    // Get changed files list
    const changedFiles = execSync(
      `git diff --name-only origin/${BASE_BRANCH}...HEAD`,
      { encoding: 'utf8' }
    )
      .split('\n')
      .filter(Boolean);

    console.log(`Found ${changedFiles.length} changed files`);

    // Prepare the prompt for GLM
    const prompt = `Eres un revisor de código experto. Por favor, revisa los siguientes cambios del pull request y proporciona feedback constructivo en español.

## Archivos Modificados
${changedFiles.map(f => `- ${f}`).join('\n')}

## Diff de Git
\`\`\`diff
${diff.substring(0, 50000)} ${diff.length > 50000 ? '\n... (diff truncado por longitud)' : ''}
\`\`\`

Por favor, proporciona una revisión exhaustiva que incluya:

1. **Resumen**: Una descripción breve de los cambios
2. **Aspectos Positivos**: Lo que está bien hecho
3. **Problemas Encontrados**: Cualquier bug, preocupación de seguridad o problema de calidad del código
4. **Sugerencias**: Recomendaciones para mejorar
5. **Calidad del Código**: Evaluación del estilo, legibilidad y mantenibilidad

Formatea tu respuesta en Markdown. Sé constructivo y específico en tu feedback.`;

    console.log('Sending request to GLM API...');

    // Call GLM API
    const reviewText = await callGLMAPI(prompt);

    // Format the final output
    const output = `## 🤖 GLM 4.6 Code Review

${reviewText}

---
*Review generado automáticamente por GLM 4.6*`;

    // Write output to file
    fs.writeFileSync('review-output.md', output);

    console.log('Code review completed successfully!');
    console.log('\n=== Review Output ===\n');
    console.log(output);

  } catch (error) {
    console.error('Error during code review:', error);

    // Write error output
    const errorOutput = `## ❌ Error en Code Review

Ocurrió un error al generar la revisión de código:

\`\`\`
${error.message}
\`\`\`

Por favor, revisa los logs del workflow para más detalles.`;

    fs.writeFileSync('review-output.md', errorOutput);
    process.exit(1);
  }
}

main();
