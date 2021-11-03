import merge from 'deepmerge'

export function isObject(val) {
  if (val == null) return false
  if (Array.isArray(val)) return false
  return typeof val == 'object'
}

export function keepBy(item, keys) {
  return keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
}

export function omitBy(item, keys) {
  return keepBy(item, Object.keys(item).filter(k => !keys.includes(k)))
}

export function sameObjectBy(a, b, keys) {
  return keys.reduce((p, k) => p && a[k] == b[k], true)
}

export function mergeObjs(...objs) {
  const c = (objs, k) => objs.map(o => o[k]).reduce((p, v) => v ?? p)

  objs = objs.map(o => o ?? {})
  let keys = [...new Set(objs.flatMap(Object.keys))]
  return keys.reduce((p, k) => ({ ...p, [k]: c(objs, k) }), {})
}

export function includesBy(arr, b, keys) {
  return Boolean(arr.find(v => sameObjectBy(v, b, keys)))
}

export function isSameArrayBy(a, b, keys) {
  if (a.length != b.length) return false
  for (let x of a) {
    let f = includesBy(b, x, keys)
    if (f == false) return false
  }
  return true
}

export function diffArrayBy(a, b, keys) {
  return a.filter(v => !includesBy(b, v, keys))
}

export function mergeArrayBy(arr, keys) {
  return arr.reduce((p, v, i) => {
    let f = p.find(k => sameObjectBy(k, v, keys))
    if (f) return p.filter(k => !sameObjectBy(k, v, keys)).concat([merge(f, v)])
    return [...p, { ...v, _seq: i }]
  }, []).sort((a, b) => a._seq - b._seq).map(v => omitBy(v, ['_seq']))
}

export function isDistinctArrayBy(arr, keys) {
  return mergeArrayBy(arr, keys).length == arr.length
}

export function uniqBy(array, keys) {
  let narr = []
  for (let item of array) {
    let f = narr.find(v => keys.reduce((p, k) => p && v[k] == item[k], true))
    if (f) continue
    narr.push(item)
  }
  return narr
}

export function combineArray(root, lev = 0, path = [], paths = []) {
  let nodes = root[lev]
  for (let node of nodes) {
    if (lev == root.length - 1) {
      let p = [...path, node]
      paths.push(p)
      continue
    } else {
      combineArray(root, lev + 1, [...path, node], paths)
    }
  }
  return paths
}

export function calcPrice(calc) {
  return Math.round(calc() * 100) / 100
}

export function empty(val) {
  return val == null || val == ''
}

function with_type(node) {
  if (is_null(node)) return { type: 'null', value: node }
  if (is_array(node)) return { type: 'array', value: node.map(c => with_type(c)) }
  if (is_object(node)) return { type: 'object', value: Object.keys(node).reduce((p, k) => ({ ...p, [k]: with_type(node[k]) }), {}) }
  return { type: typeof node, value: node }
}

function with_path(node) {
  return _with_path(node)

  function _with_path(node, path = []) {
    if (is_null(node)) return { type: 'null', value: node, path }
    if (is_array(node)) return { type: 'array', value: node.map((c, i) => _with_path(c, [...path, i])) }
    if (is_object(node)) return {
      type: 'object',
      value: Object.keys(node).reduce((p, k) => ({ ...p, [k]: _with_path(node[k], [...path, k]) }), {})
    }
    return { type: typeof node, value: node, path }
  }

  function is_null(v) {
    return v == null
  }

  function is_array(v) {
    return Array.isArray(v)
  }

  function is_object(v) {
    return v != null && typeof v == 'object'
  }
}

function get_by_path(node, path = []) {
  return _get_by_path(with_type(node), path)

  function _get_by_path(node, path = [], parent = null) {
    if (path.length == 0) return { value: node, parent }

    if (node?.type == 'array') {
      let [head, ...tail] = path
      if (head == '*') return node.value.map(v => _get_by_path(v, tail, node.value))
      return _get_by_path(node.value[head], tail, node.value)
    }
    if (node?.type == 'object') {
      let [head, ...tail] = path
      if (head == '*') return Object.values(node.value).map(v => _get_by_path(v, tail, node.value))
      return _get_by_path(node.value[head], tail, node.value)
    }

    return { value: null, parent }
  }
}

function traverse_by_type(node, visitors) {
  _traverse_by_type(with_type(node))

  function _traverse_by_type(node, parent = null) {
    let visitor = visitors[node.type]
    if (visitor?.enter) visitor.enter(node, parent)
    if (node.type == 'array') {
      node.value.map(v => _traverse_by_type(v, node.value))
    }
    if (node.type == 'object') {
      Object.values(node.value).map(v => _traverse_by_type(v, node.value))
    }
    if (visitor?.exit) visitor.exit(node, parent)
  }
}

function traverse_by_path(node, visitors) {
  _traverse_by_path(with_type(node), visitors)

  function _traverse_by_path(node, parent, path = []) {
    console.log(path.join('/'))

    let visitor = visitors.find(v => v.path == path.join('/'))
    if(visitor?.enter) visitor.enter(node, parent)

    if(node.type == 'array') {
      node.value.map((v, i) => _traverse_by_path(v, node.value, [...path, i]))
    }

    if(node.type == 'object') {
      Object.entries(node.value).map(([k, v]) => _traverse_by_path(v, node.value, [...path, k]))
    }

    if(visitor?.exit) visitor.exit(node, parent)
  }

  function arr_visitors() {
    return Object.entries(visitors).map(([k, v]) => ({ path: k.split('/'), value: v }))
  }
}