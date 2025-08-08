#!/usr/bin/env bash
set -e

echo "=== Laravel Render Startup Script ==="

# Wait for the database to be reachable
if [ -n "$DATABASE_URL" ]; then
  echo "Checking database connectivity..."
  for i in {1..30}; do
    php -r "
      \$url = parse_url(getenv('DATABASE_URL'));
      \$host = \$url['host'];
      \$port = \$url['port'] ?? 5432;
      \$dbname = ltrim(\$url['path'], '/');
      \$user = \$url['user'];
      \$pass = \$url['pass'];
      \$conn_str = \"host=\$host port=\$port dbname=\$dbname user=\$user password=\$pass sslmode=require\";
      exit(@pg_connect(\$conn_str) ? 0 : 1);
    " && break || sleep 2
    echo -n "."
  done
  echo "Database connection established."
fi

# Run migrations and seeds
echo "Running migrations..."
php artisan migrate --force

echo "Seeding database..."
php artisan db:seed --force || true

# Cache config and routes for performance
echo "Caching config and routes..."
php artisan config:cache
php artisan route:cache

# Create the storage symlink
echo "Creating storage link..."
php artisan storage:link || true

# Start PHP-FPM in background
echo "Starting PHP-FPM..."
php-fpm &

# Start Nginx in foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
