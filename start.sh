#!/bin/sh
sed -i "s/listen 80/listen ${PORT:-5050}/g" /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'