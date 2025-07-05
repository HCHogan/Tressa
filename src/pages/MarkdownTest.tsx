import React from 'react'
import { EnhancedMarkdown } from '@/components/EnhancedMarkdown'

const testContent = `# Enhanced Markdown Test

This is a comprehensive test of the enhanced Markdown renderer with LaTeX support.

## Mathematics Support

### Inline Math
Here's an inline equation: $E = mc^2$ and another one: $\\sum_{i=1}^{n} x_i$.

### Block Math
Here's a block equation:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

And a more complex one:

$$
\\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r}, t) = \\frac{i\\hbar}{2m} \\nabla^2 \\Psi(\\mathbf{r}, t) + V(\\mathbf{r}) \\Psi(\\mathbf{r}, t)
$$

## Code Blocks

### JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python
\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print(quicksort([3, 6, 8, 10, 1, 2, 1]))
\`\`\`

## Tables

| Feature | Status | Notes |
|---------|--------|-------|
| LaTeX Math | ✅ | Inline and block equations |
| Code Highlighting | ✅ | Multiple languages supported |
| Tables | ✅ | Enhanced styling |
| Lists | ✅ | Custom bullet points |

## Lists

### Unordered Lists
- First item
- Second item
  - Nested item
  - Another nested item
    - Deep nested item
- Third item

### Ordered Lists
1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

## Blockquotes

> This is a beautiful blockquote with enhanced styling.
> It supports multiple lines and looks great in both light and dark themes.

## Links and Emphasis

Here's a [link to Google](https://google.com) and some **bold text** and *italic text*.

## Inline Code

Use \`console.log()\` to print output in JavaScript. The \`Array.prototype.map()\` method is very useful.

## Horizontal Rule

---

## Mixed Content

Here's a paragraph with inline math $\\alpha + \\beta = \\gamma$ and some \`inline code\` together.

### Complex Math Example

The quadratic formula is:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

Where $a$, $b$, and $c$ are coefficients of the quadratic equation $ax^2 + bx + c = 0$.`

export function MarkdownTest() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flat-card p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Enhanced Markdown Renderer Test</h1>
        <EnhancedMarkdown 
          content={testContent}
          className="test-markdown"
        />
      </div>
    </div>
  )
}

export default MarkdownTest
