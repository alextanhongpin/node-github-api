// pagination.js calculates the pagination for the page

function pageCount (totalPages, perPage) {
  return Math.ceil(totalPages / perPage)
}

function pageArray (pages) {
  return Array(pages).fill(0).map((_, page) => page + 1)
}

module.exports = {
  pageCount,
  pageArray
}
