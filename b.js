let obj = {
  a: 'abc',
  b: 123,
  c: { c1: 1, c2: 2.2, c3: 'c3' },
  d: [1, 2],
  e: [{ a: 1 }, { a: 2 }]
}

function parse(node) {
  if (typeof node == 'string') {
    return { type: 'String', value: node }
  }
  if (typeof node == 'boolean') {
    return { type: 'Boolean', value: node }
  }
  if (typeof node == 'number') {
    if (node % 1 == 0) {
      return { type: 'Int', value: node }
    } else {
      return { type: 'Float', value: node }
    }
  }
  if (typeof node == 'object') {
    if (!Array.isArray(node)) {
      return {
        type: 'Object',
        value: Object.keys(node).map(key => ({ type: 'KV', value: { key, value: parse(node[key]) } }))
      }
    } else {
      return {
        type: 'Array',
        value: node.map(v => parse(v))
      }
    }
  }
}

function transform(node) {
  if (Array.isArray()) {
  }
}

console.log(parse({ obj }))
