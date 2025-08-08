#!/usr/bin/env bash
set -e

# optional: wait for DATABASE_URL to be resolvable (simple loop)
if [ -n "$DATABASE_URL" ]; then
  echo "checking database connectivity..."
  for i in {1..30}; do
    php -r "exit((bool) @pg_connect(getenv('DATABASE_URL')) ? 0 : 1);" && break || sleep 2
    echo -n "."
  done
  echo
fi

# install php deps in case
composer install --no-dev --prefer-dist --no-interaction || true

# run migrations and seed (force to skip confirmation)
php artisan migrate --force || true
php artisan db:seed --force || true

# cache config and routes for production
php artisan config:cache || true
php artisan route:cache || true

# create the storage symlink
php artisan storage:link || true

# start php-fpm and nginx
php-fpm -D
nginx -g 'daemon off;'
