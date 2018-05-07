
export default (goshawk) => {
  goshawk.angler({
    locale: import ('./locale/'),
    pages: import('./pages/'),
    resources: import('./resources/'),
  })
}
