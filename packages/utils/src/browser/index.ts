// export function getURLParameters(url: string): object {
//   return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
//     (a, v) => (
//       (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a
//     ),
//     {},
//   )
// }

// export function addMultipleListeners(el, types, listener, options, useCapture) {
//   types.forEach(type =>
//     el.addEventListener(type, listener, options, useCapture),
//   )
// }
