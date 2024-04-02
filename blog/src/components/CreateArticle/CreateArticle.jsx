import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
const CreateArticle = ({ user }) => {
  console.log(user)
  if (!user) {
    return <Redirect to={'/sign-in'} />
  }
}
export default CreateArticle
