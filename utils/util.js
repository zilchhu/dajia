export function isSameArrayBy(a, b, keys) {
  if (a.length != b.length) return false
  for (let x of a) {
    let f = b.find(y => keys.reduce((p, k) => p && y[k] == x[k], true))
    if (f == null) return false
  }
  return true
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

export function mergeObjs(...objs) {
  const c = (objs, k) => objs.map(o => o[k]).reduce((p, v) => v ?? p)

  objs = objs.map(o => o ?? {})
  let keys = [...new Set(objs.flatMap(Object.keys))]
  return keys.reduce((p, k) => ({ ...p, [k]: c(objs, k) }), {})
}

export function omitBy(obj, ks) {
  let newKs = Object.keys(obj).filter(v => !ks.includes(v))
  let newObj = newKs.reduce((res, k) => {
    return { ...res, [k]: obj[k] }
  }, {})
  return newObj
}

export function keepBy(item, keys) {
  return keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
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
