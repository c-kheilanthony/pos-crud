# Dockerfile (place at repo root)
FROM php:8.2-fpm

# Install system packages, php extensions, nginx and node/npm
RUN apt-get update && apt-get install -y \
    git unzip zip libpq-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev curl gnupg nginx nodejs npm && \
    docker-php-ext-install pdo pdo_pgsql bcmath pcntl gd zip && \
    rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP deps
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-scripts --optimize-autoloader || true

# Install JS deps and build (optional)
COPY package*.json ./
RUN npm ci --silent && npm run build || true

# Copy app
COPY . .
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache


# Nginx config (we copy user-provided config below)
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf

# Make start script executable
RUN chmod +x /var/www/html/scripts/start.sh

# Expose port 10000 (Render ignores, but good practice)
EXPOSE 10000

CMD ["/var/www/html/scripts/start.sh"]
