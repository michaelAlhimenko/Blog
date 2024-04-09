const ServicesDel = () => {
  const urlBasic = 'https://blog.kata.academy/api'

  const deleteArticle = async (slug, api_kay) => {
    await fetch(`${urlBasic}/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
    })
  }
  return { deleteArticle }
}
export default ServicesDel
