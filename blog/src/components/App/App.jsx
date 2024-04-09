import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'

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
      downDataFromLocalStorage(userFromLocalStorage)
    }
  }, [])

  const downDataFromLocalStorage = (localStorage) => {
    setUser(JSON.parse(localStorage))
  }

  const updateUser = (data) => {
    let newData
    setUser((state) => {
      newData = {
        ...state,
        ...data.user,
      }
      return newData
    })
    saveUserDataInLocalStor(newData)
  }

  const deleteUser = () => {
    setUser(false)
    clearUserDataInLocalStor('userOfBlog')
  }

  const changeCurrentPage = (page) => {
    setCurrentPage(page)
  }

  const saveUserDataInLocalStor = (currentData) => {
    localStorage.setItem('userOfBlog', JSON.stringify(currentData))
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
                      render={() => {
                        if (localStorage.getItem('userOfBlog')) {
                          if (user) {
                            return (
                              <ListBlogs
                                api_token={user.token}
                                currentPage={currentPage}
                                changeCurrentPage={changeCurrentPage}
                              />
                            )
                          }
                        }
                        if (!localStorage.getItem('userOfBlog')) {
                          return (
                            <ListBlogs
                              api_token={user.token}
                              currentPage={currentPage}
                              changeCurrentPage={changeCurrentPage}
                            />
                          )
                        }
                      }}
                    />
                    <Route path={'/articles/:id/edit'} render={(props) => <CreateArticle user={user} {...props} />} />
                    <Route
                      exact
                      path={'/articles/:id'}
                      render={(props) => <SinglePage {...props} user={user} api_token={user.token} />}
                    />
                    <Route
                      path={'/sign-up'}
                      render={({ history }) => <RegistrationForm updateUser={updateUser} history={history} />}
                    />
                    <Route
                      path={'/sign-in'}
                      render={({ history }) => <SignIn updateUser={updateUser} history={history} />}
                    ></Route>
                    <Route
                      path={'/profile'}
                      render={({ history }) => <Profile user={user} updateUser={updateUser} history={history} />}
                    />
                    <Route
                      path={'/new-article'}
                      render={() => {
                        if (user) {
                          return <CreateArticle user={user} />
                        } else if (!user && !localStorage.getItem('userOfBlog')) {
                          return <Redirect to="/sign-in" />
                        }
                      }}
                    />
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
