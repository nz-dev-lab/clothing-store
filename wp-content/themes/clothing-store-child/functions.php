<?php
/**
 * Clothing Store Child Theme — functions.php
 *
 * This is the entry point for all child theme PHP customisations.
 * Keep it lean — use add_action/add_filter hooks, don't write logic here directly.
 */

defined( 'ABSPATH' ) || exit;

// ─── 1. Enqueue parent + child styles ────────────────────────────────────────

add_action( 'wp_enqueue_scripts', function () {
    // Parent theme (Astra) stylesheet
    wp_enqueue_style(
        'astra-parent-style',
        get_template_directory_uri() . '/style.css'
    );

    // Child theme overrides
    wp_enqueue_style(
        'clothing-store-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        [ 'astra-parent-style' ],
        wp_get_theme()->get( 'Version' )
    );
} );

// ─── 2. Load child theme feature files ───────────────────────────────────────
// As the project grows, split features into separate files and require them here.
// Example structure:
//   inc/woocommerce.php   — WooCommerce hooks & overrides
//   inc/bulk-order.php    — Custom bulk order table logic
//   inc/ajax.php          — AJAX handlers

$includes = [
    // 'inc/woocommerce.php',
    // 'inc/bulk-order.php',
];

foreach ( $includes as $file ) {
    $path = get_stylesheet_directory() . '/' . $file;
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}

// ─── 3. Theme setup ──────────────────────────────────────────────────────────

add_action( 'after_setup_theme', function () {
    // WooCommerce high-resolution product images
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );
} );
