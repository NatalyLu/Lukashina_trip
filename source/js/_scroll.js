let scrollTo = (element) => {
  window.scroll({
    top: element.offsetTop,
    behavior: "smooth"
  })
}