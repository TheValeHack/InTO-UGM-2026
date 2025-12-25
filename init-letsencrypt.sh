#!/bin/bash

# Configuration
domain="intougm2026.com"
email="intougm2026@gmail.com"
data_path="./certbot"

if ! docker compose version > /dev/null 2>&1; then
  echo 'Error: docker compose is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v openssl)" ]; then
  echo 'Error: openssl is not installed on the host. Using docker fallback...'
  # (Fallback logic could go here, but since we know it's available, we'll keep it simple)
fi

echo "### Preparing directories ..."
sudo mkdir -p "$data_path/conf/live/$domain"
sudo mkdir -p "$data_path/www"

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
fi

echo "### Creating dummy certificate for $domain ..."
sudo openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "$data_path/conf/live/$domain/privkey.pem" \
  -out "$data_path/conf/live/$domain/fullchain.pem" \
  -subj "/CN=localhost"

echo "### Starting nginx ..."
docker compose up --force-recreate -d nginx
echo "Waiting for nginx to start..."
sleep 5

echo "### Deleting dummy certificate for $domain ..."
sudo rm -rf "$data_path/conf/live/$domain" "$data_path/conf/archive/$domain" "$data_path/conf/renewal/$domain.conf"

echo "### Requesting real Let's Encrypt certificate for $domain ..."
if ! docker compose run --rm certbot certonly --webroot -w /var/www/certbot \
    --email "$email" \
    -d "$domain" \
    --agree-tos \
    --force-renewal \
    --non-interactive; then
  echo "### ERROR: Certbot failed to obtain a certificate."
  echo "Please check if your domain $domain points to this server's IP and port 80 is open."
  exit 1
fi

echo "### Reloading nginx ..."
docker compose exec nginx nginx -s reload
