// Data produk + helper tampilan. Muat sebelum cart.js.
(function () {
    var MBV = (window.MBV = window.MBV || {});
    var W = 'https://en.wikipedia.org/wiki/';
    // img: isi dengan path foto sampul (mis. 'img/loveless.jpg') bila sudah ada. Kosong = sampul pengganti.
    // src: halaman sumber album, dibuka saat gambar diklik.
    MBV.products = [
        { id: 'loveless', title: 'Loveless', artist: 'My Bloody Valentine', year: 1991, genre: 'Shoegaze', price: 450000, stock: 4, sold: 96, grade: 'VG+', tone: 1, src: W + 'Loveless_(album)', desc: 'Album yang mendefinisikan shoegaze: gitar berlapis, vokal tenggelam dalam kabut, dan distorsi yang terasa seperti gelombang. Pressing ini dalam kondisi sampul sedikit menguning, vinyl bersih.' },
        { id: 'souvlaki', title: 'Souvlaki', artist: 'Slowdive', year: 1993, genre: 'Dream Pop', price: 420000, stock: 5, sold: 88, grade: 'NM', tone: 3, src: W + 'Souvlaki', desc: 'Lebih lambat dan lebih sendu. Berisi "Alison" dan "When the Sun Hits", dengan sentuhan Brian Eno di beberapa lagu. Cocok didengar malam hari.' },
        { id: 'nowhere', title: 'Nowhere', artist: 'Ride', year: 1990, genre: 'Shoegaze', price: 380000, stock: 3, sold: 71, grade: 'VG+', tone: 2, src: W + 'Nowhere_(Ride_album)', desc: 'Debut Ride dari Oxford. Melodi cerah di bawah dinding gitar, dengan "Vapour Trail" sebagai penutup yang ikonik.' },
        { id: 'heaven-or-las-vegas', title: 'Heaven or Las Vegas', artist: 'Cocteau Twins', year: 1990, genre: 'Dream Pop', price: 400000, stock: 4, sold: 84, grade: 'NM', tone: 4, src: W + 'Heaven_or_Las_Vegas', desc: 'Vokal Elizabeth Fraser yang nyaris tanpa kata yang jelas, tapi terasa sangat dekat. Salah satu rilisan 4AD paling terang dan paling mudah dimasuki.' },
        { id: 'spooky', title: 'Spooky', artist: 'Lush', year: 1992, genre: 'Dream Pop', price: 360000, stock: 2, sold: 52, grade: 'VG', tone: 5, src: W + 'Spooky_(Lush_album)', desc: 'Produksi Robin Guthrie dari Cocteau Twins. Gitar halus dan harmoni vokal dua penyanyi yang menjadi ciri Lush.' },
        { id: 'psychocandy', title: 'Psychocandy', artist: 'The Jesus and Mary Chain', year: 1985, genre: 'Noise Pop', price: 410000, stock: 3, sold: 64, grade: 'VG+', tone: 6, src: W + 'Psychocandy', desc: 'Melodi pop ala 60-an yang dibungkus feedback keras. Pendahulu langsung bagi banyak band shoegaze.' },
        { id: 'on-fire', title: 'On Fire', artist: 'Galaxie 500', year: 1989, genre: 'Dream Pop', price: 340000, stock: 3, sold: 47, grade: 'VG+', tone: 2, src: W + 'On_Fire_(Galaxie_500_album)', desc: 'Tempo pelan, gitar basah oleh reverb, vokal Dean Wareham yang tipis. Sunyi tapi hangat.' },
        { id: 'isnt-anything', title: "Isn't Anything", artist: 'My Bloody Valentine', year: 1988, genre: 'Noise Pop', price: 390000, stock: 2, sold: 58, grade: 'VG', tone: 3, src: W + 'Isn%27t_Anything', desc: 'Album sebelum Loveless. Lebih kasar dan lebih tak menentu, di sinilah suara khas MBV mulai terbentuk.' },
        { id: 'pygmalion', title: 'Pygmalion', artist: 'Slowdive', year: 1995, genre: 'Ambient', price: 430000, stock: 2, sold: 39, grade: 'NM', tone: 5, src: W + 'Pygmalion_(Slowdive_album)', desc: 'Slowdive yang hampir tanpa gitar keras: minimal, lambat, dan ambient. Dulu diabaikan, kini dianggap salah satu karya terbaik mereka.' },
        { id: 'treasure', title: 'Treasure', artist: 'Cocteau Twins', year: 1984, genre: 'Dream Pop', price: 370000, stock: 3, sold: 43, grade: 'VG+', tone: 4, src: W + 'Treasure_(Cocteau_Twins_album)', desc: 'Album ketiga Cocteau Twins. Lagu-lagunya diberi judul dewi dan tokoh mitologi, dengan suasana gelap dan megah.' },
        { id: 'raise', title: 'Raise', artist: 'Swervedriver', year: 1991, genre: 'Alternative', price: 350000, stock: 2, sold: 33, grade: 'VG', tone: 6, src: W + 'Raise_(Swervedriver_album)', desc: 'Shoegaze yang lebih bertenaga: riff keras, ritme mengebut, dan nuansa jalan raya Amerika.' },
        { id: 'whirlpool', title: 'Whirlpool', artist: 'Chapterhouse', year: 1991, genre: 'Shoegaze', price: 330000, stock: 3, sold: 29, grade: 'VG+', tone: 1, src: W + 'Whirlpool_(Chapterhouse_album)', desc: 'Debut Chapterhouse dengan sentuhan ritme dance ala Madchester di bawah lapisan gitar.' }
    ];

    MBV.get = function (id) {
        for (var i = 0; i < MBV.products.length; i++) { if (MBV.products[i].id === id) return MBV.products[i]; }
        return null;
    };
    MBV.genres = function () {
        var g = [];
        MBV.products.forEach(function (p) { if (g.indexOf(p.genre) < 0) g.push(p.genre); });
        return g.sort();
    };
    MBV.esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    };
    MBV.rp = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };

    // Gambar produk; klik untuk membuka sumber album di tab baru
    MBV.cover = function (p) {
        var inner = p.img
            ? '<img src="' + MBV.esc(p.img) + '" alt="Sampul ' + MBV.esc(p.title) + '">'
            : '<div class="cover tone-' + p.tone + '"><span class="cover-artist">' + MBV.esc(p.artist) + '</span><span class="cover-title">' + MBV.esc(p.title) + '</span></div>';
        return '<a class="cover-link" href="' + p.src + '" target="_blank" rel="noopener" title="Lihat sumber album: ' + MBV.esc(p.title) + '">' + inner + '</a>';
    };

    MBV.card = function (p, rank) {
        var out = p.stock < 1;
        return '<article class="product-card">' + (rank ? '<span class="rank">#' + rank + '</span>' : '') + MBV.cover(p) +
            '<span class="grade">' + MBV.esc(p.grade) + '</span>' +
            '<h3><a href="product.html?id=' + p.id + '">' + MBV.esc(p.title) + '</a></h3>' +
            '<p>' + MBV.esc(p.artist) + ' · ' + p.year + '</p>' +
            '<span class="price">' + MBV.rp(p.price) + '</span>' +
            '<button type="button" data-add="' + p.id + '"' + (out ? ' disabled' : '') + '>' + (out ? 'Stok habis' : 'Tambah ke Keranjang') + '</button></article>';
    };
})();
