/* FlowFN — menu tài khoản trên header: Hồ sơ thông tin / Đơn hàng / Bảo hành / Đăng xuất */
(() => {
  const profileKey = 'flowfn.profile.v1';
  const profilePage = 'FlowFN_Ho_So.html';
  const ico = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const icons = {
    user: ico('<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 15-5 16 0"/>'),
    box: ico('<path d="M4 7l8-4 8 4v10l-8 4-8-4V7Zm0 0 8 4 8-4m-8 4v10"/>'),
    shield: ico('<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>'),
    out: ico('<path d="M9 4H5v16h4m5-4 4-4-4-4m4 4H9"/>')
  };
  function profile() {
    try { return JSON.parse(localStorage.getItem(profileKey) || 'null') || {}; } catch { return {}; }
  }
  const fullName = () => profile().fullName || 'Nguyễn Minh Anh';
  const email = () => profile().email || 'minhanh@flowfn.example';
  const shortName = name => name.trim().split(/\s+/).slice(-2).join(' ');
  const initials = name => name.trim().split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase();
  const page = () => location.pathname.split('/').pop();

  function build() {
    const button = document.getElementById('profile-button');
    if (!button || button.dataset.menuReady) return;
    button.dataset.menuReady = '1';
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    const name = fullName();
    const label = button.lastChild;
    if (label && label.nodeType === 3) label.textContent = ' ' + shortName(name);
    button.setAttribute('aria-label', 'Tài khoản của ' + shortName(name));

    const menu = document.createElement('div');
    menu.className = 'account-menu';
    menu.id = 'account-menu';
    menu.hidden = true;
    menu.setAttribute('role', 'menu');
    const here = page();
    menu.innerHTML =
      '<div class="am-head"><span class="am-avatar">' + initials(name) + '</span><div><strong>' + name + '</strong><small>' + email() + '</small><small>Thành viên Bạc · FlowFN Club</small></div></div>' +
      '<a class="am-item' + (here === profilePage ? ' on' : '') + '" role="menuitem" href="' + profilePage + '">' + icons.user + 'Hồ sơ thông tin</a>' +
      '<a class="am-item' + (here === 'FlowFN_Lich_Su_Don_Hang.html' ? ' on' : '') + '" role="menuitem" href="FlowFN_Lich_Su_Don_Hang.html">' + icons.box + 'Đơn hàng của tôi</a>' +
      '<a class="am-item" role="menuitem" href="FlowFN_Lich_Su_Don_Hang.html#bao-hanh">' + icons.shield + 'Bảo hành &amp; kiểm định</a>' +
      '<div class="am-sep"></div>' +
      '<button type="button" class="am-item am-out" role="menuitem" data-flowfn-signout>' + icons.out + 'Đăng xuất</button>';
    document.body.appendChild(menu); // đặt ngoài header để không bị overflow của header cắt/cuộn

    const close = (focusButton) => { menu.hidden = true; button.setAttribute('aria-expanded', 'false'); if (focusButton) button.focus(); };
    const place = () => {
      const r = button.getBoundingClientRect();
      menu.style.top = Math.round(r.bottom + 10) + 'px';
      if (window.innerWidth <= 540) { menu.style.left = '12px'; menu.style.right = '12px'; menu.style.width = 'auto'; }
      else { menu.style.left = 'auto'; menu.style.right = Math.max(12, Math.round(window.innerWidth - r.right)) + 'px'; menu.style.width = ''; }
    };
    const open = () => { menu.hidden = false; place(); button.setAttribute('aria-expanded', 'true'); menu.querySelector('.am-item').focus(); };
    window.addEventListener('resize', () => { if (!menu.hidden) place(); });
    window.addEventListener('scroll', () => { if (!menu.hidden) place(); }, true);

    // Chặn hộp thoại "Tài khoản của tôi" cũ, thay bằng menu
    document.addEventListener('click', event => {
      const trigger = event.target.closest('#profile-button');
      if (trigger) {
        event.preventDefault();
        event.stopPropagation();
        menu.hidden ? open() : close(false);
        return;
      }
      if (!menu.hidden && !event.target.closest('#account-menu')) close(false);
    }, true);
    document.addEventListener('keydown', event => {
      if (menu.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const items = [...menu.querySelectorAll('.am-item')];
        const index = items.indexOf(document.activeElement);
        const next = event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        items[next].focus();
      }
    });
    window.addEventListener('storage', event => { if (event.key === profileKey) location.reload(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.addEventListener('pageshow', build);
})();
