const showTime = (time) => {
  let min = Math.floor(Math.abs(time) / 60)
  let sec = Math.abs(time) % 60
  if (sec < 10) {
    sec = '0' + sec
  }
  if (min < 10) {
    min = '0' + min
  }

  return `${min} : ${sec}`
}
export default showTime
