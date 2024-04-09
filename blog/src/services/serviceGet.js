const ServicesGet = () => {
  const urlBasic = 'https://blog.kata.academy/api'

  async function getArticles(offset, api_kay) {
    const requare = await fetch(`${urlBasic}/articles?offset=${offset}`, {
      method: 'GET',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
    })
    if (!requare.ok) {
      throw new Error('Server is unavailable')
    }
    const res = await requare.json()
    return res
  }

  async function getArticle(slug, api_kay) {
    const requare = await fetch(`${urlBasic}/articles/${slug}`, {
      method: 'GET',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
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
