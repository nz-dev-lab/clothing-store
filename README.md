# Clothing Store — WooCommerce

Dubai-sourced clothing store selling to India. Built on WordPress + WooCommerce.

## Stack

| Layer | Tech |
|---|---|
| Platform | WordPress 6.5 + WooCommerce |
| Theme | Astra (free) + custom child theme |
| Local dev | Docker + WP-CLI |
| CI | GitHub Actions |
| Hosting (prod) | Cloudways (Vultr Basic) |

## Project structure

```
clothing-store/
├── docker-compose.yml                        # Local dev stack
├── .env.example                              # Copy to .env, never commit .env
├── scripts/
│   └── setup.sh                             # One-time WP + plugin install via WP-CLI
├── wp-content/
│   ├── themes/
│   │   └── clothing-store-child/            # YOUR theme (versioned)
│   │       ├── style.css
│   │       ├── functions.php
│   │       └── inc/                         # Feature files added as we build
│   └── plugins/
│       └── clothing-store-custom/           # YOUR plugin (versioned)
│           ├── clothing-store-custom.php
│           └── includes/                    # Feature modules added as we build
└── .github/
    └── workflows/
        └── ci.yml                           # PHP lint + integration smoke tests
```

Only your custom theme and plugin are versioned. WordPress core, WooCommerce,
and third-party plugins are installed via WP-CLI scripts — not committed to git.

## Local dev setup

### Prerequisites
- Docker Desktop (or Docker Engine + Compose plugin on Linux)
- Git

### First time

```bash
# 1. Clone the repo
git clone https://github.com/your-org/clothing-store.git
cd clothing-store

# 2. Create your local .env
cp .env.example .env
# Edit .env with your preferred passwords

# 3. Start the Docker stack
docker compose up -d

# 4. Run the one-time setup (installs WP + WooCommerce + all plugins)
bash scripts/setup.sh
```

Your local site is now at:
- **Store:** http://localhost:8080
- **WP Admin:** http://localhost:8080/wp-admin
- **phpMyAdmin:** http://localhost:8081

### Daily workflow

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f wordpress

# Run any WP-CLI command
docker compose run --rm wpcli wp <command> --allow-root --path=/var/www/html

# Examples
docker compose run --rm wpcli wp plugin list --allow-root --path=/var/www/html
docker compose run --rm wpcli wp option get siteurl --allow-root --path=/var/www/html
docker compose run --rm wpcli wp cache flush --allow-root --path=/var/www/html
```

### Live editing

Your local files are mounted directly into the container:

| Local path | What it controls |
|---|---|
| `wp-content/themes/clothing-store-child/` | Theme — edit and refresh browser |
| `wp-content/plugins/clothing-store-custom/` | Plugin — edit and refresh browser |

No rebuild needed. Save a PHP or CSS file locally, refresh the browser.

## Git workflow

```
main        — production-ready, deploys to Cloudways
develop     — integration branch
feature/*   — individual features
```

```bash
# Start a new feature
git checkout develop
git checkout -b feature/bulk-order-table

# Push and open a PR to develop
git push origin feature/bulk-order-table

# CI runs automatically on every push and PR
```

## CI (GitHub Actions)

On every push and PR to `main` or `develop`:

1. PHP syntax check on all custom files
2. WordPress coding standards check (PHPCS)
3. Spins up full Docker stack
4. Installs WordPress + WooCommerce via WP-CLI
5. Smoke tests: homepage, shop page, plugin loaded
6. Tears down

## What's versioned vs installed

| Thing | How it's managed |
|---|---|
| Custom child theme | Versioned in git |
| Custom plugin | Versioned in git |
| WordPress core | Docker image |
| WooCommerce | WP-CLI in setup.sh |
| Third-party plugins | WP-CLI in setup.sh |
| Uploaded media | Docker volume (local), Cloudways (prod) |
| Database | Docker volume (local), Cloudways MySQL (prod) |
