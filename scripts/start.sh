#!/usr/bin/env bash
set -e

# Wait for the database to be reachable
if [ -n "$DATABASE_URL" ]; then
  echo "Checking database connectivity..."
  for i in {1..30}; do
    php -r "exit(@pg_connect(str_replace('postgresql://', 'host=', getenv('DATABASE_URL'))) ? 0 : 1);" && break || sleep 2
    echo -n "."
  done
  echo
fi

# Run migrations and seeds
php artisan migrate --force
php artisan db:seed --force || true

# Cache config and routes for performance
php artisan config:cache
php artisan route:cache

# Create the storage symlink
php artisan storage:link || true

# Start PHP-FPM (Nginx will serve as reverse proxy in the container)
php-fpm