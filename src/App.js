import "./App.css"
import { createMachine, interpret, assign } from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"

const chessMachine = createMachine(
  {
    id: "chessTimer",
    context: {
      whiteTime: 600,
      blackTime: 600,
    },
    initial: "init",
    states: {
      init: {
        on: {
          PLAY: "started",
        },
      },
      started: {
        on: {
          TOGGLE_PAUSE: "pause",
        },
        initial: "whiteTurn",
        states: {
          whiteTurn: {
            initial: "whitePlay",
            states: {
              whitePlay: {},
              whiteEnd: {},
            },
            on: {
              WHITE_CLICK: "blackTurn",
            },
          },
          blackTurn: {
            initial: "blackPlay",
            states: {
              blackPlay: {},
              blackEnd: {},
            },
            on: {
              BLACK_CLICK: "whiteTurn",
            },
          },
          hist: {
            type: "history",
          },
        },
      },
      pause: {
        on: {
          TOGGLE_PAUSE: "started.hist",
        },
      },
    },
  },
  {
    actions: {},
    guards: {
      isStarted: (ctx) => ctx.gameState !== "init",
      isPaused: (ctx) =>
        ctx.gameState !== "whitePause" || ctx.gameState !== "blackPause",
    },
  }
)

const showTime = (time) => {
  let min = Math.floor(Math.abs(time) / 60)
  let sec = Math.abs(time) % 60
  if (sec < 10) {
    sec = "0" + sec
  }
  if (min < 10) {
    min = "0" + min
  }

  return `${min} : ${sec}`
}

function App() {
  const [state, send] = useMachine(chessMachine)

  const onClickPlay = (e) => {
    e.preventDefault()
    if (state.matches("init")) {
      send("PLAY")
    } else {
      send("TOGGLE_PAUSE")
    }
  }
  useEffect(() => {
    console.log(state.value)
    console.log(state.matches("started"))
    console.log(state.matches("started.whiteTurn"))
  }, [state])

  const onClickWhite = (e) => {
    e.preventDefault()
    if (state.matches("started.whiteTurn")) {
      send("WHITE_CLICK")
    }
  }

  const onClickBlack = (e) => {
    e.preventDefault()
    if (state.matches("started.blackTurn")) {
      send("BLACK_CLICK")
    }
  }

  return (
    <div className="App">
      <div id="footer">
        made by <a href="https://www.instagram.com/hhhhhhdong/">@hhhhhhdong</a>
      </div>
      <div id="main">
        <div onClick={onClickWhite} data-team="white" className="timer white">
          <span className="center">{showTime(state.context.whiteTime)}</span>
          <p></p>
        </div>
        <div id="setting">
          <div className="reset whiteColor">
            <i className="fas fa-redo center"></i>
          </div>
          <div onClick={onClickPlay} className="pause grayColor">
            {state.matches("started") ? (
              <i className="fas fa-pause center"></i>
            ) : (
              <i className="fas fa-play center"></i>
            )}
          </div>
          <div className="time whiteColor">
            <div className="plus">
              <i className="fas fa-plus center"></i>
            </div>
            <div className="minus">
              <i className="fas fa-minus center"></i>
            </div>
          </div>
        </div>
        <div onClick={onClickBlack} data-team="black" className="timer black">
          <span className="center">{showTime(state.context.blackTime)}</span>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default App
