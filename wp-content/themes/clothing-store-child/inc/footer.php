<?php
/**
 * Custom Footer
 *
 * Replaces Astra's default footer with a branded dark footer.
 */

defined( 'ABSPATH' ) || exit;

// Remove Astra's default footer
add_action( 'init', function () {
    remove_action( 'astra_footer', 'astra_footer_markup' );
} );

// Add our custom footer
add_action( 'astra_footer', function () {
    $whatsapp_number = '971500000000'; // TODO: replace with real WhatsApp Business number
    $whatsapp_url    = 'https://wa.me/' . $whatsapp_number;
    $year            = date( 'Y' );
    ?>
    <footer class="cs-footer">
        <div class="cs-footer__grid">

            <div>
                <p class="cs-footer__brand-name">Hira Fashions</p>
                <p class="cs-footer__tagline">Finest Indian Wear</p>
                <p style="margin-top:0.75rem; font-size:0.8rem; color:#6B6560; line-height:1.6;">
                    Sourced from Dubai markets.<br>
                    Shipped to India by air freight.
                </p>
            </div>

            <div>
                <p class="cs-footer__heading">Quick Links</p>
                <a href="/shop" class="cs-footer__link">Shop</a>
                <a href="/bulk-order" class="cs-footer__link">Bulk Order</a>
                <a href="/cart" class="cs-footer__link">Cart</a>
                <a href="/my-account" class="cs-footer__link">My Account</a>
            </div>

            <div>
                <p class="cs-footer__heading">Contact</p>
                <a href="<?php echo esc_url( $whatsapp_url ); ?>" class="cs-footer__whatsapp" target="_blank" rel="noopener">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.525 5.845L.057 23.571a.75.75 0 0 0 .916.921l5.84-1.52A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 0 1-4.95-1.355l-.355-.211-3.676.957.984-3.59-.231-.369A9.718 9.718 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                    </svg>
                    WhatsApp Us
                </a>
                <p style="margin-top:0.6rem; font-size:0.8rem; color:#6B6560; line-height:1.6;">
                    Delivery: 5–7 days to India<br>
                    Air freight from Dubai
                </p>
            </div>

        </div>

        <div class="cs-footer__bottom">
            <span>&copy; <?php echo esc_html( $year ); ?> Hira Fashions. All rights reserved.</span>
            <span>Dubai, UAE</span>
        </div>
    </footer>
    <?php
} );
