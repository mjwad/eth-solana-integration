import { useState } from 'react'
import '../styles/style.scss'
import { ToastContainer } from 'react-toastify'
import Loading from '../components/Loading'
import Moralis from 'moralis'
import { APP_ID, SERVER_URL, SITE_ERROR } from '../../config'
import {  errorAlertCenter,errors } from '../components/toastGroup'

function MyApp({ Component, pageProps }) {
  const [pageLoading, setPageLoading] = useState(false)
  const [hAlert, setHAlert] = useState(true)

  try{
    // Moralis.start({ serverUrl: SERVER_URL, appId: APP_ID })
  }
  catch(e) {
    errorAlertCenter(SITE_ERROR[1]);
  }
  return (
    <>
      <Component {...pageProps}
        startLoading={() => setPageLoading(true)}
        closeLoading={() => setPageLoading(false)}
        headerAlert={hAlert}
        closeAlert={() => setHAlert(false)}
      />
      <ToastContainer style={{ fontSize: 14, padding: '5px !important', lineHeight: '15px' }} />
      <Loading loading={pageLoading} />
    </>
  )
}

export default MyApp
