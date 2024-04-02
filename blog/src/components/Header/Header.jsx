import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

import style from './Header.module.scss'

const Header = ({ user, deleteUser }) => {
  const [currentUser, setCurrentUser] = useState(false)

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      setCurrentUser(user)
    }
  }, [user])

  const onDeleteUser = () => {
    setCurrentUser(false)
    deleteUser()
  }

  const profileIcon = currentUser ? <UserInfo data={currentUser} /> : ''

  return (
    <header className={style.header}>
      <Link to={'/'}>
        <p className={style.header__title}>Realworld Blog</p>
      </Link>
      <div className={style['auth-buttons']}>
        <Link to="/new-article">
          <button className={style['auth-buttons__button-create']}>Create article</button>
        </Link>
        <Link className={!currentUser ? style.show : style.none} to={'/sign-in'}>
          <button className={style['auth-buttons__button']}>Sign In</button>
        </Link>
        {profileIcon}
        <Link className={!currentUser ? style.show : style.none} to={'/sign-up'}>
          <button className={style['auth-buttons__button-green']}>Sign Up</button>
        </Link>
        <Link onClick={() => onDeleteUser()} className={!currentUser ? style.none : style.show} to={'/'}>
          <button className={style['auth-buttons__button-black']}>Log Out</button>
        </Link>
      </div>
    </header>
  )
}
const UserInfo = (data) => {
  let avatar = ''
  if (data.data.image) {
    avatar = data.data.image
  } else {
    avatar =
      'https://s3-alpha-sig.figma.com/img/ec78/8be1/2bf7cbea0e8e0ac709ec6af74b5bc3fa?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=O6MnjbMxhN82nuBpAdQ4Cg610XyHG-E2ZQDIO7iskfH3Qsz6JiIy-ZjY-IYB5GJweYXd~y9BBym2t0ZXfZ8XiggAz34PWstpZLqLP~21n9v4-GZvgdWudLJxgILZvTrnyCdlEQFs7FKZUwQVUB934T-v2e0an0z0q30XKN2pbdEnYEEodfX05SEI1KZtPl65~pWV27ea4WFBB6rkvsHq-n7rrDZk2fVZHkj7JnefyiQa8fPQdPgQYz5va417-GM00niw43W9zAudmoDSSQqJN2aCCEWYebxd0-ahadAbZ-CEaIXdTAe~q0uPXJ3hKs6NqEOvXzux7C9NG3gc5g-cSw__'
  }

  return (
    <Link className={style['info-profile']} to="/profile">
      <p className={style['username']}>{data.data.username}</p>
      <img className={style['img-avatar']} src={avatar} alt={'user avatar'} />
    </Link>
  )
}
export default Header
