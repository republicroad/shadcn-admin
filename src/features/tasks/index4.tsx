import React from 'react'

type ThemeContextValue = {
  color: string
  background: string
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)
function Son2(){
    return <ThemeContext.Consumer>
        { (themeContextValue2)=>{
            const { color , background } = themeContextValue2 || { color: '', background: '' }
            return  <div  className="sonbox"  style={{ color,background } } >  第二层Provder </div>
        }  }
    </ThemeContext.Consumer>
}

function Son(){
    const themeContextValue = React.useContext(ThemeContext)
    const { color, background } = themeContextValue || { color: '', background: '' }
    const [ themeContextValue2 ] = React.useState<ThemeContextValue>({  color:'#fff', background:'blue' })
    /* 第二层 Provder 传递内容 */
    return <div className='box' style={{ color,background } } >
        第一层Provder
        <ThemeContext.Provider value={ themeContextValue2 } >
            <Son2  />
        </ThemeContext.Provider>
    </div>

}
function Provider1Demo(){
    const [ themeContextValue ] = React.useState<ThemeContextValue>({  color:'orange', background:'pink' })
     /* 第一层  Provider 传递内容  */
    return <ThemeContext.Provider value={ themeContextValue } >
        <Son/>
    </ThemeContext.Provider>
}


export default function Tasks() {
  return (
    <Provider1Demo></Provider1Demo>
  )
}
