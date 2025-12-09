// Global o'zgaruvchi: Telegram manzili
const TELEGRAM_URL = 'https://t.me/Saidxonovnas_School'; 
// Global o'zgaruvchi: To'lovni tasdiqlash sahifasi
const PAYMENT_PAGE_URL = 'payment.html'; 

// Global o'zgaruvchi: Chegirma tugaydigan sana
const PROMO_END_DATE = new Date(2026, 0, 31); // 2026 yil, Yanvar (0-oy), 31-kun

// Global o'zgaruvchi: Narxlar
const FULL_PRICE_CHINA = 100000; 
const FULL_PRICE_OPTOM = 250000; 
const DISCOUNT_PRICE_CHINA = 50000; 
const DISCOUNT_PRICE_OPTOM = 125000; 


function isPromoActive() {
    const today = new Date();
    // Agar bugungi sana muddat tugashidan oldin bo'lsa, TRUE qaytadi
    return today <= PROMO_END_DATE;
}

// Narxni formatlash funksiyasi
function formatPrice(amount) {
    return new Intl.NumberFormat('uz-UZ', { 
        style: 'currency', 
        currency: 'UZS', 
        minimumFractionDigits: 0 
    }).format(amount); 
}

// Faqat register.html sahifasida ishlaydigan yangi funksiya:
function updateCoursePrices() {
    const chinaCourse = document.getElementById('course-china');
    const optomCourse = document.getElementById('course-optom');

    if (!chinaCourse || !optomCourse) return; 

    if (isPromoActive()) {
        // Chegirma faol bo'lsa
        chinaCourse.textContent = `Hitoydan Tavar Zakaz Qilish Kursi (${formatPrice(DISCOUNT_PRICE_CHINA)} - 50% Chegirma)`;
        optomCourse.textContent = `Optom Tavarlar Kursi (${formatPrice(DISCOUNT_PRICE_OPTOM)} - 50% Chegirma)`;
    } else {
        // Chegirma tugagan bo'lsa
        chinaCourse.textContent = `Hitoydan Tavar Zakaz Qilish Kursi (${formatPrice(FULL_PRICE_CHINA)})`;
        optomCourse.textContent = `Optom Tavarlar Kursi (${formatPrice(FULL_PRICE_OPTOM)})`;
        
        // data-price'ni ham to'liq narxga yangilaymiz!
        chinaCourse.setAttribute('data-price', FULL_PRICE_CHINA);
        optomCourse.setAttribute('data-price', FULL_PRICE_OPTOM);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menuToggle'); 
    const mainNav = document.getElementById('mainNav'); 
    const registerForm = document.getElementById('register-form'); 
    
    // updateCoursePrices ni ishga tushiramiz (register.html dagi narxlarni sozlaydi)
    if (registerForm) {
        updateCoursePrices();
    }


    // --- 1. Hamburger menyu funksiyasi ---
    if (menuToggle && mainNav) { 
        menuToggle.addEventListener('click', function () { 
            mainNav.classList.toggle('active'); 
        });
        // Menyuni yopish qismi
        mainNav.querySelectorAll('a').forEach(link => { 
            link.addEventListener('click', () => { 
                mainNav.classList.remove('active'); 
            });
        });
    }

    // --- 2. Formani Yuborish (register.html sahifasida ishlaydi) ---
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) { 
            // Bu yerda e.preventDefault() olib tashlandi, toki Formspree'ga ma'lumot yuborilsin.

            const name = document.getElementById('user-name').value;
            const courseSelect = document.getElementById('user-course');
            const course = courseSelect.value;
            
            // Telefon raqamini olish va +998 bilan to'g'irlash
            const rawPhone = document.getElementById('user-phone').value.replace(/\D/g, ''); 
            const phone = (rawPhone.length === 9) ? `+998${rawPhone}` : rawPhone; 
            
            const selectedOption = courseSelect.options[courseSelect.selectedIndex];
            
            // data-price dan narxni olamiz.
            const priceToPay = parseFloat(selectedOption.getAttribute('data-price')); 
            
            
            const formattedPrice = formatPrice(priceToPay); // Narxni formatlash

            // Ma'lumotlarni localStoragga saqlash (payment.html sahifasi uchun zarur)
            localStorage.setItem('regName', name); 
            localStorage.setItem('regCourse', course); 
            localStorage.setItem('regPhone', phone); 
            localStorage.setItem('regPrice', formattedPrice); 
            
            console.log(`Foydalanuvchi Ro'yxatdan O'tish Ma'lumotlarini Saqladi: Ism: ${name}, Kurs: ${course}, Telefon: ${phone}`);

            // Ma'lumotlar saqlanadi, keyin Formspree avtomatik ravishda _next URLga yo'naltiradi.
        });
    }
});
