FROM php:8.3-fpm AS base

RUN apt-get update && apt-get install -y --no-install-recommends     git curl zip unzip libpng-dev libonig-dev libxml2-dev     libfreetype6-dev libjpeg62-turbo-dev libwebp-dev libzip-dev     && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp     && docker-php-ext-install -j$(nproc) pdo_mysql mbstring exif pcntl bcmath gd zip opcache     && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction

COPY . .
RUN composer dump-autoload --optimize --no-dev     && chown -R www-data:www-data storage bootstrap/cache

USER www-data
EXPOSE 9000
CMD ["php-fpm"]
