import coverImage from '../assets/images/coverImage.jpg'
import Header from './../components/Header'
function Cover() {
  return (
    <>
    <Header redirect={{path:"login"}}></Header>
    <img src={coverImage}></img>
    </>
  )
}

export default Cover
