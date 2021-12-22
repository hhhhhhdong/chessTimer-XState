import showTime from '../utils/showTime'

function White({ state, send }) {
  const onClickWhite = (e) => {
    e.preventDefault()
    console.log(state)
    if (state.matches('started.whiteTurn')) {
      send('WHITE_CLICK')
    }
  }

  return (
    <div
      onClick={onClickWhite}
      data-team="white"
      className={`timer white ${
        state.matches('started.whiteTurn') && 'whiteBorder'
      }`}
    >
      <span className="center">
        {state.matches('whiteEnd') ? 'LOSE' : showTime(state.context.whiteTime)}
      </span>
      <p>move {state.context.whiteMove}</p>
      <h6>WHITE</h6>
    </div>
  )
}

export default White
