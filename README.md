# POS Cashier and Order Management System

A modern Point‑of‑Sale web application for efficient cashier and order management, built with **Laravel** (backend) and **React + Vite** (frontend).  
Designed for small businesses, shops, and kiosks that need a fast, reliable, and user‑friendly cashiering experience with live updates, inventory tracking, and customer e‑mail receipts.

---

## ✨ Key Features

| Category | Highlights |
|----------|------------|
| **Authentication** | Secure JWT login for cashiers and customers |
| **Real‑time Experience** | 🔔 Live bell notifications, instant order & inventory sync via Laravel Echo |
| **Order Management** | View, confirm, or reject pending orders; detailed modal with customer & item breakdown; stock auto‑updates |
| **Customer Receipt Mailing** | Automatic e‑mail receipt (HTML) sent to customer on order confirmation—queued for speed |
| **Item Management** | Add, edit, delete items; live stock & price updates; paginated table |
| **Live Stock Sync** | Every open dashboard stays in sync—no refresh needed |
| **Responsive UI** | Built with TailwindCSS & shadcn/ui; mobile‑friendly |
| **UX Optimizations** | Global loaders, disabled buttons during processing, toast feedback |
| **Clean Codebase** | Modular React components & scalable Laravel architecture |

---

## 🚀 Quick Start

### 1 · Clone the Repository
```bash
git clone https://github.com/yourusername/your-pos-app.git
cd your-pos-app
```

### 2 · Backend Setup (Laravel)
```bash
cd backend
composer install
cp .env.example .env        # configure DB, BROADCAST_DRIVER, MAIL_*, PUSHER_*
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
```

#### Broadcasting
```dotenv
BROADCAST_DRIVER=pusher     # quickest path (or use laravel-websockets)
```

#### Mailing
Configure SMTP in **.env** (Mailtrap, SendGrid, Postmark, etc.).
Queued mailing is enabled by default:
```dotenv
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_user
MAIL_PASSWORD=your_pass
MAIL_ENCRYPTION=tls
```

### 3 · Run Laravel Servers
```bash
php artisan serve           # API
php artisan queue:work      # queues for mail & broadcasts
```

### 4 · Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
cp .env.example .env        # set VITE_PUSHER keys & API URL if different
npm run dev
```

Access the app at **http://localhost:5173**  
API defaults to **http://localhost:8000**

---

## 🔔 Live Updates & Broadcasting

| Option | Steps |
|--------|-------|
| **Pusher (default)** | Add keys to `.env` on both frontend & backend |
| **Laravel WebSockets** | `composer require beyondcode/laravel-websockets`, keep `BROADCAST_DRIVER=pusher`, run `php artisan websockets:serve` |

---

## 📧 E‑mail Receipts

- `OrderReceiptMail` (Mailable) renders a Blade HTML receipt.  
- Automatically queued & dispatched upon order confirmation.  
- Requires queue worker running (`php artisan queue:work`).  
- Customize template at `resources/views/emails/orders/receipt.blade.php`.

---

## 🖥️ Usage Workflow

1. **Cashier Log‑in**  
2. **Watch New Orders** pop up live.  
3. **Confirm / Reject**—stock adjusts, receipt e‑mailed automatically.  
4. **Manage Items** to keep inventory current.  
5. All sessions stay **perfectly in sync**.

---

## 🛠️ Customization Ideas

- Role‑based access (admin / staff).  
- Sales analytics & daily reports.  
- Barcode scanning or thermal receipt printing.  
- Integration with accounting or ERP.

