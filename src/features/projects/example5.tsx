import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const data = {}
export default function MyExample() {
  // const { isLoading, error, data } = useQuery(['repoData'], () =>
  //   fetch('https://api.github.com/repos/tannerlinsley/react-query').then(
  //     (res) => res.json()
  //   )
  // )

    const { data, isLoading, error } = useQuery({
      // 设置query的key，要求独一无二，以数组格式，可以提供多个key
      queryKey: ['query'],
      queryFn: () => fetch('https://api.github.com/repos/tannerlinsley/react-query').then((res) =>  res.json()),
      // 发起请求的函数
    })


  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

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
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}
