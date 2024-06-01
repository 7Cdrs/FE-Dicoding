document.addEventListener('DOMContentLoaded', function () {
    const inputBookForm = document.getElementById('inputBook');

    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Mencegah pengiriman form secara default

        const judul = document.getElementById('inputBookTitle').value;
        const pengarang = document.getElementById('inputBookAuthor').value;
        const tahunTerbit = parseInt(document.getElementById('inputBookYear').value);
        const selesaiDibaca = document.getElementById('inputBookIsComplete').checked;

        const bukuBaru = {
            id: +new Date(), // Menggunakan fungsi generateID() untuk membuat ID unik
            title: judul,
            author: pengarang,
            year: tahunTerbit,
            isComplete: selesaiDibaca,
        };

        tambahBuku(bukuBaru);

        // Reset form setelah buku ditambahkan
        inputBookForm.reset();
    });

    // Memuat data buku dari localStorage saat halaman dimuat
    let daftarBuku = ambilDataBukuDariLocalStorage();
    tampilkanBuku();

    // Event listener untuk form pencarian buku
    const searchBookForm = document.getElementById('searchBook');
    searchBookForm.addEventListener('submit', cariBuku);

    // Function untuk menyimpan dan mengambil data buku dari localStorage
    function simpanDataBukuKeLocalStorage() {
        localStorage.setItem('daftarBuku', JSON.stringify(daftarBuku));
    }

    function ambilDataBukuDariLocalStorage() {
        let dataBuku = localStorage.getItem('daftarBuku');
        return dataBuku ? JSON.parse(dataBuku) : [];
    }

    // Function untuk menambahkan buku baru
    function tambahBuku(buku) {
        // Tambahkan buku baru ke dalam array daftarBuku
        daftarBuku.push(buku);

        console.log('Buku berhasil ditambahkan:', buku);

        // Simpan data buku ke localStorage
        simpanDataBukuKeLocalStorage();

        // Memperbarui tampilan rak buku
        tampilkanBuku();
    }

    // Function untuk mencari buku berdasarkan judul
    function cariBuku(event) {
        event.preventDefault();
        const query = document.querySelector("#searchBookTitle").value.toLowerCase();
        const hasilPencarian = daftarBuku.filter(function (buku) {
            return buku.title.toLowerCase().includes(query);
        });
        tampilkanBuku(hasilPencarian);
    }

    // Function untuk menampilkan buku
    function tampilkanBuku(hasilPencarian = daftarBuku) {
        const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
        const completeBookshelfList = document.getElementById('completeBookshelfList');

        // Bersihkan daftar buku sebelum menambahkan yang baru
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        hasilPencarian.forEach(function (buku) {
            const bukuItem = document.createElement('article');
            bukuItem.classList.add('book_item');
            bukuItem.innerHTML = `
                <h3>${buku.title}</h3>
                <p>Penulis: ${buku.author}</p>
                <p>Tahun: ${buku.year}</p>
            `;

            const actionContainer = document.createElement('div');
            actionContainer.classList.add('action');

            const actionButton = document.createElement('button');
            actionButton.classList.add('red');
            actionButton.textContent = 'Hapus buku';
            actionButton.addEventListener('click', function () {
                hapusBuku(buku);
            });

            actionContainer.appendChild(actionButton);
            bukuItem.appendChild(actionContainer);

            if (buku.isComplete) {
                const undoButton = document.createElement('button');
                undoButton.classList.add('green');
                undoButton.textContent = 'Belum selesai di Baca';
                undoButton.addEventListener('click', function () {
                    ubahStatusBuku(buku);
                });
                actionContainer.insertBefore(undoButton, actionButton);
                completeBookshelfList.appendChild(bukuItem);
            } else {
                const completeButton = document.createElement('button');
                completeButton.classList.add('green');
                completeButton.textContent = 'Selesai dibaca';
                completeButton.addEventListener('click', function () {
                    ubahStatusBuku(buku);
                });
                actionContainer.insertBefore(completeButton, actionButton);
                incompleteBookshelfList.appendChild(bukuItem);
            }
        });
    }

    // Function untuk menghapus buku dari daftar
    function hapusBuku(buku) {
        const index = daftarBuku.indexOf(buku);
        if (index !== -1) {
            daftarBuku.splice(index, 1);
        }
        // Simpan data buku ke localStorage setelah penghapusan
        simpanDataBukuKeLocalStorage();
        tampilkanBuku();
    }

    // Function untuk mengubah status buku
    function ubahStatusBuku(buku) {
        buku.isComplete = !buku.isComplete;
        // Simpan data buku ke localStorage setelah perubahan status
        simpanDataBukuKeLocalStorage();
        tampilkanBuku();
    }

    // Function untuk menghasilkan ID unik
    function generateID() {
        // Menghasilkan angka acak dengan panjang 10 karakter
        return Math.random().toString(36).substr(2, 10);
    }
});
