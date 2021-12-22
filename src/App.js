import './App.css'
import { useMachine } from '@xstate/react'

import chessMachine from './utils/machin'

import White from './components/White'
import Black from './components/Black'
import Setting from './components/Setting'

function App() {
  const [state, send] = useMachine(chessMachine)

  return (
    <div className="App">
      <div id="footer">
        made by{' '}
        <a href="https://github.com/hhhhhhdong/chessTimer-XState">
          @hhhhhhdong
        </a>
      </div>
      <div id="main">
        <White state={state} send={send} />
        <Setting state={state} send={send} />
        <Black state={state} send={send} />
      </div>
    </div>
  )
}

export default App
