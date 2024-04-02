import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { parseISO, format } from 'date-fns'

import Services from '../../services/serviceGet'

import style from './SinglePage.module.scss'

const SinglePage = (props) => {
  const id = props.match.params.id
  const [article, setArticle] = useState(undefined)

  useEffect(() => {
    Services()
      .getArticle(id)
      .then((res) => {
        const { article } = res
        setArticle(article)
        window.scrollTo(0, 0)
      })
  }, [])

  const content = article ? <Item data={article} /> : ''

  return content
}

const Item = (data) => {
  const bodyArticle = data ? <Markdown>{data.data.body}</Markdown> : ''
  const { description, title, createdAt, tagList, favoritesCount, author } = data.data
  console.log(data.data, bodyArticle)

  const shortenText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text
    }

    let shortened = text.slice(0, maxLength)
    let lastSpaceIndex = shortened.lastIndexOf(' ')

    if (lastSpaceIndex !== -1) {
      shortened = shortened.slice(0, lastSpaceIndex)
    }

    return shortened + '...'
  }
  const tagsList = (tags) => {
    if (tags.length) {
      const result = tags.map((item, i) => {
        const croppedTag = shortenText(item, 20)
        return (
          <span key={i} className={style.tag}>
            {croppedTag}
          </span>
        )
      })
      return result.splice(0, 5)
    } else {
      return ''
    }
  }
  const formatedDate = (date) => {
    const newDate = parseISO(date)
    return format(newDate, 'MMMM d, yyyy')
  }

  return (
    <div className={style['single-page']}>
      <div className={style['single-page__header']}>
        <div className={style.item}>
          <div className={style.info}>
            <div className={style.info__article}>
              <div className={style.info__header}>
                <span className={style.info__title}>{title}</span>
                <div className={style.info__likes}>{favoritesCount}</div>
              </div>
              <div className={style.tags}>{tagsList(tagList)}</div>
            </div>
            <div className={style.info__user}>
              <div className={style.info__text}>
                <span className={style.info__name}>{author.username}</span>
                <span className={style.info__date}>{formatedDate(createdAt)}</span>
              </div>
              <img className={style.avatar} alt="avatar of user" src={author.image} />
            </div>
          </div>
          <div className={style.description}>{description}</div>
        </div>
      </div>
      <div className={style.body}>{bodyArticle}</div>
    </div>
  )
}
export default SinglePage
