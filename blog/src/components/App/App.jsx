import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Header from '../Header/Header'
import ListBlogs from '../ListBlogs/ListBlogs'
import SinglePage from '../SinglePage/SinglePage'
import RegistrationForm from '../RegistrationForm/RegistrationForm'
import SignIn from '../SignIn/SignIn'
import Profile from '../Profile/Profile'
import CreateArticle from '../CreateArticle/CreateArticle'

import style from './App.module.scss'

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [user, setUser] = useState(false)

  useEffect(() => {
    const userFromLocalStorage = localStorage.getItem('userOfBlog')
    if (userFromLocalStorage) {
      setUser(JSON.parse(userFromLocalStorage))
    }
  }, [])

  const updateUser = (data) => {
    setUser((state) => {
      let img = state.image

      if (data.user.image.length !== 0) {
        img = data.user.image
      }
      console.log(img)
      return {
        ...state,
        ...data.user,
        image: img,
      }
    })
    saveUserDataInLocalStor(data.user)
    // username: username, password: password, api_key: key, userIn: true
  }

  const deleteUser = () => {
    setUser(false)
    clearUserDataInLocalStor('userOfBlog')
  }

  const changeCurrentPage = (page) => {
    setCurrentPage(page)
  }

  const saveUserDataInLocalStor = (currentData) => {
    const oldData = JSON.parse(localStorage.getItem('userOfBlog')) || {}
    const updatedData = {
      ...oldData,
      ...currentData,
    }
    localStorage.setItem('userOfBlog', JSON.stringify(updatedData))
  }

  const clearUserDataInLocalStor = () => {
    localStorage.removeItem('userOfBlog')
  }

  return (
    <div className={style.App}>
      <Router>
        <Header user={user} deleteUser={deleteUser} />
        <Route
          render={({ location }) => (
            <TransitionGroup>
              <CSSTransition
                key={location.key}
                timeout={450}
                classNames={{
                  enter: style.fadeEnter,
                  enterActive: style.fadeEnterActive,
                  exit: style.fadeExit,
                  exitActive: style.fadeExitActive,
                }}
              >
                <div className={style.layout}>
                  <Switch location={location}>
                    <Route
                      exact
                      path={['/', '/articles']}
                      render={() => <ListBlogs currentPage={currentPage} changeCurrentPage={changeCurrentPage} />}
                    />
                    <Route path={'/articles/:id'} render={(props) => <SinglePage {...props} />} />
                    <Route path={'/sign-up'} render={() => <RegistrationForm updateUser={updateUser} />} />
                    <Route
                      path={'/sign-in'}
                      render={({ history }) => <SignIn updateUser={updateUser} history={history} />}
                    ></Route>
                    <Route path={'/profile'} render={() => <Profile user={user} updateUser={updateUser} />} />
                    <Route path={'/new-article'} render={() => <CreateArticle user={user} />} />
                  </Switch>
                </div>
              </CSSTransition>
            </TransitionGroup>
          )}
        />
      </Router>
    </div>
  )
}

export default App
