import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const POSTS = [
  { id: '1', title: 'post1' },
  { id: '2', title: 'post2' },
]

function wait(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export default function MyPost() {
  // 调用useQuery后，可以解构出data，isLoading，isError，state等
  const { data, isLoading, error } = useQuery({
    // 设置query的key，要求独一无二，以数组格式，可以提供多个key
    queryKey: ['posts'],
    queryFn: () => wait(1000).then(() => [...POSTS]),
    // 发起请求的函数
  })
  if (isLoading) return <div>loading...</div>
  if (error) return <pre>{JSON.stringify(error)}</pre>
  if (!data) return <div>no data</div>

  // 定义修改数据
  // const newPostMutation = useMutation({
  //   mutationFn: (title: string) =>
  //     wait(1000).then(() => POSTS.push({ id: crypto.randomUUID(), title })),
  // })
  const handleClick = () => {
    console.log('11111111111')
  }

  return (
    <div>
      {data.map((post) => (
        <h1 key={post.title}>{post.title}</h1>
      ))}
      <Button onClick={handleClick}>添加</Button>
    </div>
  )
}
