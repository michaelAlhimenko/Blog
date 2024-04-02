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
    console.log(JSON.stringify({ user: { email, username, password, image: website } }))
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

  return { loginUser, registrationUser, updateProfile }
}

export default ServicesPost
