// 第一个组件
// import MyButton from './example1'
import { Separator } from '@/components/ui/separator'
import CardWithForm from './example2'
import DialogDemo from './example3'
import MyPost from './example4'
import MyExample from './example5'

export default function Projects() {
  return (
    <div>
      <div className='m-2 grid grid-cols-2 gap-8'>
        <div>
          <CardWithForm />
        </div>
        <div>
          <DialogDemo />
        </div>
      </div>

      <Separator className='my-4' />
      <Separator className='my-4' />
      <div>
        <MyPost />
        <MyExample />
      </div>
    </div>
  )
}
