import { useState, useEffect } from 'react'
import type { StoreProduct } from './types'

// Mirrors the tiers set in Discount Rules for WooCommerce plugin.
// Update here if you change them in WP Admin.
const DISCOUNT_TIERS = [
  { min: 20, discount: 0.25 },
  { min: 10, discount: 0.20 },
  { min: 5,  discount: 0.10 },
  { min: 1,  discount: 0 },
]

function getDiscountRate(totalQty: number): number {
  return DISCOUNT_TIERS.find(t => totalQty >= t.min)?.discount ?? 0
}

function formatPrice(minorUnits: string, decimalPlaces: number): string {
  return (parseInt(minorUnits) / Math.pow(10, decimalPlaces)).toFixed(2)
}

interface Props {
  storeApiUrl: string
  nonce: string
}

export default function BulkOrderApp({ storeApiUrl, nonce }: Props) {
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${storeApiUrl}products?per_page=100&status=publish`)
      .then(r => r.json())
      .then((data: StoreProduct[]) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load products. Please refresh the page.')
        setLoading(false)
      })
  }, [storeApiUrl])

  const setQty = (productId: number, value: number) => {
    setQuantities(prev => ({ ...prev, [productId]: Math.max(0, value) }))
  }

  const totalQty = Object.values(quantities).reduce((sum, q) => sum + q, 0)

  const subtotal = products.reduce((sum, p) => {
    const qty = quantities[p.id] ?? 0
    const price = parseInt(p.prices.price) / Math.pow(10, p.prices.currency_minor_unit)
    return sum + qty * price
  }, 0)

  const discountRate = getDiscountRate(totalQty)
  const discountAmount = subtotal * discountRate
  const total = subtotal - discountAmount

  const addAllToCart = async () => {
    const items = Object.entries(quantities).filter(([, qty]) => qty > 0)
    if (items.length === 0) return

    setAdding(true)
    setError('')

    try {
      for (const [productId, quantity] of items) {
        const res = await fetch(`${storeApiUrl}cart/add-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Nonce': nonce },
          body: JSON.stringify({ id: parseInt(productId), quantity }),
        })
        if (!res.ok) throw new Error('Failed to add item to cart')
      }
      window.location.href = '/cart'
    } catch {
      setError('Something went wrong adding items to cart. Please try again.')
      setAdding(false)
    }
  }

  if (loading) return <p style={styles.message}>Loading products…</p>
  if (products.length === 0 && !error) return <p style={styles.message}>No products found.</p>

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Bulk Order</h2>
      <p style={styles.subheading}>Add multiple items to your cart at once. Discounts apply automatically by quantity.</p>

      {error && <p style={styles.error}>{error}</p>}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}></th>
            <th style={{ ...styles.th, textAlign: 'left' }}>Product</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Qty</th>
            <th style={styles.th}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const qty = quantities[product.id] ?? 0
            const unitPrice = parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit)
            const rowTotal = qty * unitPrice

            return (
              <tr key={product.id} style={styles.row}>
                <td style={styles.td}>
                  {product.images[0] && (
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      style={styles.image}
                    />
                  )}
                </td>
                <td style={{ ...styles.td, textAlign: 'left' }}>
                  <a href={product.permalink} style={styles.productLink} target="_blank" rel="noreferrer">
                    {product.name}
                  </a>
                </td>
                <td style={styles.td}>${formatPrice(product.prices.price, product.prices.currency_minor_unit)}</td>
                <td style={styles.td}>
                  <input
                    type="number"
                    min={0}
                    value={qty || ''}
                    placeholder="0"
                    onChange={e => setQty(product.id, parseInt(e.target.value) || 0)}
                    style={styles.qtyInput}
                  />
                </td>
                <td style={styles.td}>{qty > 0 ? `$${rowTotal.toFixed(2)}` : '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountRate > 0 && (
          <div style={{ ...styles.summaryRow, color: '#2e7d32' }}>
            <span>Bulk discount ({(discountRate * 100).toFixed(0)}% off)</span>
            <span>−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
          <span>Estimated total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {totalQty > 0 && totalQty < 5 && (
          <p style={styles.discountHint}>Add {5 - totalQty} more {5 - totalQty === 1 ? 'item' : 'items'} to unlock 10% bulk discount</p>
        )}
        <button
          onClick={addAllToCart}
          disabled={totalQty === 0 || adding}
          style={{
            ...styles.button,
            opacity: totalQty === 0 || adding ? 0.5 : 1,
            cursor: totalQty === 0 || adding ? 'not-allowed' : 'pointer',
          }}
        >
          {adding ? 'Adding to cart…' : `Add ${totalQty} ${totalQty === 1 ? 'item' : 'items'} to cart`}
        </button>
      </div>

      <p style={styles.sizeNote}>
        📝 <strong>Please note your size preference</strong> in the Order Notes at checkout.
        Size options: Free Size, S, M, L, XL, XXL
      </p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper:      { fontFamily: 'inherit', maxWidth: '900px', margin: '0 auto', padding: '0 16px' },
  heading:      { fontSize: '24px', fontWeight: '600', marginBottom: '6px' },
  subheading:   { color: '#555', marginBottom: '24px', fontSize: '14px' },
  message:      { padding: '24px', textAlign: 'center', color: '#555' },
  error:        { background: '#fef2f2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px', marginBottom: '16px' },
  table:        { width: '100%', borderCollapse: 'collapse', marginBottom: '24px' },
  th:           { padding: '12px 8px', borderBottom: '2px solid #e5e7eb', fontWeight: '600', fontSize: '13px', textAlign: 'center', color: '#374151' },
  td:           { padding: '12px 8px', borderBottom: '1px solid #f3f4f6', textAlign: 'center', verticalAlign: 'middle' },
  row:          { transition: 'background 0.15s' },
  image:        { width: '56px', height: '56px', objectFit: 'cover', borderRadius: '6px', display: 'block' },
  productLink:  { color: '#111', fontWeight: '500', textDecoration: 'none' },
  qtyInput:     { width: '64px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '6px', textAlign: 'center', fontSize: '15px' },
  summary:      { maxWidth: '340px', marginLeft: 'auto', borderTop: '2px solid #e5e7eb', paddingTop: '16px' },
  summaryRow:   { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' },
  totalRow:     { fontWeight: '700', fontSize: '16px', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #e5e7eb' },
  discountHint: { fontSize: '13px', color: '#d97706', marginBottom: '12px' },
  button:       { width: '100%', padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', marginTop: '12px' },
  sizeNote:     { marginTop: '24px', padding: '12px 16px', background: '#f9fafb', borderRadius: '8px', fontSize: '13px', color: '#555' },
}
