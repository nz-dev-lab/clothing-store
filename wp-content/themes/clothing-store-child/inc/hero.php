<?php
/**
 * Homepage Hero Section
 *
 * Outputs a full-width hero banner on the front page only.
 * Hook: woocommerce_before_main_content (priority 5, before products)
 * or directly via front-page.php template.
 */

defined( 'ABSPATH' ) || exit;

add_action( 'wp_footer', function () {
    // Only on the shop page acting as homepage, or actual front page
    if ( ! ( is_front_page() || is_shop() ) ) {
        return;
    }
    // Only output once
    static $done = false;
    if ( $done ) return;
    $done = true;
} );

/**
 * Render the hero via shortcode: [hira_hero]
 */
add_shortcode( 'hira_hero', function () {
    ob_start();
    ?>
    <section class="cs-hero">
        <p class="cs-hero__eyebrow">Dubai · UAE &nbsp;|&nbsp; Finest Indian Wear</p>
        <h1 class="cs-hero__title">Elegance Sourced<br>from Dubai Markets</h1>
        <p class="cs-hero__sub">
            Premium Indian ladies nightwear and ethnic wear — handpicked from Deira and Meena Bazaar,
            shipped directly to your doorstep across India.
        </p>
        <div class="cs-hero__actions">
            <a href="/shop" class="cs-hero__btn-primary">Shop Collection</a>
            <a href="/bulk-order" class="cs-hero__btn-secondary">Bulk Order</a>
        </div>
    </section>
    <?php
    return ob_get_clean();
} );
