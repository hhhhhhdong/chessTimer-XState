import showTime from '../utils/showTime'

function Black({ state, send }) {
  const onClickBlack = (e) => {
    e.preventDefault()
    if (state.matches('started.blackTurn')) {
      send('BLACK_CLICK')
    }
  }

  return (
    <div
      onClick={onClickBlack}
      data-team="black"
      className={`timer black ${
        state.matches('started.blackTurn') && 'whiteBorder'
      }`}
    >
      <span className="center">
        {state.matches('blackEnd') ? 'LOSE' : showTime(state.context.blackTime)}
      </span>
      <p>move {state.context.blackMove}</p>
      <h6>BLACK</h6>
    </div>
  )
}

export default Black
