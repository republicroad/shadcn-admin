import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type LexiconTestPanelProps = {
  lexiconName: string
  matches: string[]
  testText: string
  isTesting: boolean
  onTestTextChange: (value: string) => void
  onTest: () => void
}

export function LexiconTestPanel({
  lexiconName,
  matches,
  testText,
  isTesting,
  onTestTextChange,
  onTest,
}: LexiconTestPanelProps) {
  return (
    <div className='overflow-hidden rounded-md border'>
      <div className='flex items-center justify-between gap-3 border-b bg-muted/60 px-4 py-3'>
        <div>
          <h3 className='font-semibold text-muted-foreground'>词库测试</h3>
          <p className='mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground'>
            <span>当前词库：</span>
            <span className='rounded-sm bg-background px-1.5 py-0.5 font-medium text-foreground shadow-xs'>
              {lexiconName}
            </span>
          </p>
        </div>
        <Button disabled={!testText.trim() || isTesting} onClick={onTest}>
          {isTesting ? '测试中...' : '测试'}
        </Button>
      </div>
      <div className='space-y-3 p-4'>
        <Textarea
          value={testText}
          placeholder='请输入待测试文本'
          rows={4}
          onChange={(event) => onTestTextChange(event.target.value)}
        />
        <div className='space-y-2'>
          <p className='text-sm font-medium text-muted-foreground'>命中结果</p>
          <div className='flex min-h-8 flex-wrap gap-2'>
            {matches.length === 0 ? (
              <span className='text-sm text-muted-foreground'>
                暂无命中结果。
              </span>
            ) : (
              matches.map((item, index) => (
                <Badge key={`${item}-${index}`} variant='secondary'>
                  {item}
                </Badge>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
