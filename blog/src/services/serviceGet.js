const ServicesGet = () => {
  const urlBasic = 'https://blog.kata.academy/api'

  async function getArticles(offset) {
    const requare = await fetch(`${urlBasic}/articles?offset=${offset}`, {
      method: 'GET',
    })
    if (!requare.ok) {
      throw new Error('Server is unavailable')
    }
    const res = await requare.json()
    return res
  }
  async function getArticle(slug) {
    const requare = await fetch(`${urlBasic}/articles/${slug}`, {
      method: 'GET',
    })
    if (!requare.ok) {
      throw new Error('Server is unavailable')
    }
    const res = await requare.json()
    return res
  }

  return { getArticles, getArticle }
}

export default ServicesGet
