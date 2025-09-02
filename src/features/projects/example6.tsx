import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTodos, postTodo } from './my-api'

export default function Todos() {
  // 访问 client
  const queryClient = useQueryClient()

  // 查询
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // 修改
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // 错误处理和刷新
      queryClient.invalidateQueries(['todos'])
    },
  })

  return (
    <div>
      <ul>
        {query.data.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
