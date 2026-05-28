import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

/**
 * Code display block with syntax-style presentation and copy button.
 * Dark themed with line numbers and a quick-copy SVG button.
 */
const CodeBlock = ({ code, language = 'lua' }) => {
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="relative bg-ground border border-edge rounded-md overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-edge bg-surface/50">
        <span className="text-xs font-medium text-muted uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-foreground transition-colors duration-200 px-2.5 py-1 rounded-sm bg-surface border border-edge hover:border-edge-hover"
        >
          {copied ? (
            <>
              <Check size={13} className="text-green-400" />
              Copied
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content with line numbers */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-surface/30">
                <td className="sticky left-0 bg-ground px-4 py-0 text-right select-none text-xs text-muted/40 w-10 align-top leading-6 border-r border-edge/50">
                  {i + 1}
                </td>
                <td className="px-4 py-0 leading-6">
                  <pre className="text-sm text-foreground/90 font-mono whitespace-pre">
                    <code>{renderLine(line)}</code>
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Basic Lua syntax highlighting.
 * Highlights comments, strings, keywords, numbers, and functions.
 */
function renderLine(line) {
  // Comment lines (-- ...)
  if (line.trimStart().startsWith('--')) {
    return <span className="text-muted/60 italic">{line}</span>
  }

  const parts = []
  let remaining = line
  let key = 0

  const keywords =
    /\b(local|function|if|then|else|elseif|end|for|while|do|return|in|and|or|not|true|false|nil|repeat|until|break|math|task)\b/g
  const strings = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g
  const numbers = /\b(\d+\.?\d*)\b/g
  const builtins =
    /\b(print|require|typeof|tostring|tonumber|wait|spawn|pcall|xpcall|pairs|ipairs|next|select|unpack|table|string|game|workspace|Instance)\b/g

  // Simple token-based highlighting
  const tokens = []
  let match

  // Collect all matches with their positions
  for (const [regex, className] of [
    [strings, 'text-green-400/80'],
    [keywords, 'text-purple-400'],
    [builtins, 'text-blue-400'],
    [numbers, 'text-amber-400/80'],
  ]) {
    regex.lastIndex = 0
    while ((match = regex.exec(remaining)) !== null) {
      tokens.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        className,
      })
    }
  }

  // Sort by position, resolve overlaps (first match wins)
  tokens.sort((a, b) => a.start - b.start)
  const filtered = []
  let lastEnd = 0
  for (const token of tokens) {
    if (token.start >= lastEnd) {
      filtered.push(token)
      lastEnd = token.end
    }
  }

  // Build output
  let pos = 0
  for (const token of filtered) {
    if (token.start > pos) {
      parts.push(
        <span key={key++}>{remaining.slice(pos, token.start)}</span>
      )
    }
    parts.push(
      <span key={key++} className={token.className}>
        {token.text}
      </span>
    )
    pos = token.end
  }
  if (pos < remaining.length) {
    parts.push(<span key={key++}>{remaining.slice(pos)}</span>)
  }

  return parts.length > 0 ? parts : line
}

export default CodeBlock
