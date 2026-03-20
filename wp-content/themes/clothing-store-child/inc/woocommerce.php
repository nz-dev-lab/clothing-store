<?php
/**
 * WooCommerce hooks & product page customisations.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Shipping estimator — shown on single product pages below the price.
 *
 * Reads the product weight (kg) and calculates estimated shipping to India.
 * Update RATE_PER_KG if you change the rate in the Weight Based Shipping plugin.
 */
add_action( 'woocommerce_single_product_summary', function () {
    global $product;

    // Only show on simple products with a weight set.
    $weight = floatval( $product->get_weight() );
    if ( $weight <= 0 ) {
        return;
    }

    // Must match the rate configured in WP Admin → WooCommerce → Shipping → India zone.
    $rate_per_kg     = 2.00;
    $estimated_cost  = $weight * $rate_per_kg;
    // html_entity_decode: WooCommerce returns symbols as HTML entities (e.g. &#36; for $).
    // We need the raw character for JS textContent and for esc_html output.
    $currency_symbol = html_entity_decode( get_woocommerce_currency_symbol(), ENT_QUOTES, 'UTF-8' );

    ?>
    <div class="cs-shipping-estimator">
        <span class="cs-shipping-estimator__icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
            </svg>
        </span>
        <div class="cs-shipping-estimator__body">
            <strong>
                Estimated shipping to India:
                <span id="cs-ship-cost"><?php echo esc_html( $currency_symbol . number_format( $estimated_cost, 2 ) ); ?></span>
            </strong>
            <span class="cs-shipping-estimator__detail" id="cs-ship-detail">
                <?php echo esc_html( $weight . 'kg × ' . $currency_symbol . number_format( $rate_per_kg, 2 ) . '/kg · Air freight · 5–10 business days' ); ?>
            </span>
        </div>
    </div>
    <script>
    (function () {
        var weight      = <?php echo (float) $weight; ?>;
        var rate        = <?php echo (float) $rate_per_kg; ?>;
        var symbol      = <?php echo wp_json_encode( $currency_symbol ); ?>;
        var costEl      = document.getElementById('cs-ship-cost');
        var detailEl    = document.getElementById('cs-ship-detail');

        function update(qty) {
            qty = Math.max(1, parseInt(qty) || 1);
            var totalWeight = (weight * qty).toFixed(2).replace(/\.?0+$/, '');
            var cost        = (weight * qty * rate).toFixed(2);
            costEl.textContent   = symbol + cost;
            detailEl.textContent = totalWeight + 'kg \u00d7 ' + symbol + rate.toFixed(2) + '/kg \u00b7 Air freight \u00b7 5\u201310 business days';
        }

        document.addEventListener('DOMContentLoaded', function () {
            var qty = document.querySelector('input.qty');
            if (!qty) return;
            qty.addEventListener('input',  function () { update(this.value); });
            qty.addEventListener('change', function () { update(this.value); });
        });
    })();
    </script>
    <?php
}, 21 ); // Priority 21 = just after the price (priority 20).
