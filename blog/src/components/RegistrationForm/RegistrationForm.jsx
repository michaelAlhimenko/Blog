import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

import ServicesPost from '../../services/servicesPost.js'

import style from './RegistrationForm.module.scss'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  username: yup.string().min(3).max(20).required(),
  password: yup.string().min(6).max(40).required(),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null]),
  terms: yup.bool().oneOf([true], 'Must Accept Terms and Conditions'),
})

const RegistrationForm = ({ updateUser, history }) => {
  const [serverErrors, setServerErrors] = useState({})
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setServerErrors({})
    const res = await ServicesPost().registrationUser(data.username, data.email, data.password)
    if (res.errors) {
      console.log(res)
      setServerErrors({ email: res.errors.email, password: res.errors.password, username: res.errors.username })
    } else {
      updateUser(res)
      setServerErrors({})
      history.push('/')
    }
  }

  return (
    <div className={style['registration-block']}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <p className={style.title}>Create new account</p>
        <p className={style.subtitle}>Email address</p>
        <input
          {...register('email')}
          className={`${style['text-input']} ${serverErrors.email ? style['error-input'] : ''}`}
          placeholder="Email"
          onBlur={() => trigger('email')}
        />
        <p className={style['error-text']}>{errors.email?.message}</p>

        <p className={style.subtitle}>Username</p>
        <input
          {...register('username')}
          className={`${style['text-input']} ${serverErrors.username ? style['error-input'] : ''}`}
          placeholder="Username"
          onBlur={() => trigger('username')}
        />
        <p className={style['error-text']}>{errors.username?.message}</p>

        <p className={style.subtitle}>Password</p>
        <input
          {...register('password')}
          className={`${style['text-input']} ${errors.password ? style['error-input'] : ''}`}
          placeholder="Password"
          type="password"
          onBlur={() => trigger('password')}
        />
        <p className={style['error-text']}>{errors.password?.message}</p>

        <p className={style.subtitle}>Repeat Password</p>
        <input
          {...register('repeatPassword')}
          placeholder="Repeat Password"
          className={`${style['text-input']}`}
          type="password"
          onBlur={() => trigger('repeatPassword')}
        />
        <p className={style['error-text']}>{errors.repeatPassword && 'Passwords Must Match!'}</p>

        <div className={style.divider}></div>

        <label className={style['checkbox-text']}>
          <input {...register('terms')} className={style['checkbox']} type="checkbox" />I agree to the processing of my
          personal information
        </label>
        <p className={style['error-text']}>{errors.terms?.message}</p>

        <button className={style['submit-button']} type="submit">
          Create
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

export default RegistrationForm
