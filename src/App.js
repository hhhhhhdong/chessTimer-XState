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
          PLUS_TIME: {
            actions: assign((context, event) => ({
              whiteTime: (context.whiteTime += 60),
              blackTime: (context.blackTime += 60),
            })),
          },
          MINUS_TIME: {
            actions: assign((context, event) => ({
              whiteTime: (context.whiteTime -= 60),
              blackTime: (context.blackTime -= 60),
            })),
          },
        },
      },
      started: {
        on: {
          TOGGLE_PAUSE: "pause",
          RESET: {
            target: "init",
            actions: assign((ctx) => {
              ctx.whiteTime = 600
              ctx.blackTime = 600
            }),
          },
        },
        initial: "whiteTurn",
        states: {
          whiteTurn: {
            initial: "whitePlay",
            states: {
              whitePlay: {},
              whiteEnd: {},
            },
            invoke: {
              src: (ctx) => (callback) => {
                const interval = setInterval(() => {
                  callback("DECREASE_WHITE_TIME")
                }, 1000)
                return () => {
                  clearInterval(interval)
                }
              },
            },
            on: {
              DECREASE_WHITE_TIME: {
                actions: "decreaseWhiteTime",
              },
              WHITE_CLICK: "blackTurn",
            },
          },
          blackTurn: {
            initial: "blackPlay",
            states: {
              blackPlay: {},
              blackEnd: {},
            },
            invoke: {
              src: (ctx) => (callback) => {
                const interval = setInterval(() => {
                  callback("DECREASE_BLACK_TIME")
                }, 1000)
                return () => {
                  clearInterval(interval)
                }
              },
            },
            on: {
              DECREASE_BLACK_TIME: {
                actions: "decreaseBlackTime",
              },
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
    actions: {
      decreaseWhiteTime: (ctx) => (ctx.whiteTime -= 1),
      decreaseBlackTime: (ctx) => (ctx.blackTime -= 1),
    },
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
    // play, pause 버튼 클릭시
    // 게임이 시작하지 않았으면 (state가 init인 상태) 게임시작 (white 부터)
    // 게임 진행중이라면 일시정지
    // history기능을 사용해서 이전 상태 기억함
    e.preventDefault()
    if (state.matches("init")) {
      send("PLAY")
    } else {
      send("TOGGLE_PAUSE")
    }
  }
  // useEffect(() => {
  //   // 디버깅용
  //   console.log(state.value)
  //   console.log(state.matches("started"))
  //   console.log(state.matches("started.whiteTurn"))
  // }, [state])

  const onClickPlus = (e) => {
    e.preventDefault()
    if (state.matches("init")) {
      send("PLUS_TIME")
    }
  }

  const onClickMinus = (e) => {
    e.preventDefault()
    if (state.matches("init")) {
      if (state.context.whiteTime <= 60) return
      send("MINUS_TIME")
    }
  }

  const onClickReset = (e) => {
    e.preventDefault()
    if (state.matches("started")) {
      send("RESET")
    }
  }

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
          <div onClick={onClickReset} className="reset whiteColor">
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
            <div onClick={onClickPlus} className="plus">
              <i className="fas fa-plus center"></i>
            </div>
            <div onClick={onClickMinus} className="minus">
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
