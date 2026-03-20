#!/bin/bash
# scripts/setup.sh
# Run this ONCE after your first `docker compose up -d`
# It installs WooCommerce + all required plugins via WP-CLI
#
# Usage: bash scripts/setup.sh

set -e

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "ERROR: .env file not found. Copy .env.example to .env first."
  exit 1
fi

WP="docker compose run --rm wpcli wp --allow-root --path=/var/www/html"

echo ""
echo "==> Waiting for WordPress to be ready..."
sleep 5

echo ""
echo "==> Installing WordPress core..."
$WP core install \
  --url="${WP_SITEURL}" \
  --title="Clothing Store" \
  --admin_user="${WP_ADMIN_USER}" \
  --admin_password="${WP_ADMIN_PASSWORD}" \
  --admin_email="${WP_ADMIN_EMAIL}" \
  --skip-email

echo ""
echo "==> Installing WooCommerce..."
$WP plugin install woocommerce --activate

echo ""
echo "==> Installing Astra theme..."
$WP theme install astra --activate

echo ""
echo "==> Installing bulk pricing plugin..."
$WP plugin install woo-discount-rules --activate

echo ""
echo "==> Installing bundles plugin..."
$WP plugin install wpc-product-bundles --activate

echo ""
echo "==> Installing min/max quantities plugin..."
$WP plugin install woocommerce-min-max-quantities --activate

echo ""
echo "==> Installing WooCommerce REST API helper..."
$WP plugin install wp-rest-api-controller --activate

echo ""
echo "==> Activating your custom child theme..."
$WP theme activate clothing-store-child

echo ""
echo "==> Activating your custom plugin..."
$WP plugin activate clothing-store-custom

echo ""
echo "==> Setting up WooCommerce basic options..."
$WP option update woocommerce_store_address "Dubai, UAE"
$WP option update woocommerce_default_country "AE"
$WP option update woocommerce_currency "USD"
$WP option update woocommerce_currency_pos "left"
$WP option update woocommerce_enable_guest_checkout "yes"
$WP option update woocommerce_enable_checkout_login_reminder "yes"
$WP option update woocommerce_enable_signup_and_login_from_checkout "yes"

echo ""
echo "==> Setting permalink structure..."
$WP rewrite structure '/%postname%/'
$WP rewrite flush

echo ""
echo "==> Generating WooCommerce REST API keys..."
$WP wc tool run install_pages --user="${WP_ADMIN_USER}"

echo ""
echo "============================================"
echo " Setup complete!"
echo " WP Admin: ${WP_SITEURL}/wp-admin"
echo " Username: ${WP_ADMIN_USER}"
echo " Password: ${WP_ADMIN_PASSWORD}"
echo " phpMyAdmin: http://localhost:8081"
echo "============================================"
