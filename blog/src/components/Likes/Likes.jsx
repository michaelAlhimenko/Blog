import { Button, Tooltip } from 'antd'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'

const LikeButton = ({ liked, onLike, className }) => {
  return (
    <Tooltip title="Like">
      <Button className={className} type="link" onClick={onLike}>
        {liked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
      </Button>
    </Tooltip>
  )
}

export default LikeButton
