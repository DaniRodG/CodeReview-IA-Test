const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration - Using z.ai Anthropic-compatible endpoint with GLM_API_KEY
const GLM_API_KEY = process.env.GLM_API_KEY;
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || 'https://api.z.ai/api/anthropic';
const BASE_BRANCH = process.env.BASE_BRANCH || 'main';
const MAX_FILE_SIZE = 100000; // Maximum file size in bytes to include in review

async function callAPI(prompt) {
  const response = await fetch(`${ANTHROPIC_BASE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': GLM_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function main() {
  try {
    if (!GLM_API_KEY) {
      throw new Error('GLM_API_KEY is not set');
    }

    console.log('Starting code review via z.ai...');

    // Get the diff
    console.log('Getting PR diff...');
    const diff = execSync(`git diff origin/${BASE_BRANCH}...HEAD`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    if (!diff || diff.trim().length === 0) {
      console.log('No changes detected in this PR');
      const noChangesMessage = `## 🤖 Code Review (via z.ai)

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

    // Prepare the prompt
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

    console.log('Sending request to z.ai API...');

    // Call API
    const reviewText = await callAPI(prompt);

    // Format the final output
    const output = `## 🤖 Code Review (via z.ai)

${reviewText}

---
*Review generado automáticamente a través de z.ai*`;

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
