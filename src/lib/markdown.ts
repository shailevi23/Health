/**
 * Simple Markdown renderer function
 * @param content Markdown content to render
 * @returns HTML string
 */
export function renderMarkdown(content: string): string {
  // Process headings (# Heading 1, ## Heading 2, etc.)
  let html = content
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-5 mb-2">$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');

  // Process lists
  html = html.replace(/^\s*-\s(.*)$/gm, '<li class="ml-6 list-disc">$1</li>');
  html = html.replace(/(<li.*<\/li>\n)+/g, '<ul class="my-4">$&</ul>');

  // Process bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Process paragraphs
  const paragraphs = html.split('\n\n');
  html = paragraphs
    .map(p => {
      if (
        p.startsWith('<h') ||
        p.startsWith('<ul') ||
        p.startsWith('<ol') ||
        p.startsWith('<li')
      ) {
        return p;
      }
      return `<p class="mb-4 text-gray-700">${p}</p>`;
    })
    .join('\n');

  return html;
} 