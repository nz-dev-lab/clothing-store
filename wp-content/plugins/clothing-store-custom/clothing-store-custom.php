<?php
/**
 * Plugin Name:       Clothing Store Custom
 * Plugin URI:        https://github.com/your-repo/clothing-store
 * Description:       All store-specific customisations: bulk order form, shipping rules, REST API extensions.
 * Version:           1.0.0
 * Author:            Your Name
 * Text Domain:       clothing-store-custom
 * Requires PHP:      8.1
 * Requires at least: 6.4
 */

defined( 'ABSPATH' ) || exit;

define( 'CSC_VERSION', '1.0.0' );
define( 'CSC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'CSC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// ─── Autoload feature modules ─────────────────────────────────────────────────
// Add files here as you build each feature. Nothing loads until you uncomment it.

$modules = [
    // 'includes/class-bulk-order.php',      // Custom bulk order table (coming in a later step)
    // 'includes/class-shipping-rules.php',  // India-specific shipping logic
    // 'includes/class-rest-api.php',        // Custom WC REST API endpoints
    // 'includes/class-whatsapp.php',        // WhatsApp order CTA
];

foreach ( $modules as $module ) {
    $path = CSC_PLUGIN_DIR . $module;
    if ( file_exists( $path ) ) {
        require_once $path;
    }
}

// ─── Admin notice if WooCommerce is not active ────────────────────────────────

add_action( 'admin_notices', function () {
    if ( ! class_exists( 'WooCommerce' ) ) {
        echo '<div class="notice notice-error"><p>';
        echo '<strong>Clothing Store Custom</strong> requires WooCommerce to be installed and active.';
        echo '</p></div>';
    }
} );
