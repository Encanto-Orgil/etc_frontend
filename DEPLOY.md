# Frontend deploy — encantotrade.mn

Next.js 16 танилцуулга вебийг **systemd** + **Nginx** ашиглан Ubuntu сервер дээр deploy хийх заавар.

| Тохиргоо | Утга |
|---------|------|
| Domain | `encantotrade.mn` |
| App path | `/home/ubuntu/etc_frontend` |
| Next.js port | `127.0.0.1:3000` (зөвхөн localhost) |
| API backend | `https://api.encantotrade.mn/api` |

Backend deploy: [`../etc_backend/DEPLOY.md`](../etc_backend/DEPLOY.md)

---

## 1. Серверийн бэлтгэл

Ubuntu 22.04/24.04:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx git curl
```

Node.js 20 LTS (NodeSource):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
npm -v
```

---

## 2. Код татах

```bash
cd /home/ubuntu
git clone <repo-url> encantotradecenter
cd encantotradecenter/etc_frontend
```

Эсвэл:

```bash
cd /home/ubuntu/etc_frontend
git pull origin main
```

---

## 3. Environment (.env.local)

`NEXT_PUBLIC_*` хувьсагчид **build хийхээс өмнө** заавал тохируулна — Next.js build үед embed хийгдэнэ.

```bash
cp .env.production.example .env.local
nano .env.local
```

Production:

```env
NEXT_PUBLIC_SITE_URL=https://encantotrade.mn
NEXT_PUBLIC_API_BASE=https://api.encantotrade.mn/api
```

---

## 4. Build

```bash
cd /home/ubuntu/etc_frontend
npm ci
npm run build
```

Build амжилттай бол `.next/` хавтас үүснэ.

Гараар турших:

```bash
npm run start -- --port 3000 --hostname 127.0.0.1
curl -I http://127.0.0.1:3000/
# Ctrl+C
```

---

## 5. systemd service

```bash
sudo cp /home/ubuntu/etc_frontend/deploy/etc-frontend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable etc-frontend
sudo systemctl start etc-frontend
sudo systemctl status etc-frontend
```

Лог:

```bash
journalctl -u etc-frontend -f
```

---

## 6. Nginx

```bash
sudo cp /home/ubuntu/etc_frontend/deploy/nginx-encantotrade.mn.conf \
        /etc/nginx/sites-available/encantotrade.mn

sudo ln -sf /etc/nginx/sites-available/encantotrade.mn \
            /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

---

## 7. SSL (Let's Encrypt)

DNS:
- `encantotrade.mn` → серверийн IP
- `www.encantotrade.mn` → серверийн IP (эсвэл CNAME)

```bash
sudo mkdir -p /var/www/certbot
sudo certbot --nginx -d encantotrade.mn -d www.encantotrade.mn
```

---

## 8. Backend холболт

Backend `.env` дотор frontend origin зөв байх ёстой:

```env
CORS_ALLOWED_ORIGINS=https://encantotrade.mn,https://www.encantotrade.mn
CSRF_TRUSTED_ORIGINS=https://encantotrade.mn,https://www.encantotrade.mn,https://api.encantotrade.mn
```

Backend deploy: [`../etc_backend/DEPLOY.md`](../etc_backend/DEPLOY.md)

---

## 9. Шалгалт

```bash
curl -I https://encantotrade.mn/
curl -I https://encantotrade.mn/office
curl -I https://encantotrade.mn/sitemap.xml
curl -I https://encantotrade.mn/robots.txt
```

Browser дээр:
- Нүүр хуудас ачаалагдана
- Canonical URL: `https://encantotrade.mn/...`
- Холбоо барих форм → `api.encantotrade.mn` руу POST
- `/dashboard`, `/portal` нэвтрэх

---

## 10. Шинэ хувилбар deploy (update)

```bash
cd /home/ubuntu/etc_frontend
git pull origin main

# .env.local өөрчлөгдсөн бол build дахин хийх шаардлагатай
npm ci
npm run build

sudo systemctl restart etc-frontend
sudo systemctl reload nginx
```

> **Анхаар:** `NEXT_PUBLIC_*` утга өөрчлөгдвөл заавал `npm run build` дахин ажиллуулна.

---

## 11. Асуудал шийдвэрлэх

### 502 Bad Gateway

```bash
sudo systemctl status etc-frontend
curl -I http://127.0.0.1:3000/
```

- Service унтарсан → `journalctl -u etc-frontend -n 50`
- Build хийгээгүй → `npm run build`
- Port conflict → `ss -tlnp | grep 3000`

### API холболт ажиллахгүй (CORS / fetch failed)

- `.env.local` дотор `NEXT_PUBLIC_API_BASE=https://api.encantotrade.mn/api` эсэх
- Build дахин хийсэн эсэх
- Backend CORS тохиргоо шалгах

### Canonical / SEO буруу URL

- `NEXT_PUBLIC_SITE_URL=https://encantotrade.mn` (trailing slash байхгүй)
- Build дахин хийх

### Dashboard / Portal canonical

`middleware.ts` нь `/dashboard/*`, `/portal/*` route-уудад pathname дамjuulna — systemd restart хийсэн эсэхийг шалгана.

---

## Файлуудын бүтэц

```
/home/ubuntu/etc_frontend/
├── .env.local              # production env (build + runtime)
├── .next/                  # build output
├── node_modules/
├── public/
│   └── images/
├── deploy/
│   ├── etc-frontend.service
│   └── nginx-encantotrade.mn.conf
├── middleware.ts
├── next.config.ts
└── package.json
```

## Архитектур

```
Browser
  → Nginx (443, encantotrade.mn)
    → 127.0.0.1:3000 (Next.js, systemd)
      → https://api.encantotrade.mn/api (Django API)
```

## Холбоотой route-ууд

| Path | Тайлбар | SEO |
|------|---------|-----|
| `/` | Нүүр | index |
| `/office`, `/mall`, `/ballroom`, `/residence` | Tower landing | index |
| `/dashboard/*` | Staff admin | noindex |
| `/portal/*` | Tenant portal | noindex |
| `/sitemap.xml`, `/robots.txt` | SEO | — |
