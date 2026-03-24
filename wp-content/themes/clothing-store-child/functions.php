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
    // Google Fonts — Cormorant Garamond (headings) + DM Sans (body)
    wp_enqueue_style(
        'cs-google-fonts',
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;600&display=swap',
        [],
        null
    );

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

    // Compiled Tailwind + component styles
    $css_file = get_stylesheet_directory() . '/assets/css/main.css';
    if ( file_exists( $css_file ) ) {
        wp_enqueue_style(
            'cs-main',
            get_stylesheet_directory_uri() . '/assets/css/main.css',
            [ 'clothing-store-child-style' ],
            filemtime( $css_file )
        );
    }
} );

// ─── 2. Load child theme feature files ───────────────────────────────────────
// As the project grows, split features into separate files and require them here.
// Example structure:
//   inc/woocommerce.php   — WooCommerce hooks & overrides
//   inc/bulk-order.php    — Custom bulk order table logic
//   inc/ajax.php          — AJAX handlers

$includes = [
    'inc/woocommerce.php',
    'inc/bulk-order.php',
    'inc/hero.php',
    'inc/footer.php',
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

// ─── 4. Allow SVG uploads ─────────────────────────────────────────────────────

add_filter( 'upload_mimes', function ( $mimes ) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
} );

add_filter( 'wp_check_filetype_and_ext', function ( $data, $file, $filename, $mimes ) {
    if ( ! $data['type'] && 'svg' === pathinfo( $filename, PATHINFO_EXTENSION ) ) {
        $data['type'] = 'image/svg+xml';
        $data['ext']  = 'svg';
    }
    return $data;
}, 10, 4 );
