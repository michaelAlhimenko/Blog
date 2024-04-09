const ServicesPost = () => {
  const urlBasic = 'https://blog.kata.academy/api'

  async function loginUser(email, password) {
    const response = await fetch(`${urlBasic}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, password } }),
    })

    const data = await response.json()
    if (!response.ok) {
      return data
    }
    return data
  }

  async function registrationUser(username, email, password) {
    const response = await fetch(`${urlBasic}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { username, email, password } }),
    })

    const data = await response.json()
    if (!response.ok) {
      return data
    }
    return data
  }

  async function updateProfile(email, username, password, website, api_kay) {
    const response = await fetch(`${urlBasic}/user`, {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: { email, username, password, image: website } }),
    })

    if (!response.ok) {
      throw new Error('')
    }

    const data = await response.json()
    return data
  }
  async function createArticle(title, description, body, tags, api_kay) {
    const response = await fetch(`${urlBasic}/articles`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article: { title, description, body, tagList: [...tags] } }),
    })
    if (!response.ok) {
      throw new Error('error')
    }

    const res = await response.json()
    return res
  }
  async function updateArticle(title, description, body, tags, api_kay, slug) {
    const response = await fetch(`${urlBasic}/articles/${slug}`, {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article: { title, description, body, tagList: [...tags] } }),
    })
    if (!response.ok) {
      throw new Error('error')
    }
  }

  async function likePost(postId, api_kay) {
    await fetch(`${urlBasic}/articles/${postId}/favorite`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
  }

  async function unlikePost(postId, api_kay) {
    await fetch(`${urlBasic}/articles/${postId}/favorite`, {
      method: 'DELETE',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Authorization': `Token ${api_kay}`,
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
  }

  return { loginUser, registrationUser, updateProfile, createArticle, updateArticle, likePost, unlikePost }
}

export default ServicesPost
