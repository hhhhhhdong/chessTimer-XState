import "./App.css"

function App() {
  return (
    <div className="App">
      <div id="footer">
        made by <a href="https://www.instagram.com/hhhhhhdong/">@hhhhhhdong</a>
      </div>
      <div id="main">
        <div data-team="white" className="timer white">
          <span className="center"></span>
          <p></p>
        </div>
        <div id="setting">
          <div className="reset whiteColor">
            <i className="fas fa-redo center"></i>
          </div>
          <div className="pause grayColor">
            <i className="fas fa-pause center"></i>
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
        <div data-team="black" className="timer black">
          <span className="center"></span>
          <p></p>
        </div>
      </div>
    </div>
  )
}

export default App
