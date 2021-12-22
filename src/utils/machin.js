import { createMachine, assign } from 'xstate'

export default createMachine(
  {
    id: 'chessTimer',
    context: {
      whiteTime: 600,
      blackTime: 600,
      whiteMove: 0,
      blackMove: 0,
    },
    initial: 'init',
    states: {
      init: {
        on: {
          PLAY: 'started',
          PLUS_TIME: {
            actions: 'plusTime',
          },
          MINUS_TIME: {
            actions: 'minusTime',
          },
        },
      },
      started: {
        on: {
          TOGGLE_PAUSE: 'pause',
          RESET: {
            target: 'init',
            actions: 'reset',
          },
        },
        initial: 'whiteTurn',
        states: {
          whiteTurn: {
            initial: 'whitePlay',
            states: {
              whitePlay: {
                invoke: {
                  src: (ctx) => (callback) => {
                    const interval = setInterval(() => {
                      callback('DECREASE_WHITE_TIME')
                    }, 1000)
                    return () => {
                      clearInterval(interval)
                    }
                  },
                },
                on: {
                  DECREASE_WHITE_TIME: [
                    {
                      actions: 'decreaseWhiteTime',
                      cond: 'isWhiteHaveTime',
                    },
                    {
                      target: '#chessTimer.whiteEnd',
                    },
                  ],
                },
              },
            },
            on: {
              WHITE_CLICK: {
                target: 'blackTurn',
                actions: 'whiteClick',
              },
            },
          },
          blackTurn: {
            initial: 'blackPlay',
            states: {
              blackPlay: {
                invoke: {
                  src: (ctx) => (callback) => {
                    const interval = setInterval(() => {
                      callback('DECREASE_BLACK_TIME')
                    }, 1000)
                    return () => {
                      clearInterval(interval)
                    }
                  },
                },
                on: {
                  DECREASE_BLACK_TIME: [
                    {
                      actions: 'decreaseBlackTime',
                      cond: 'isBlackHaveTime',
                    },
                    {
                      target: '#chessTimer.blackEnd',
                    },
                  ],
                },
              },
            },

            on: {
              BLACK_CLICK: { target: 'whiteTurn', actions: 'blackClick' },
            },
          },
          hist: {
            type: 'history',
          },
        },
      },
      whiteEnd: {
        on: {
          RESET: {
            target: 'init',
            actions: 'reset',
          },
        },
      },
      blackEnd: {
        on: {
          RESET: {
            target: 'init',
            actions: 'reset',
          },
        },
      },
      pause: {
        on: {
          TOGGLE_PAUSE: 'started.hist',
          RESET: {
            target: 'init',
            actions: 'reset',
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
      isStarted: (ctx) => ctx.gameState !== 'init',
      isPaused: (ctx) =>
        ctx.gameState !== 'whitePause' || ctx.gameState !== 'blackPause',
    },
  }
)
