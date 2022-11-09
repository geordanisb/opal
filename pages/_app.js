import '../styles/globals.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Layout from '../src/components/layout'

function MyApp({ Component, pageProps }) {
  return <LocalizationProvider dateAdapter={AdapterMoment}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </LocalizationProvider>
}

export default MyApp
