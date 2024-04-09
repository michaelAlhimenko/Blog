import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

import ServicesPost from '../../services/servicesPost.js'

import style from './Profile.module.scss'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().min(3).max(20).required(),
  password: yup.string().min(6).max(40).required(),
  website: yup.string().url(),
})

const Profile = ({ user, updateUser, history }) => {
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    ServicesPost()
      .updateProfile(data.email, data.username, data.password, data.website, user.token)
      .then((res) => {
        updateUser(res)
        history.push('/')
      })
  }
  return (
    <div className={style['profile-block']}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <p className={style.title}>Edit Profile</p>

        <p className={style.subtitle}>Username</p>
        <input
          {...register('username')}
          className={style['text-input']}
          placeholder="Username"
          defaultValue={user.username}
          onBlur={() => trigger('username')}
        />
        <p className={style['error-text']}>{errors.username?.message}</p>

        <p className={style.subtitle}>Email address</p>
        <input
          {...register('email')}
          className={style['text-input']}
          placeholder="Email"
          defaultValue={user.email}
          onBlur={() => trigger('email')}
        />
        <p className={style['error-text']}>{errors.email?.message}</p>

        <p className={style.subtitle}>New password</p>
        <input
          {...register('password')}
          className={style['text-input']}
          placeholder="Password"
          type="password"
          onBlur={() => trigger('password')}
        />
        <p className={style['error-text']}>{errors.password?.message}</p>

        <p className={style.subtitle}>Avatar image (url)</p>
        <input
          {...register('website')}
          className={style['text-input']}
          placeholder="Avatar image"
          onBlur={() => trigger('website')}
        />
        <p className={style['error-text']}>{errors.website?.message}</p>

        <button className={style['submit-button']} type="submit">
          Save
        </button>
      </form>
      <div className={style.link}>
        <p>
          Already have an account? <Link to="/sign-in">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Profile
