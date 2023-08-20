import '@/styles/globals.css'
import { ColorProvider } from '@/app/utils/colourContext'
export default function App({ Component, pageProps }) {
  return(
    <ColorProvider>
      <Component {...pageProps} />
    </ColorProvider>
  ) 
}
