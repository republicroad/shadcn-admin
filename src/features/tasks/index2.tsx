import React, { memo } from 'react'

type ThemeContextValue = {
  color: string
  background: string
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null) // 主题颜色Context
const LanContext = React.createContext<string | null>(null) // 主题语言Context

function ConsumerDemo() {
  return (
    <ThemeContext.Consumer>
      {(themeContextValue) => (
        <LanContext.Consumer>
          {(lanContextValue) => {
            const { color, background } = themeContextValue || { color: '', background: '' }
            return (
              <div style={{ color, background }}>
                {' '}
                {lanContextValue === 'CH'
                  ? '大家好，让我们一起学习React!'
                  : 'Hello, let us learn React!'}{' '}
              </div>
            )
          }}
        </LanContext.Consumer>
      )}
    </ThemeContext.Consumer>
  )
}

const Son = memo(() => <ConsumerDemo />)

export default function Tasks() {
  const [themeContextValue] = React.useState<ThemeContextValue>({
    color: '#FFF',
    background: 'blue',
  })
  const [lanContextValue] = React.useState<string>('CH') // CH -> 中文 ， EN -> 英文

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <LanContext.Provider value={lanContextValue}>
        <Son />
      </LanContext.Provider>
    </ThemeContext.Provider>
  )
}
