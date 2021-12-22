function Setting({ state, send }) {
  const onClickPlay = (e) => {
    // play, pause 버튼 클릭시
    // 게임이 시작하지 않았으면 (state가 init인 상태) 게임시작 (white 부터)
    // 게임 진행중이라면 일시정지
    // history기능을 사용해서 이전 상태 기억함
    e.preventDefault()
    if (state.matches('init')) {
      send('PLAY')
    } else {
      send('TOGGLE_PAUSE')
      console.log(state)
    }
  }

  const onClickPlus = (e) => {
    e.preventDefault()
    if (state.matches('init')) {
      send('PLUS_TIME')
    }
  }

  const onClickMinus = (e) => {
    e.preventDefault()
    if (state.matches('init')) {
      if (state.context.whiteTime <= 60) return
      send('MINUS_TIME')
    }
  }

  const onClickReset = (e) => {
    e.preventDefault()
    if (
      state.matches('started') ||
      state.matches('pause') ||
      state.matches('whiteEnd') ||
      state.matches('blackEnd')
    ) {
      send('RESET')
    }
  }

  return (
    <div id="setting">
      <div
        onClick={onClickReset}
        className={`reset ${
          state.matches('init') ? 'grayColor' : 'whiteColor'
        }`}
      >
        <i className="fas fa-redo center"></i>
      </div>
      <div
        onClick={onClickPlay}
        className={`pause ${
          state.matches('whiteEnd') || state.matches('blackEnd')
            ? 'grayColor'
            : 'whiteColor'
        }`}
      >
        {state.matches('started') ? (
          <i className="fas fa-pause center"></i>
        ) : (
          <i className="fas fa-play center"></i>
        )}
      </div>
      <div
        className={`time ${state.matches('init') ? 'whiteColor' : 'grayColor'}`}
      >
        <div onClick={onClickPlus} className="plus">
          <i className="fas fa-plus center"></i>
        </div>
        <div onClick={onClickMinus} className="minus">
          <i className="fas fa-minus center"></i>
        </div>
      </div>
    </div>
  )
}

export default Setting
