import { createRoot } from 'react-dom/client'
import BulkOrderApp from './BulkOrderApp'

declare global {
  interface Window {
    wcConfig: {
      storeApiUrl: string
      nonce: string
    }
  }
}

const container = document.getElementById('bulk-order-app')
if (container && window.wcConfig) {
  createRoot(container).render(
    <BulkOrderApp
      storeApiUrl={window.wcConfig.storeApiUrl}
      nonce={window.wcConfig.nonce}
    />
  )
}
