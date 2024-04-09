import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { parseISO, format } from 'date-fns'
import { Button, Popconfirm } from 'antd'

import LikeButton from '../Likes/Likes'
import Services from '../../services/serviceGet'
import ServicesDel from '../../services/servicesDel'
import ServicesPost from '../../services/servicesPost'

import style from './SinglePage.module.scss'

const SinglePage = (props) => {
  const id = props.match.params.id
  const [article, setArticle] = useState(undefined)
  const [articleIsOwn, setArticleIsOwn] = useState(false)
  console.log(props)
  useEffect(() => {
    Services()
      .getArticle(id, props.user.token)
      .then((res) => {
        const { article } = res
        setArticle(article)
        window.scrollTo(0, 0)
      })
  }, [])
  useEffect(() => {
    if (article) {
      if (article.author.username === props.user.username) {
        setArticleIsOwn(true)
      }
    }
  }, [article])

  const content = article ? (
    <Item
      auth={props.user.token}
      slug={props.user.slug}
      history={props.history}
      data={article}
      isOwnArticle={articleIsOwn}
    />
  ) : (
    ''
  )

  return content
}

const Item = ({ auth, data, isOwnArticle, history }) => {
  const bodyArticle = data ? <Markdown>{data.body}</Markdown> : ''
  const { slug, description, title, createdAt, tagList, favoritesCount, author, favorited } = data
  const [favoriteCount, setFavoriteCaunt] = useState(favoritesCount)
  const [liked, setLiked] = useState(false)
  console.log(data)
  useEffect(() => {
    setLiked(favorited)
  }, [])
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
  const buttonsControls = () => {
    if (isOwnArticle) {
      return (
        <>
          <button onClick={() => history.push(`/articles/${slug}/edit`)} className={style['button-edit']}>
            Edit
          </button>
          <Popconfirm
            placement="rightTop"
            onConfirm={() => onDelete(slug, auth)}
            title="Are you sure to delete this article?"
            okText="Yes"
            cancelText="No"
          >
            <Button>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  }

  const onDelete = async (slug, auth) => {
    await ServicesDel()
      .deleteArticle(slug, auth)
      .then(() => {
        history.push('/')
      })
  }
  const handleLike = (slug, token) => {
    const like = !liked
    if (like) {
      ServicesPost().likePost(slug, token)
      setFavoriteCaunt((state) => (state += 1))
    } else {
      ServicesPost().unlikePost(slug, token)
      setFavoriteCaunt((state) => (state -= 1))
    }
    setLiked(like)
  }
  return (
    <div className={style['single-page']}>
      <div className={style['single-page__header']}>
        <div className={style.item}>
          <div className={style.info}>
            <div className={style.info__article}>
              <div className={style.info__header}>
                <span className={style.info__title}>{title}</span>
                <div className={style.info__likes}>
                  <LikeButton
                    className={style.like}
                    liked={liked}
                    defaultValue={favorited}
                    onLike={() => handleLike(slug, auth)}
                  />
                  <span>{favoriteCount}</span>
                </div>
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
          <div className={style.info__subheader}>
            <div className={style.description}>{description}</div>
            <div className={style.info__buttons}>{buttonsControls()}</div>
          </div>
        </div>
      </div>
      <div className={style.body}>{bodyArticle}</div>
    </div>
  )
}
export default SinglePage
