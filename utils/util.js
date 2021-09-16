export function keepBy(item, keys) {
  return keys.reduce((acc, key) => ({ ...acc, [key]: item[key] }), {})
}

export function omitBy(item, keys) {
  return keepBy(item, Object.keys(item).filter(k => !keys.includes(k)))
}

export function sameObjectBy(a, b, keys) {
  return keys.reduce((p, k) => p && a[k] == b[k], true)
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
    if(f) return p.filter(k => !sameObjectBy(k, v, keys)).concat([{...f, ...v}])
    return [...p, {...v, _seq: i}]
  }, []).sort((a, b) => a._seq - b._seq).map(v => omitBy(v, ['_seq']))
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
