/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { parseISO, format } from 'date-fns'
import { Pagination, Spin } from 'antd'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'

import Services from '../../services/serviceGet'
import LikeButton from '../Likes/Likes'
import ServicesPost from '../../services/servicesPost'

import style from './ListBlogs.module.scss'

const ListBlogs = ({api_token, currentPage, changeCurrentPage }) => {
  const [articles, setArticles] = useState(undefined)
  const [ offset, setOffset ] = useState(0)
  const [ loading, setLoading ] = useState(true) 
  const [ token, setToken ]= useState(false)
  // const [notAuthentification, setNotAuthentification] = useState(false)

  const changePage = (e) => {
    let offset= (e - 1) * 20
    setOffset(offset)
  }
  useEffect(() => {
    setToken(api_token)
    Services()
      .getArticles(currentPage, api_token)
      .then((res) => {
        setLoading(true)
        setArticles(res)
        setLoading(false)
        setLoading(false)
      }).finally(() => {
        setLoading(false)
      })
  }, [api_token])

  useEffect(() => {
    return () => changeCurrentPage(offset)
  }, [offset])

  useEffect(() => {
    Services()
      .getArticles(currentPage, api_token)
      .then((res) => {
        // if(api_tocken){
        //   setNotAuthentification(true)
        // }
        setLoading(true)
        setArticles(res)
        setLoading(false)
        setLoading(false)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if(offset !== undefined){
      Services()
        .getArticles(offset)
        .then((res) => {
          if(!res){
            Services()
              .getArticles(offset)
              .then((res) => {
                setArticles(res)
              }
              )
          }
          setArticles(res)
        })
      window.scrollTo(0, 0)
    }

  }, [offset])

  const content = articles ? articles.articles.map((item) => <Item token={token} key={item.slug} data={item} />) : ''
  const pagination = articles ? <Pagination defaultCurrent={currentPage ? (currentPage / 20 + 1) : 1} onChange={(e) => changePage(e)} className={style.pagination}  showSizeChanger={false} pageSize={20} total={articles.articlesCount} /> : ''
  const spiner = loading ? <Spin dotSize={250} className={style.spiner} size='large' tip='loading...'/> : '' 

  return (
    <div className={style.articles__list}>
      {spiner}
      {content}
      {pagination}
    </div>
  )
}

const Item = (data) => {
  const { slug, title, description, createdAt, favoritesCount, tagList, author, favorited } = data.data
  const [ favoriteCount, setFavoriteCaunt ] = useState(favoritesCount)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(favorited)
  }, [])
  const formatedDate = (date) => {
    const newDate = parseISO(date)
    return format(newDate, 'MMMM d, yyyy')
  }
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
    if(tags.length){
      const result = tags.map((item, i) => {
        const croppedTag = shortenText(item, 20)
        return (
          <span key={i} className={style.tag}>{croppedTag}</span>
        )
      })
      return result.splice(0, 5)
    } else{
      return ''
    }
  }
  const handleLike = (slug) => {
    const like = !liked
    if (like) {
      ServicesPost().likePost(slug, data.token)
      setFavoriteCaunt((state) => state += 1)
    } else {
      ServicesPost().unlikePost(slug, data.token)
      setFavoriteCaunt((state) => state -= 1)
    }
    setLiked(like)
  }
  const croppedTitle = shortenText(title, 30)
  const croppedDescription = shortenText(description, 530)

  return (
    <div className={style.item}>
      <div className={style.info}>
        <div className={style.info__article}>
          <div className={style.info__header}>
            <Link to={`/articles/${slug}`}><span className={style.info__title}>{croppedTitle}</span></Link>
            <div className={style.info__likes}>
              <LikeButton className={style.like} liked={liked} defaultValue={favorited} onLike={() => handleLike(slug)} />
              {favoriteCount}
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
      <div className={style.content}>{croppedDescription}</div>
    </div>
  )
}

export default ListBlogs
