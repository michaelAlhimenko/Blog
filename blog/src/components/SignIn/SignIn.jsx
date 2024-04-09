import { useState } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import ServicesPost from '../../services/servicesPost'

import style from './SignIn.module.scss'

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).max(40).required(),
})

const SignIn = ({ updateUser, history }) => {
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
    const res = await ServicesPost().loginUser(data.email, data.password)
    if (res.errors) {
      setServerErrors({ email: res.errors, password: res.errors })
    } else {
      updateUser(res)
      setServerErrors({})
      history.push('/')
    }
  }

  return (
    <div className={style['signIn-block']}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <p className={style.title}>Sign In</p>
        <p className={style.subtitle}>Email address</p>
        <input
          {...register('email')}
          className={`${style['text-input']} ${serverErrors.email ? style['error-input'] : ''}`}
          placeholder="Email"
          onBlur={() => trigger('email')}
        />
        <p className={style['error-text']}>{errors.email?.message}</p>

        <p className={style.subtitle}>Password</p>
        <input
          {...register('password')}
          className={`${style['text-input']} ${serverErrors.password ? style['error-input'] : ''} `}
          placeholder="Password"
          type="password"
          onBlur={() => trigger('password')}
        />
        <p className={style['error-text']}>{errors.password?.message}</p>

        <button className={style['submit-button']} type="submit">
          Login
        </button>
      </form>
      <div className={style.link}>
        <p>
          Don’t have an account?<Link to="/sign-up">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
export default SignIn
