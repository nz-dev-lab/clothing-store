import { useState, useEffect } from 'react'
import type { StoreProduct } from './types'

const DISCOUNT_TIERS = [
  { min: 20, discount: 0.25 },
  { min: 10, discount: 0.20 },
  { min: 5,  discount: 0.10 },
  { min: 1,  discount: 0 },
]

function getDiscountRate(totalQty: number): number {
  return DISCOUNT_TIERS.find(t => totalQty >= t.min)?.discount ?? 0
}

interface Props {
  storeApiUrl: string
  nonce: string
}

export default function BulkOrderApp({ storeApiUrl, nonce }: Props) {
  const [products, setProducts]   = useState<StoreProduct[]>([])
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [loading, setLoading]     = useState(true)
  const [adding, setAdding]       = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    fetch(`${storeApiUrl}products?per_page=100&status=publish`)
      .then(r => r.json())
      .then((data: StoreProduct[]) => { setProducts(data); setLoading(false) })
      .catch(() => { setError('Could not load products. Please refresh.'); setLoading(false) })
  }, [storeApiUrl])

  const setQty = (id: number, value: number) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, value) }))

  const totalQty = Object.values(quantities).reduce((s, q) => s + q, 0)

  const subtotal = products.reduce((sum, p) => {
    const qty   = quantities[p.id] ?? 0
    const price = parseInt(p.prices.price) / Math.pow(10, p.prices.currency_minor_unit)
    return sum + qty * price
  }, 0)

  const discountRate   = getDiscountRate(totalQty)
  const discountAmount = subtotal * discountRate
  const total          = subtotal - discountAmount

  const addAllToCart = async () => {
    const items = Object.entries(quantities).filter(([, qty]) => qty > 0)
    if (!items.length) return
    setAdding(true)
    setError('')
    try {
      for (const [productId, quantity] of items) {
        const res = await fetch(`${storeApiUrl}cart/add-item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Nonce': nonce },
          body: JSON.stringify({ id: parseInt(productId), quantity }),
        })
        if (!res.ok) throw new Error()
      }
      window.location.href = '/cart'
    } catch {
      setError('Something went wrong. Please try again.')
      setAdding(false)
    }
  }

  if (loading) return <p className="py-12 text-center text-cs-muted">Loading products…</p>
  if (!products.length && !error) return <p className="py-12 text-center text-cs-muted">No products found.</p>

  return (
    <div className="cs-bulk-order">
      <h2 className="cs-bulk-order__heading">Bulk Order</h2>
      <p className="cs-bulk-order__sub">
        Add multiple items to your cart at once. Discounts apply automatically by quantity.
      </p>

      {error && <p className="cs-bulk-order__error">{error}</p>}

      <table className="cs-bulk-order__table">
        <thead>
          <tr>
            <th className="cs-bulk-order__th"></th>
            <th className="cs-bulk-order__th text-left">Product</th>
            <th className="cs-bulk-order__th">Price</th>
            <th className="cs-bulk-order__th">Qty</th>
            <th className="cs-bulk-order__th">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const qty       = quantities[product.id] ?? 0
            const dec       = product.prices.currency_minor_unit
            const unitPrice = parseInt(product.prices.price) / Math.pow(10, dec)
            const symbol    = product.prices.currency_symbol ?? '$'

            return (
              <tr key={product.id}>
                <td className="cs-bulk-order__td">
                  {product.images[0] && (
                    <img
                      src={product.images[0].src}
                      alt={product.images[0].alt || product.name}
                      className="cs-bulk-order__img"
                    />
                  )}
                </td>
                <td className="cs-bulk-order__td text-left">
                  <a href={product.permalink} className="cs-bulk-order__link" target="_blank" rel="noreferrer">
                    {product.name}
                  </a>
                </td>
                <td className="cs-bulk-order__td">{symbol}{unitPrice.toFixed(2)}</td>
                <td className="cs-bulk-order__td">
                  <input
                    type="number"
                    min={0}
                    value={qty || ''}
                    placeholder="0"
                    onChange={e => setQty(product.id, parseInt(e.target.value) || 0)}
                    className="cs-bulk-order__qty"
                  />
                </td>
                <td className="cs-bulk-order__td">
                  {qty > 0 ? `${symbol}${(qty * unitPrice).toFixed(2)}` : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="cs-bulk-order__summary">
        <div className="cs-bulk-order__summary-row">
          <span>Subtotal ({totalQty} {totalQty === 1 ? 'item' : 'items'})</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountRate > 0 && (
          <div className="cs-bulk-order__summary-row cs-bulk-order__discount-line">
            <span>Bulk discount ({(discountRate * 100).toFixed(0)}% off)</span>
            <span>−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="cs-bulk-order__summary-row cs-bulk-order__summary-total">
          <span>Estimated total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        {totalQty > 0 && totalQty < 5 && (
          <p className="cs-bulk-order__discount-hint">
            Add {5 - totalQty} more {5 - totalQty === 1 ? 'item' : 'items'} to unlock 10% bulk discount
          </p>
        )}
        <button
          onClick={addAllToCart}
          disabled={totalQty === 0 || adding}
          className="cs-bulk-order__btn"
        >
          {adding ? 'Adding to cart…' : `Add ${totalQty} ${totalQty === 1 ? 'item' : 'items'} to cart`}
        </button>
      </div>

      <p className="cs-bulk-order__note">
        <strong>Please note your size preference</strong> in the Order Notes at checkout.
        Available sizes: Free Size, S, M, L, XL, XXL
      </p>
    </div>
  )
}
