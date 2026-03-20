<?php
/**
 * Bulk Order Table
 *
 * Registers the [bulk_order] shortcode and enqueues the React app
 * only on the /bulk-order page.
 */

defined( 'ABSPATH' ) || exit;

// Shortcode — place [bulk_order] in any page to mount the React app.
add_shortcode( 'bulk_order', function () {
    return '<div id="bulk-order-app"></div>';
} );

// Enqueue the built React bundle only on the bulk-order page.
add_action( 'wp_enqueue_scripts', function () {
    if ( ! is_page( 'bulk-order' ) ) {
        return;
    }

    $js_file = get_stylesheet_directory() . '/assets/js/bulk-order.js';

    if ( ! file_exists( $js_file ) ) {
        return;
    }

    wp_enqueue_script(
        'bulk-order-app',
        get_stylesheet_directory_uri() . '/assets/js/bulk-order.js',
        [],
        filemtime( $js_file ),
        true
    );

    wp_localize_script( 'bulk-order-app', 'wcConfig', [
        'storeApiUrl' => rest_url( 'wc/store/v1/' ),
        'nonce'       => wp_create_nonce( 'wc_store_api' ),
    ] );
} );
