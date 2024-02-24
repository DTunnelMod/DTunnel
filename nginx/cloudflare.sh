#!/bin/bash

#include /etc/nginx/cloudflare;

FIREWALL=/root/firewall.sh
CLOUDFLARE_FILE_PATH=/etc/nginx/cloudflare

echo "sudo ufw reset" >> $FIREWALL;
echo "sudo ufw default deny incoming" >> $FIREWALL;
echo "" >> $FIREWALL;

echo "#Cloudflare" > $CLOUDFLARE_FILE_PATH;
echo "" >> $CLOUDFLARE_FILE_PATH;

echo "# - IPv4" >> $FIREWALL;
echo "# - IPv4" >> $CLOUDFLARE_FILE_PATH;
for i in `curl -s -L https://www.cloudflare.com/ips-v4`; do
    echo "sudo ufw allow from $i to any" >> $FIREWALL;
    echo "set_real_ip_from $i;" >> $CLOUDFLARE_FILE_PATH;
done

echo "" >> $FIREWALL;
echo "" >> $CLOUDFLARE_FILE_PATH;

echo "# - IPv6" >> $FIREWALL;
echo "# - IPv6" >> $CLOUDFLARE_FILE_PATH;
for i in `curl -s -L https://www.cloudflare.com/ips-v6`; do
    echo "sudo ufw allow from $i to any" >> $FIREWALL;
    echo "set_real_ip_from $i;" >> $CLOUDFLARE_FILE_PATH;
done

echo "" >> $FIREWALL;
echo "" >> $CLOUDFLARE_FILE_PATH;

echo "sudo ufw deny from any to any" >> $FIREWALL;
echo "sudo ufw allow ssh" >> $FIREWALL;
echo "sudo ufw reload" >> $FIREWALL;

echo "real_ip_header CF-Connecting-IP;" >> $CLOUDFLARE_FILE_PATH;

nginx -t && systemctl reload nginx
sudo bash $FIREWALL && rm -rf $FIREWALL