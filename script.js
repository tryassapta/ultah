
// ======================================
// 1. VARIABEL UTAMA
// ======================================

const giftArea = document.getElementById('giftArea');
const scoreEl = document.getElementById('score');
const progressBar = document.getElementById('progressBar');
const gameHint = document.getElementById('gameHint');
const surprise = document.getElementById('surprise');

const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');

const startBtn = document.getElementById('startBtn');
const spawnBtn = document.getElementById('spawnBtn');

let score = 0;
let isPlaying = false;
let gameStarted = false;

const maxGifts = 5;

const giftEmojis = [
    '🎁', '🧸', '🍓', '💝', '🧁', '🌷', '🍬'
];


// ======================================
// 2. NOTIFIKASI
// ======================================

function showToast(message) {

    const toast = document.getElementById('toast');

    toast.textContent = message;

    toast.classList.add('show');

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove('show');

    }, 2100);

}


// ======================================
// 3. BACKGROUND MUSIC
// ======================================

async function playMusic() {

    try {

        await bgMusic.play();

        isPlaying = true;

        musicBtn.textContent = 'Ⅱ';

        musicBtn.setAttribute(
            'aria-label',
            'Jeda musik'
        );

    } catch (error) {

        isPlaying = false;

        musicBtn.textContent = '▶';

        showToast('Musik belum bisa diputar. Cek file MP3! 🎵');

        console.error('Music error:', error);

    }

}


function pauseMusic() {

    bgMusic.pause();

    isPlaying = false;

    musicBtn.textContent = '▶';

    musicBtn.setAttribute(
        'aria-label',
        'Putar musik'
    );

}


// Tombol Play / Pause

musicBtn.addEventListener('click', () => {

    if (bgMusic.paused) {

        playMusic();

    } else {

        pauseMusic();

    }

});


// Sinkronisasi status musik

bgMusic.addEventListener('play', () => {

    isPlaying = true;

    musicBtn.textContent = 'Ⅱ';

});

bgMusic.addEventListener('pause', () => {

    isPlaying = false;

    musicBtn.textContent = '▶';

});

bgMusic.addEventListener('error', () => {

    showToast('File musik tidak ditemukan! 🎵');

    console.error('Periksa lokasi music/birthday.mp3');

});


// ======================================
// 4. MINI GAME TANGKAP HADIAH
// ======================================

function spawnGift() {

    if (score >= maxGifts) return;

    gameHint.classList.add('hidden');

    const gift = document.createElement('button');

    gift.className = 'gift-item';

    gift.type = 'button';

    gift.textContent =
        giftEmojis[
            Math.floor(Math.random() * giftEmojis.length)
        ];

    gift.setAttribute('aria-label', 'Ambil hadiah');

    // Posisi hadiah secara acak

    const maxX = Math.max(0, giftArea.clientWidth - 52);

    const maxY = Math.max(0, giftArea.clientHeight - 52);

    gift.style.left = Math.random() * maxX + 'px';

    gift.style.top = Math.random() * maxY + 'px';

    gift.style.animationDelay = Math.random() + 's';


    // Ketika hadiah diklik

    gift.addEventListener('click', () => {

        gift.remove();

        score++;

        scoreEl.textContent = score;

        progressBar.style.width =
            (score / maxGifts * 100) + '%';


        showToast('Yeay! Satu hadiah buat kamu! 🎀');


        // Jika berhasil mengumpulkan 5 hadiah

        if (score === maxGifts) {

            document.querySelectorAll('.gift-item')
                .forEach(el => el.remove());

            surprise.classList.remove('hidden');

            showToast('Kejutan berhasil dibuka! 💌');

            setTimeout(() => {

                surprise.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

            }, 500);

        } else {

            // Jika tidak ada hadiah tersisa

            if (!giftArea.querySelector('.gift-item')) {

                gameHint.classList.remove('hidden');

            }

        }

    });

    giftArea.appendChild(gift);

}


// ======================================
// 5. TOMBOL MUNCULKAN HADIAH
// ======================================

spawnBtn.addEventListener('click', () => {

    if (score >= maxGifts) {

        showToast('Kamu sudah mendapatkan semua hadiah! 💗');

        return;

    }

    const existingGifts =
        giftArea.querySelectorAll('.gift-item').length;

    if (existingGifts < 3) {

        spawnGift();

    } else {

        showToast('Ambil hadiah yang sudah muncul dulu! 🎁');

    }

});


// ======================================
// 6. TOMBOL MULAI
// ======================================

startBtn.addEventListener('click', () => {

    // Putar musik

    if (bgMusic.paused) {

        playMusic();

    }

    // Scroll menuju permainan

    document.getElementById('game').scrollIntoView({

        behavior: 'smooth'

    });

    // Mulai game hanya sekali

    if (!gameStarted) {

        gameStarted = true;

        setTimeout(() => {

            spawnGift();

        }, 500);

    }

});


// ======================================
// 7. MEMBUKA SURAT RAHASIA
// ======================================

function openLetter() {

    const letter = document.getElementById('letter');

    const envelope = document.getElementById('envelope');

    if (letter.classList.contains('hidden')) {

        letter.classList.remove('hidden');

        envelope.innerHTML = '💖<span>opened with love</span>';

        showToast('Ada pesan spesial untukmu! 💗');

    }

}


// Klik amplop

document.getElementById('envelope')
    .addEventListener('click', openLetter);


// ======================================
// 8. MINI GAME TIUP LILIN
// ======================================

const candles = document.querySelectorAll('.candle');

candles.forEach(candle => {

    candle.addEventListener('click', () => {

        // Cegah lilin diklik berkali-kali

        if (candle.classList.contains('blown')) {

            return;

        }

        candle.classList.add('blown');

        candle.textContent = '💨';


        // Periksa jumlah lilin yang masih menyala

        const remainingCandles =
            document.querySelectorAll('.candle:not(.blown)').length;


        // Jika semua lilin sudah padam

        if (remainingCandles === 0) {

            document.getElementById('wishText').textContent =
                'Semoga semua harapanmu jadi nyata! 💗';

            showToast('Yeay! Semua lilin sudah padam! 🎂');

        } else {

            showToast(
                `Tersisa ${remainingCandles} lilin lagi! 🕯️`
            );

        }

    });

});


// ======================================
// 9. TOMBOL MAKE A WISH
// ======================================

document.getElementById('wishBtn')
    .addEventListener('click', () => {

        const remainingCandles =
            document.querySelectorAll('.candle:not(.blown)').length;

        if (remainingCandles > 0) {

            showToast('Tiup semua lilinnya dulu! 🕯️');

            return;

        }

        document.getElementById('wishText').textContent =
            'Aamiin! Semoga tahun ini jadi tahun terbaikmu. ♡';

        showToast(
            'Harapanmu sudah dikirim ke semesta! 🌟'
        );

    });


// ======================================
// WEBSITE SELESAI
// ======================================

console.log('Birthday website berhasil dijalankan! 💗');
