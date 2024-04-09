import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { withRouter } from 'react-router-dom'

import ServicesPost from '../../services/servicesPost'
import ServicesGet from '../../services/serviceGet'

import style from './CreateArticle.module.scss'

const schema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string().required(),
  body: yup.string().required(),
  tags: yup.array().of(yup.string().required()).required(),
})

const CreateArticle = (props) => {
  const [typePage, setTypePage] = useState('create')
  const [article, setArticle] = useState(undefined)
  const [fields, setFields] = useState([{ value: null }])
  const [slug, setSlug] = useState('')

  useEffect(() => {
    if (props.location.pathname) {
      const str = props.location.pathname.split('/')
      const type = str.slice(-1)[0]
      const slug = str.slice(-2)[0]
      setSlug(slug)
      if (type) {
        setTypePage(type)
      }
      ServicesGet()
        .getArticle(slug)
        .then((res) => {
          const { article } = res
          setArticle(article)
        })
    } else {
      setTypePage('create')
    }
  }, [])

  useEffect(() => {
    if (article && typePage === 'edit') {
      let newFields = []
      article.tagList.map((elem) => {
        newFields.push({ value: elem })
      })
      setFields(newFields)
    }
  }, [article])

  const addField = () => {
    const newFields = [...fields, { value: null }]
    setFields(newFields)
  }

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index)
    setFields(newFields)
  }
  const generateTags = () => {
    return fields.map((field, index) => (
      <div className={style['tags-input']} key={index}>
        <input
          {...register(`tags[${index}]`)}
          className={`${style['text-input']} ${style['text-input__tag']}`}
          placeholder="Tag"
          value={field.value || ''}
          onChange={(e) => {
            const newFields = fields.slice()
            newFields[index].value = e.target.value
            trigger(`tags[${index}]`)
            setFields(newFields)
          }}
        />
        <p className={style['error-text']}>{errors.tags?.message}</p>
        <button className={style['button-remove']} onClick={() => removeField(index)}>
          Delete
        </button>
        {index === fields.length - 1 && (
          <button className={style['button-add']} type="button" onClick={addField}>
            Add tag
          </button>
        )}
      </div>
    ))
  }
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    const { title, description, body, tags } = data
    let res
    if (typePage === 'edit') {
      res = await ServicesPost()
        .updateArticle(title, description, body, tags, props.user.token, slug)
        .then(() => props.history.push('/'))
    } else {
      res = await ServicesPost()
        .createArticle(title, description, body, tags, props.user.token)
        .then(() => props.history.push('/'))
    }
    console.log(res)
  }
  const title = typePage == 'edit' ? 'Edit' : 'Create new article'
  const titleValue = typePage === 'edit' && article ? article.title : ''
  const descriptionValue = typePage === 'edit' && article ? article.description : ''
  const bodyValue = typePage === 'edit' && article ? article.body : ''

  return (
    <div className={style['article-block']}>
      <form className={style.form} onSubmit={handleSubmit(onSubmit)}>
        <p className={style.title}>{title}</p>
        <p className={style.subtitle}>Title</p>
        <input
          {...register('title')}
          className={style['text-input']}
          placeholder="Title"
          defaultValue={titleValue}
          onBlur={() => trigger('title')}
        />
        <p className={style['error-text']}>{errors.title?.message}</p>

        <p className={style.subtitle}>Short description</p>
        <input
          {...register('description')}
          className={style['text-input']}
          placeholder="Description"
          defaultValue={descriptionValue}
          onBlur={() => trigger('description')}
        />
        <p className={style['error-text']}>{errors.description?.message}</p>

        <p className={style.subtitle}>Text</p>
        <textarea
          {...register('body')}
          className={`${style['text-input']} ${style['text-input--large']}`}
          placeholder="Text"
          defaultValue={bodyValue}
          onBlur={() => trigger('body')}
        />
        <p className={style['error-text']}>{errors.body?.message}</p>
        <p className={style.subtitle}>Tags</p>
        <div className={style['tags-wrapper']}>{generateTags()}</div>
        <button className={style['submit-button']} type="submit">
          Send
        </button>
      </form>
    </div>
  )
}
export default withRouter(CreateArticle)
