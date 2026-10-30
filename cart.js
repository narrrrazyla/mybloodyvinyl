// Keranjang belanja + komunikasi dengan index.html.
// Dipakai semua halaman di dalam iframe. Muat setelah products.js.
(function () {
    var MBV = (window.MBV = window.MBV || {});

    /* ---------- Penyimpanan ----------
       Utama: localStorage. Jika diblokir, isi disimpan di memori
       jendela induk selama tab masih terbuka. */
    function memory() {
        var w = window;
        try {
            while (w.parent !== w && w.parent.document) { w = w.parent; }
        } catch (e) { /* jendela induk lintas-origin, berhenti di sini */ }
        w.__mbvMemory = w.__mbvMemory || {};
        return w.__mbvMemory;
    }

    MBV.store = {
        get: function (key) {
            try {
                var raw = window.localStorage.getItem(key);
                if (raw !== null) return JSON.parse(raw);
            } catch (e) { /* lanjut ke memori */ }
            var m = memory()[key];
            return m === undefined ? null : m;
        },
        set: function (key, value) {
            memory()[key] = value;
            try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* pakai memori */ }
        },
        remove: function (key) {
            delete memory()[key];
            try { window.localStorage.removeItem(key); } catch (e) { /* abaikan */ }
        }
    };

    /* ---------- Pesan ke index.html ---------- */
    function post(msg) {
        if (window.parent !== window) {
            try { window.parent.postMessage(msg, '*'); } catch (e) { /* abaikan */ }
        }
    }

    function sync() {
        post({ type: 'mbv-cart', count: MBV.cart.count() });
    }

    /* ---------- Keranjang ---------- */
    var KEY = 'mbv-cart';

    function read() {
        var raw = MBV.store.get(KEY);
        if (!Array.isArray(raw)) return [];
        return raw
            .filter(function (i) { return i && MBV.get(i.id) && i.qty > 0; })
            .map(function (i) {
                return { id: i.id, qty: Math.min(i.qty, MBV.get(i.id).stock) };
            });
    }

    function write(list) {
        MBV.store.set(KEY, list);
        sync();
    }

    function find(list, id) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) return list[i];
        }
        return null;
    }

    MBV.cart = {
        items: read,

        qtyOf: function (id) {
            var line = find(read(), id);
            return line ? line.qty : 0;
        },

        count: function () {
            return read().reduce(function (n, i) { return n + i.qty; }, 0);
        },

        lines: function () {
            return read().map(function (i) {
                var p = MBV.get(i.id);
                return { product: p, qty: i.qty, total: p.price * i.qty };
            });
        },

        subtotal: function () {
            return MBV.cart.lines().reduce(function (n, l) { return n + l.total; }, 0);
        },

        // Mengembalikan jumlah yang benar-benar masuk (0 jika stok sudah penuh)
        add: function (id, qty) {
            var p = MBV.get(id);
            if (!p) return 0;
            var list = read();
            var line = find(list, id);
            var current = line ? line.qty : 0;
            var can = Math.max(0, Math.min(qty || 1, p.stock - current));
            if (!can) return 0;
            if (line) { line.qty += can; } else { list.push({ id: id, qty: can }); }
            write(list);
            return can;
        },

        setQty: function (id, qty) {
            var p = MBV.get(id);
            var list = read();
            var line = find(list, id);
            if (!p || !line) return;
            line.qty = Math.max(1, Math.min(qty, p.stock));
            write(list);
        },

        remove: function (id) {
            write(read().filter(function (i) { return i.id !== id; }));
        },

        clear: function () {
            write([]);
        }
    };

    /* ---------- Tombol "Tambah ke Keranjang" di kartu produk ---------- */
    function flash(btn, text) {
        var original = btn.getAttribute('data-label') || btn.textContent;
        btn.setAttribute('data-label', original);
        btn.textContent = text;
        clearTimeout(btn._timer);
        btn._timer = setTimeout(function () { btn.textContent = original; }, 1400);
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-add]') : null;
        if (!btn) return;
        var added = MBV.cart.add(btn.getAttribute('data-add'), 1);
        flash(btn, added ? 'Ditambahkan ✓' : 'Stok sudah penuh');
    });

    /* ---------- Beri tahu index.html: halaman, jumlah, dan tinggi ---------- */
    function reportHeight() {
        post({ type: 'mbv-height', height: Math.ceil(document.body.getBoundingClientRect().height) });
    }

    post({ type: 'mbv-page', name: document.body.getAttribute('data-page') || '' });
    sync();
    reportHeight();
    window.addEventListener('load', reportHeight);
    if (window.ResizeObserver) {
        new ResizeObserver(reportHeight).observe(document.body);
    }
})();
