#!/usr/bin/env bash
set -e

echo "=== Laravel Render Startup Script ==="

# Wait for the database to be reachable (10 attempts, then continue)
if [ -n "$DATABASE_URL" ]; then
  echo "Checking database connectivity (10 tries)..."
  success=false
  for i in {1..10}; do
    php -r "
      \$url = parse_url(getenv('DATABASE_URL'));
      \$host = \$url['host'] ?? '';
      \$port = \$url['port'] ?? 5432;
      \$dbname = ltrim(\$url['path'] ?? '', '/');
      \$user = \$url['user'] ?? '';
      \$pass = \$url['pass'] ?? '';
      \$conn_str = \"host=\$host port=\$port dbname=\$dbname user=\$user password=\$pass sslmode=require\";
      exit(@pg_connect(\$conn_str) ? 0 : 1);
    " && { success=true; break; } || sleep 2
    echo -n "."
  done
  echo
  if [ "$success" = true ]; then
    echo "Database reachable."
    echo "Running migrations..."
    php artisan migrate --force
    echo "Seeding database..."
    php artisan db:seed --force || true
  else
    echo "Database not reachable after 10 attempts. Continuing startup without running migrations."
  fi
fi

php artisan view:clear || true

# Cache config and routes for performance
echo "Caching config and routes..."
php artisan config:cache
php artisan route:cache

# Create the storage symlink
echo "Creating storage link..."
php artisan storage:link || true

echo "Ensuring storage and cache directories exist and are writable..."
mkdir -p storage/framework/views storage/framework/sessions storage/framework/cache bootstrap/cache storage/app/public
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true


# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm &

# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
