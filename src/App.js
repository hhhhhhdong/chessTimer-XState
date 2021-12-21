import "./App.css"
import { createMachine, assign } from "xstate"
import { useMachine } from "@xstate/react"
import { useEffect } from "react"

const chessMachine = createMachine(
  {
    id: "chessTimer",
    context: {
      whiteTime: 600,
      blackTime: 600,
      whiteMove: 0,
      blackMove: 0,
    },
    initial: "init",
    states: {
      init: {
        on: {
          PLAY: "started",
          PLUS_TIME: {
            actions: "plusTime",
          },
          MINUS_TIME: {
            actions: "minusTime",
          },
        },
      },
      started: {
        on: {
          TOGGLE_PAUSE: "pause",
          RESET: {
            target: "init",
            actions: "reset",
          },
        },
        initial: "whiteTurn",
        states: {
          whiteTurn: {
            initial: "whitePlay",
            states: {
              whitePlay: {
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
                  DECREASE_WHITE_TIME: [
                    {
                      actions: "decreaseWhiteTime",
                      cond: "isWhiteHaveTime",
                    },
                    {
                      target: "#chessTimer.whiteEnd",
                    },
                  ],
                },
              },
            },
            on: {
              WHITE_CLICK: {
                target: "blackTurn",
                actions: "whiteClick",
              },
            },
          },
          blackTurn: {
            initial: "blackPlay",
            states: {
              blackPlay: {
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
                  DECREASE_BLACK_TIME: [
                    {
                      actions: "decreaseBlackTime",
                      cond: "isBlackHaveTime",
                    },
                    {
                      target: "#chessTimer.blackEnd",
                    },
                  ],
                },
              },
            },

            on: {
              BLACK_CLICK: { target: "whiteTurn", actions: "blackClick" },
            },
          },
          hist: {
            type: "history",
          },
        },
      },
      whiteEnd: {
        on: {
          RESET: {
            target: "init",
            actions: "reset",
          },
        },
      },
      blackEnd: {
        on: {
          RESET: {
            target: "init",
            actions: "reset",
          },
        },
      },
      pause: {
        on: {
          TOGGLE_PAUSE: "started.hist",
          RESET: {
            target: "init",
            actions: "reset",
          },
        },
      },
    },
  },
  {
    actions: {
      decreaseWhiteTime: (ctx) => {
        ctx.whiteTime -= 1
      },
      decreaseBlackTime: (ctx) => {
        ctx.blackTime -= 1
      },
      whiteClick: assign((ctx) => {
        ctx.whiteMove += 1
      }),
      blackClick: assign((ctx) => {
        ctx.blackMove += 1
      }),
      plusTime: assign((ctx, event) => {
        ctx.whiteTime += 60
        ctx.blackTime += 60
      }),
      minusTime: assign((ctx, event) => {
        ctx.whiteTime -= 60
        ctx.blackTime -= 60
      }),
      reset: assign((ctx) => {
        ctx.whiteMove = 0
        ctx.blackMove = 0
        ctx.whiteTime = 600
        ctx.blackTime = 600
      }),
    },
    guards: {
      isWhiteHaveTime: (ctx) => ctx.whiteTime > 0,
      isBlackHaveTime: (ctx) => ctx.blackTime > 0,
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
  useEffect(() => {
    // 디버깅용
    console.log(state.context.blackMove)
    console.log(state.matches("started"))
    console.log(state.matches("started.whiteTurn"))
  }, [state])

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
    if (
      state.matches("started") ||
      state.matches("pause") ||
      state.matches("whiteEnd") ||
      state.matches("blackEnd")
    ) {
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
        <div
          onClick={onClickWhite}
          data-team="white"
          className={`timer white ${
            state.matches("started.whiteTurn") && "whiteBorder"
          }`}
        >
          <span className="center">
            {state.matches("whiteEnd")
              ? "LOSE"
              : showTime(state.context.whiteTime)}
          </span>
          <p>move {state.context.whiteMove}</p>
          <h6>WHITE</h6>
        </div>
        <div id="setting">
          <div
            onClick={onClickReset}
            className={`reset ${
              state.matches("init") ? "grayColor" : "whiteColor"
            }`}
          >
            <i className="fas fa-redo center"></i>
          </div>
          <div
            onClick={onClickPlay}
            className={`pause ${
              state.matches("whiteEnd") || state.matches("blackEnd")
                ? "grayColor"
                : "whiteColor"
            }`}
          >
            {state.matches("started") ? (
              <i className="fas fa-pause center"></i>
            ) : (
              <i className="fas fa-play center"></i>
            )}
          </div>
          <div
            className={`time ${
              state.matches("init") ? "whiteColor" : "grayColor"
            }`}
          >
            <div onClick={onClickPlus} className="plus">
              <i className="fas fa-plus center"></i>
            </div>
            <div onClick={onClickMinus} className="minus">
              <i className="fas fa-minus center"></i>
            </div>
          </div>
        </div>
        <div
          onClick={onClickBlack}
          data-team="black"
          className={`timer black ${
            state.matches("started.blackTurn") && "whiteBorder"
          }`}
        >
          <span className="center">
            {state.matches("blackEnd")
              ? "LOSE"
              : showTime(state.context.blackTime)}
          </span>
          <p>move {state.context.blackMove}</p>
          <h6>BLACK</h6>
        </div>
      </div>
    </div>
  )
}

export default App
