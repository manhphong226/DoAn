(() => {
  // ===== CHẾ ĐỘ XUẤT FIGMA =====
  // true  = tắt chuyển hướng đăng nhập, coi như đã đăng nhập (Minh Anh) để html.to.design chụp đúng trang.
  // false = hoạt động bình thường (khôi phục trước khi chạy thật).
  const FIGMA_PREVIEW = true;
  const accountKey = 'flowfn.customer.demo.v1';
  const staffKey = 'flowfn.staff.demo.v1';
  const staffHome = 'FlowFN_Staff_BanHang_15A.html';
  const warehouseHome = 'FlowFN_Staff_Kho_15B.html';
  const technicianHome = 'FlowFN_Staff_KyThuat_15C.html';
  const adminHome = 'FlowFN_Admin_TongQuan.html';
  const home = 'FlowFN_Trang_Chu_Khach_Da_Dang_Nhap.html';
  const guest = 'FlowFN_Trang_Chu_Khach_1440x1024_Xanh_La.html';
  const login = 'FlowFN_Dang_Nhap.html';
  const orders = 'FlowFN_Lich_Su_Don_Hang.html';
  const catalog = 'FlowFN_Danh_Muc_San_Pham_Da_Dang_Nhap.html';
  const detail = 'FlowFN_Chi_Tiet_San_Pham.html';
  const cart = 'FlowFN_Gio_Hang.html';
  const checkout = 'FlowFN_Checkout.html';
  const payment = 'FlowFN_Thanh_Toan.html';
  const returnPages = [home, guest, orders, catalog, detail, cart, checkout, payment];
  const paymentWindowMs = 15 * 60 * 1000;

  function signedIn() {
    if (FIGMA_PREVIEW) return true;
    try {
      return sessionStorage.getItem(accountKey) === 'minh-anh';
    } catch {
      return false;
    }
  }

  function loginUrl(destination = home) {
    return login + '?next=' + encodeURIComponent(destination);
  }

  function requireSignIn() {
    if (FIGMA_PREVIEW) return true;
    if (signedIn()) return true;
    const page = location.pathname.split('/').pop();
    location.replace(loginUrl(page + location.search + location.hash));
    return false;
  }

  function signIn(email, password) {
    if (email.trim().toLowerCase() === 'admin@flowfn.example' && password === 'Admin2026') {
      try { sessionStorage.removeItem(accountKey); sessionStorage.setItem(staffKey, 'admin'); return true; } catch { return false; }
    }
    if (email.trim().toLowerCase() === 'kythuat@flowfn.example' && password === 'Staff2026') {
      try { sessionStorage.removeItem(accountKey); sessionStorage.setItem(staffKey, 'technician'); return true; } catch { return false; }
    }
    if (email.trim().toLowerCase() === 'kho@flowfn.example' && password === 'Staff2026') {
      try { sessionStorage.removeItem(accountKey); sessionStorage.setItem(staffKey, 'warehouse'); return true; } catch { return false; }
    }
    if (email.trim().toLowerCase() === 'banhang@flowfn.example' && password === 'Staff2026') {
      try { sessionStorage.removeItem(accountKey); sessionStorage.setItem(staffKey, 'sales'); return true; } catch { return false; }
    }
    if (email.trim().toLowerCase() !== 'minhanh@flowfn.example' || password !== 'FlowFN2026') return false;
    try {
      sessionStorage.removeItem(staffKey);
      sessionStorage.setItem(accountKey, 'minh-anh');
      return true;
    } catch {
      return false;
    }
  }

  function afterSignIn() {
    if (adminSignedIn()) { location.replace(adminHome); return; }
    if (technicianSignedIn()) { location.replace(technicianHome); return; }
    if (warehouseSignedIn()) { location.replace(warehouseHome); return; }
    if (staffSignedIn()) { location.replace(staffHome); return; }
    const next = new URLSearchParams(location.search).get('next') || '';
    const page = next.split(/[?#]/, 1)[0];
    location.replace(returnPages.includes(page) ? next : home);
  }

  function adminSignedIn() { if (FIGMA_PREVIEW) return true; try { return sessionStorage.getItem(staffKey) === 'admin'; } catch { return false; } }
  function technicianSignedIn() { if (FIGMA_PREVIEW) return true; try { return sessionStorage.getItem(staffKey) === 'technician'; } catch { return false; } }
  function warehouseSignedIn() { if (FIGMA_PREVIEW) return true; try { return sessionStorage.getItem(staffKey) === 'warehouse'; } catch { return false; } }
  function staffSignedIn() { if (FIGMA_PREVIEW) return true; try { return sessionStorage.getItem(staffKey) === 'sales'; } catch { return false; } }
  function staffSignOut() { try { sessionStorage.removeItem(staffKey); } catch {} location.replace(login); }
  function cartCount() {
    try {
      const lines = JSON.parse(localStorage.getItem('flowfn.product-cart.v1') || '[]');
      if (!Array.isArray(lines)) return 0;
      return lines.reduce((total, line) => {
        const quantity = Array.isArray(line) ? line[1] : 0;
        return Number.isSafeInteger(quantity) && quantity > 0 ? total + quantity : total;
      }, 0);
    } catch {
      return 0;
    }
  }

  function cancelledOrders() {
    try {
      const numbers = JSON.parse(sessionStorage.getItem('flowfn.orders.cancelled.v1') || '[]');
      return Array.isArray(numbers) ? numbers : [];
    } catch {
      return [];
    }
  }

  function updatePublicNavigation() {
    document.querySelectorAll('[data-customer-home]').forEach(link => {
      link.href = signedIn() ? home : guest;
    });
    document.querySelectorAll('[data-customer-entry]').forEach(link => {
      link.hidden = signedIn();
    });
    document.querySelectorAll('[data-customer-only]').forEach(control => {
      control.hidden = !signedIn();
    });
    document.querySelectorAll('[data-public-login]').forEach(link => {
      link.href = signedIn() ? home : login;
      link.textContent = signedIn() ? 'Tài khoản của tôi' : 'Đăng nhập';
    });
  }

  document.addEventListener('DOMContentLoaded', updatePublicNavigation);
  window.addEventListener('pageshow', updatePublicNavigation);
  document.addEventListener('click', event => {
    if (!event.target.closest('[data-flowfn-signout]')) return;
    sessionStorage.removeItem(accountKey);
    location.replace(guest);
  });

  window.FlowFN = { signedIn, adminSignedIn, staffSignedIn, warehouseSignedIn, technicianSignedIn, staffSignOut, signIn, requireSignIn, loginUrl, afterSignIn, cartCount, cancelledOrders,
    paymentWindowMs, home, guest, login, orders, catalog, detail, cart };
})();