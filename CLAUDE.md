# CLAUDE.md — Project Handoff for Claude Code

This file gives Claude Code full context about this project.
Read this entire file before doing anything.

---

## 1. What this project is

A WooCommerce-based e-commerce store for a clothing business.

**Business model:**
- Friend buys clothes from Dubai markets (fabric souks, Deira, Meena Bazaar area)
- Sells mainly to customers in India, shipping by air freight
- Customers can buy in any quantity — single items, small quantities, or bulk wholesale orders
- Key features needed: bulk/tiered pricing, product bundles, WhatsApp CTA for Indian customers

**Two people involved:**
- Niyaz (me) — Full-Stack Software Engineer, handles all dev work
- Friend — non-technical, will manage the store day-to-day via WP Admin (adding products, processing orders)

---

## 2. Technology decisions (already made — do not re-suggest alternatives)

| Decision | Choice | Reason |
|---|---|---|
| Platform | WordPress + WooCommerce | Free, zero transaction fees, full code control |
| Theme | Astra (free) + custom child theme | Fast, WooCommerce-optimised, free |
| Hosting (prod) | Cloudways (Vultr Basic, ~$14/mo) | Cheap, managed, good for WooCommerce |
| Local dev | Docker + WP-CLI | Developer-friendly, version-controllable |
| CI/CD | GitHub Actions | Already familiar |
| Payments | Razorpay (India) + Stripe fallback | India-facing store, UPI/cards/netbanking |
| Bulk pricing | Discount Rules for WooCommerce (Flycart, free) | Free tier sufficient for <50 orders/mo |
| Bundles | WPC Product Bundles (WPClever, free) | Free, handles fixed + mix & match |
| Min quantities | WooCommerce Min/Max Quantities (official, free) | Free official plugin |

**Do not suggest Shopify.** That decision was evaluated thoroughly and rejected due to:
- 2% transaction fees on third-party gateways (UAE → India flow)
- Shopify Payments not available for UAE merchants
- Free tier bulk pricing apps are limited

---

## 3. Developer background

- 3+ years full-stack: PHP/Laravel, React, TypeScript, NestJS, PostgreSQL, AWS
- Comfortable with Docker, GitHub, CI/CD with GitHub Actions
- **New to WordPress and WooCommerce** — knows PHP well but WP's hook system and template override pattern are new
- Currently focused on JS-based frontend and backend
- Preferred approach: use WooCommerce as a backend, build custom UI pieces in React mounted on WC pages via `wp_enqueue_script`, talking to WC REST API

---

## 4. Project structure

```
clothing-store/
├── docker-compose.yml                        # Local dev stack (WordPress + MySQL + phpMyAdmin + WP-CLI)
├── .env.example                              # Copy to .env — never commit .env
├── .gitignore
├── README.md
├── scripts/
│   └── setup.sh                             # One-time install: WP core + WooCommerce + all plugins via WP-CLI
├── wp-content/
│   ├── themes/
│   │   └── clothing-store-child/            # Custom child theme — VERSIONED IN GIT
│   │       ├── style.css                    # Theme declaration + CSS overrides
│   │       ├── functions.php                # Enqueue scripts, load inc/ files
│   │       └── inc/                         # Feature files (to be created as we build)
│   └── plugins/
│       └── clothing-store-custom/           # Custom plugin — VERSIONED IN GIT
│           ├── clothing-store-custom.php    # Plugin entry, autoloads includes/
│           └── includes/                    # Feature modules (to be created as we build)
└── .github/
    └── workflows/
        └── ci.yml                           # PHP lint + Docker integration smoke tests
```

**Critical versioning rule:**
- Only `wp-content/themes/clothing-store-child/` and `wp-content/plugins/clothing-store-custom/` are committed to git
- WordPress core, WooCommerce, and third-party plugins are installed via `scripts/setup.sh` using WP-CLI — never committed
- This mirrors Laravel's composer.json pattern

---

## 5. Docker setup

### Services
| Service | Container name | Host port | Purpose |
|---|---|---|---|
| MySQL 8.0 | clothing_db | — | Database |
| WordPress 6.5 PHP 8.2 | clothing_wp | 3010 (configurable) | WP site |
| phpMyAdmin | clothing_pma | 3011 (configurable) | DB GUI |
| WP-CLI | clothing_wpcli | — | One-off WP commands |

**Note:** Ports 3010/3011 were chosen to avoid conflicts with common JS dev tools (React on 3000, Vite on 5173, Laravel on 8000). User may change these in docker-compose.yml — the left side of `host:container` only.

### Live mounting
These local paths are mounted directly into the WordPress container:
- `./wp-content/themes/clothing-store-child` → `/var/www/html/wp-content/themes/clothing-store-child`
- `./wp-content/plugins/clothing-store-custom` → `/var/www/html/wp-content/plugins/clothing-store-custom`

Edit locally → refresh browser. No rebuild needed.

### Common WP-CLI commands
```bash
# General pattern
docker compose run --rm wpcli wp <command> --allow-root --path=/var/www/html

# Examples
docker compose run --rm wpcli wp plugin list --allow-root --path=/var/www/html
docker compose run --rm wpcli wp cache flush --allow-root --path=/var/www/html
docker compose run --rm wpcli wp option get siteurl --allow-root --path=/var/www/html
```

---

## 6. What has been completed so far

- [x] Platform decision (WooCommerce over Shopify) — with full cost analysis
- [x] Theme decision (Astra + child theme)
- [x] Plugin stack decided (Discount Rules, WPC Bundles, Min/Max Quantities)
- [x] Docker-based local dev environment (docker-compose.yml)
- [x] .env.example with all required variables
- [x] .gitignore (WP core excluded, only custom code versioned)
- [x] scripts/setup.sh (WP-CLI one-time installer)
- [x] Child theme scaffold (style.css + functions.php)
- [x] Custom plugin scaffold (clothing-store-custom.php with module autoloader)
- [x] GitHub Actions CI (PHP lint + PHPCS + Docker smoke tests)
- [x] README with full setup instructions

---

## 7. What needs to be built next (in priority order)

### Phase 1 — Core store setup
1. **WooCommerce initial configuration** via WP Admin
   - Store address: Dubai, UAE
   - Currency: USD (display INR equivalent optionally)
   - Shipping zones: UAE → India (weight-based, air freight rates)
   - Payment: Razorpay plugin install + configuration

2. **Product setup pattern**
   - Product categories (by clothing type: Kurtas, Sarees, Salwar Sets, etc.)
   - Attributes: Size (XS/S/M/L/XL/XXL), Color, Fabric
   - Product image guidelines (your friend needs to know what photos to take)

3. **Bulk pricing configuration** (Discount Rules for WooCommerce plugin)
   - Tiered quantity breaks per product
   - Example rule: 1–4 pcs = full price, 5–9 = 10% off, 10+ = 20% off
   - Price table display on product page

4. **Bundle setup** (WPC Product Bundles plugin)
   - Fixed bundles (e.g. 3-piece kurta set)
   - Mix & match bundles (pick any 5 T-shirts, get 15% off)

### Phase 2 — Custom development
5. **Custom bulk order table** (React component)
   - Grid showing all products with size variants as columns
   - Quantity inputs per size per product
   - Running total with applied discounts
   - Single "Add all to cart" button
   - Mounted on a custom WooCommerce page via `wp_enqueue_script`
   - Talks to WC REST API

6. **WhatsApp CTA button** on product pages
   - "Order via WhatsApp" button on every product page
   - Pre-fills message with product name, size, quantity
   - Custom WooCommerce hook in child theme `inc/whatsapp.php`

7. **Shipping estimator** on product pages
   - Show estimated delivery time to India
   - Based on weight (from product data) × air freight rate

### Phase 3 — Production deployment
8. **Cloudways server setup**
   - Vultr Basic ($14/mo)
   - WordPress application deployment
   - SSL via Let's Encrypt

9. **GitHub Actions deploy workflow**
   - On push to `main`: rsync custom theme + plugin to Cloudways via SSH
   - WP-CLI commands via SSH for cache flush post-deploy
   - Secrets: `CLOUDWAYS_SSH_HOST`, `CLOUDWAYS_SSH_USER`, `CLOUDWAYS_SSH_KEY`

10. **India-specific optimisations**
    - Razorpay integration (UPI, cards, netbanking, wallets)
    - INR currency display (show prices in both USD and INR)
    - WhatsApp Business integration

---

## 8. Key WordPress/WooCommerce patterns to know

Since Niyaz is new to WordPress, here are the critical patterns that differ from Laravel:

### Hook system (replaces controllers/middleware)
```php
// Instead of a route + controller, you hook into WP events:
add_action('woocommerce_before_checkout_form', function() {
    // Runs before the checkout form renders
});

add_filter('woocommerce_product_get_price', function($price, $product) {
    // Modifies price before display — return modified value
    return $price;
}, 10, 2);
```

### Template overrides (child theme pattern)
WooCommerce templates can be overridden by copying from:
`wp-content/plugins/woocommerce/templates/`
to:
`wp-content/themes/clothing-store-child/woocommerce/`

The file path after `templates/` must match exactly.

### WC REST API (Niyaz's comfort zone)
```
Base URL: http://localhost:3010/wp-json/wc/v3/
Auth: Consumer key + secret (generate in WP Admin → WooCommerce → Settings → Advanced → REST API)

Endpoints:
GET  /products          — list products
GET  /products/{id}     — single product with variants
POST /cart/add-item     — add to cart (WC Store API v1)
GET  /orders            — list orders
```

### enqueueing React components
```php
// In child theme functions.php or custom plugin:
add_action('wp_enqueue_scripts', function() {
    if (is_page('bulk-order')) {  // only on the bulk order page
        wp_enqueue_script(
            'bulk-order-app',
            get_stylesheet_directory_uri() . '/assets/js/bulk-order.js',
            [],
            '1.0.0',
            true  // load in footer
        );
        // Pass WC REST API URL and nonce to JS
        wp_localize_script('bulk-order-app', 'wcConfig', [
            'apiUrl'  => rest_url('wc/v3/'),
            'nonce'   => wp_create_nonce('wc_store_api'),
        ]);
    }
});
```

---

## 9. Coding conventions

- PHP: WordPress coding standards (PHPCS with WordPress ruleset — already in CI)
- All custom PHP goes in either the child theme (`wp-content/themes/clothing-store-child/`) or the custom plugin (`wp-content/plugins/clothing-store-custom/`)
- Never modify WooCommerce plugin files directly — always use hooks or template overrides
- Never modify the Astra parent theme — always use the child theme
- JS/React: standard React with hooks, no class components
- CSS: BEM naming in child theme stylesheets

---

## 10. Environment variables reference

```bash
# MySQL
MYSQL_ROOT_PASSWORD=       # MySQL root password
MYSQL_DATABASE=            # Database name (e.g. clothing_store_db)
MYSQL_USER=                # DB user (can be anything, e.g. your name)
MYSQL_PASSWORD=            # DB user password

# WordPress URLs — must match docker-compose port
WP_SITEURL=http://localhost:3010
WP_HOME=http://localhost:3010

# WP Admin credentials
WP_ADMIN_USER=             # Your WP login username
WP_ADMIN_PASSWORD=         # Your WP login password
WP_ADMIN_EMAIL=            # Your email

# WooCommerce REST API (generate after first setup)
WC_CONSUMER_KEY=
WC_CONSUMER_SECRET=
```

---

## 11. What NOT to do

- Do not suggest or use Shopify
- Do not commit WordPress core, WooCommerce, or third-party plugins to git
- Do not modify files inside `wp-content/plugins/woocommerce/` directly
- Do not modify files inside `wp-content/themes/astra/` directly
- Do not hardcode credentials anywhere — always use `.env`
- Do not install paid plugins — budget is strictly free plugins only
- Do not over-engineer — this is a small store starting at under 50 orders/month
