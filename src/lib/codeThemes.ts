// 自定义代码高亮主题，确保在浅色和深色模式下都有良好的可读性
export const customLightTheme = {
  'code[class*="language-"]': {
    color: '#24292e',
    background: 'none',
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: '4',
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: '#24292e',
    background: '#f8f9fa',
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: '4',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em'
  },
  'comment': {
    color: '#6a737d',
    fontStyle: 'italic'
  },
  'prolog': {
    color: '#6a737d',
    fontStyle: 'italic'
  },
  'doctype': {
    color: '#6a737d',
    fontStyle: 'italic'
  },
  'cdata': {
    color: '#6a737d',
    fontStyle: 'italic'
  },
  'punctuation': {
    color: '#24292e'
  },
  'property': {
    color: '#005cc5'
  },
  'tag': {
    color: '#22863a'
  },
  'boolean': {
    color: '#005cc5'
  },
  'number': {
    color: '#005cc5'
  },
  'constant': {
    color: '#005cc5'
  },
  'symbol': {
    color: '#005cc5'
  },
  'deleted': {
    color: '#d73a49'
  },
  'selector': {
    color: '#22863a'
  },
  'attr-name': {
    color: '#6f42c1'
  },
  'string': {
    color: '#032f62'
  },
  'char': {
    color: '#032f62'
  },
  'builtin': {
    color: '#e36209'
  },
  'inserted': {
    color: '#22863a'
  },
  'operator': {
    color: '#d73a49'
  },
  'entity': {
    color: '#6f42c1'
  },
  'url': {
    color: '#032f62'
  },
  'variable': {
    color: '#e36209'
  },
  'atrule': {
    color: '#22863a'
  },
  'attr-value': {
    color: '#032f62'
  },
  'function': {
    color: '#6f42c1'
  },
  'class-name': {
    color: '#6f42c1'
  },
  'keyword': {
    color: '#d73a49'
  },
  'regex': {
    color: '#032f62'
  },
  'important': {
    color: '#d73a49',
    fontWeight: 'bold'
  }
}

export const customDarkTheme = {
  'code[class*="language-"]': {
    color: '#e1e4e8',
    background: 'none',
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: '4',
    hyphens: 'none'
  },
  'pre[class*="language-"]': {
    color: '#e1e4e8',
    background: '#1a1b26',
    fontFamily: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.7',
    direction: 'ltr',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    tabSize: '4',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em'
  },
  'comment': {
    color: '#7c7c7c',
    fontStyle: 'italic'
  },
  'prolog': {
    color: '#7c7c7c',
    fontStyle: 'italic'
  },
  'doctype': {
    color: '#7c7c7c',
    fontStyle: 'italic'
  },
  'cdata': {
    color: '#7c7c7c',
    fontStyle: 'italic'
  },
  'punctuation': {
    color: '#c5c8c6'
  },
  'property': {
    color: '#96cbfe'
  },
  'tag': {
    color: '#96cbfe'
  },
  'boolean': {
    color: '#99cc99'
  },
  'number': {
    color: '#ff9999'
  },
  'constant': {
    color: '#99cc99'
  },
  'symbol': {
    color: '#96cbfe'
  },
  'deleted': {
    color: '#f2777a'
  },
  'selector': {
    color: '#99cc99'
  },
  'attr-name': {
    color: '#ffcc66'
  },
  'string': {
    color: '#99cc99'
  },
  'char': {
    color: '#99cc99'
  },
  'builtin': {
    color: '#f99157'
  },
  'inserted': {
    color: '#99cc99'
  },
  'operator': {
    color: '#66cccc'
  },
  'entity': {
    color: '#ffcc66'
  },
  'url': {
    color: '#99cc99'
  },
  'variable': {
    color: '#f99157'
  },
  'atrule': {
    color: '#66cccc'
  },
  'attr-value': {
    color: '#99cc99'
  },
  'function': {
    color: '#6699cc'
  },
  'class-name': {
    color: '#ffcc66'
  },
  'keyword': {
    color: '#cc99cc'
  },
  'regex': {
    color: '#f2777a'
  },
  'important': {
    color: '#f2777a',
    fontWeight: 'bold'
  }
}
