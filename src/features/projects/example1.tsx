import { Separator } from '@/components/ui/separator'

// https://element.eleme.cn/#/zh-CN/component/layout
// https://blog.csdn.net/weixin_4262单元563/article/details/147936135
// https://tailwindcss.com/docs/grid-column

export default function MyButton() {
  return (
    <div>
      <Separator className='my-2' />
      <h1>基础布局</h1>
      <span>基础布局使用单一分栏创建基础的栅格布局</span>
      <Separator className='my-2' />
      <div className='grid'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-2'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-3'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元3</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-4'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元3</div>
        <div className='rounded-xs bg-blue-500'>单元4</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-6'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元3</div>
        <div className='rounded-xs bg-blue-500'>单元4</div>
        <div className='rounded-xs bg-blue-500'>单元5</div>
        <div className='rounded-xs bg-blue-500'>单元6</div>
      </div>

      <Separator className='my-2' />
      <h1>分栏间隔</h1>
      <span>分栏之间存在间隔</span>
      <Separator className='my-2' />
      <div className='grid grid-cols-3 gap-4'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元3</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-3 gap-4'>
        <div className='col-span-2 rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
      </div>

      <Separator className='my-2' />
      <div className='grid grid-cols-6 gap-4'>
        <div className='col-span-2 rounded-xs bg-blue-500'>单元1</div>
        <div className='col-span-2 rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
      </div>
      <Separator className='my-2' />
      <div className='grid grid-cols-6 gap-4'>
        <div className='col-span-1 rounded-xs bg-blue-500'>单元1</div>
        <div className='col-span-4 rounded-xs bg-blue-500'>单元4</div>
        <div className='col-span-1 bg-blue-500'>单元1</div>
      </div>

      <Separator className='my-2' />
      <h1>分栏偏移</h1>
      <span>支持偏移指定的栏数</span>
      <Separator className='my-2' />
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 col-start-2 rounded-xs bg-blue-500'>
          单元1
        </div>
        <div className='col-span-1 col-start-4 rounded-xs bg-blue-500'>
          单元1
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-1 rounded-xs bg-blue-500'>单元1</div>
        <div className='col-span-1 col-start-3 rounded-xs bg-blue-500'>
          单元1
        </div>
      </div>
      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-2 col-start-2 rounded-xs bg-blue-500'>
          单元2
        </div>
      </div>

      <Separator className='my-2' />
      <h1>对齐方式</h1>
      <span>通过 flex 布局来对分栏进行灵活的对齐</span>

      <div className='grid h-10 grid-cols-5 content-end gap-4'>
        <div className='rounded-xs bg-blue-500'>单元1</div>
        <div className='rounded-xs bg-blue-500'>单元2</div>
        <div className='rounded-xs bg-blue-500'>单元3</div>
        <div className='rounded-xs bg-blue-500'>单元4</div>
        <div className='rounded-xs bg-blue-500'>单元5</div>
      </div>

      <Separator className='my-2' />
      <h1>对齐方式</h1>
      <span>通过 flex 布局来对分栏进行灵活的对齐</span>
      <Separator className='my-2' />
    </div>
  )
}
