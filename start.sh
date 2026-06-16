#!/bin/sh
cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen ${PORT:-5050};
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
nginx -g 'daemon off;'