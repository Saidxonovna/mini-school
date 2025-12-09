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

// Faqat register.html sahifasida ishlaydigan funksiya:
function updateCoursePrices() {
    const chinaCourse = document.getElementById('course-china');
    const optomCourse = document.getElementById('course-optom');

    if (!chinaCourse || !optomCourse) return; 

    const chinaPrice = isPromoActive() ? DISCOUNT_PRICE_CHINA : FULL_PRICE_CHINA;
    const optomPrice = isPromoActive() ? DISCOUNT_PRICE_OPTOM : FULL_PRICE_OPTOM;
    const discountText = isPromoActive() ? ' - 50% Chegirma' : '';

    // HTML ichidagi tanlov matnini yangilash
    chinaCourse.textContent = `Hitoydan Tavar Zakaz Qilish Kursi (${formatPrice(chinaPrice)}${discountText})`;
    optomCourse.textContent = `Optom Tavarlar Kursi (${formatPrice(optomPrice)}${discountText})`;
        
    // HTML ichidagi data-price atributini yangilash (Forma yuborilganda to'g'ri narxni olish uchun)
    chinaCourse.setAttribute('data-price', chinaPrice);
    optomCourse.setAttribute('data-price', optomPrice);
}


document.addEventListener('DOMContentLoaded', function () {
    // Asosiy elementlarni topish
    const menuToggle = document.getElementById('menuToggle'); 
    const mainNav = document.getElementById('mainNav'); 
    // HTML kodingizdagi ID 'registrationForm' edi
    const registerForm = document.getElementById('registrationForm'); 


    // --- 1. Narxlarni yangilash (agar forma sahifasida bo'lsak) ---
    if (document.getElementById('course-list')) { 
        updateCoursePrices();
    }


    // --- 2. Hamburger menyu funksiyasi (Mobil menyu tuzatishlari) ---
    if (menuToggle && mainNav) { 
        menuToggle.addEventListener('click', function () { 
            // Menyuni ochish/yopish
            mainNav.classList.toggle('active'); 
            // 🛑 MUHIM: Ikonka (3 chiziqcha) X ga aylanishi uchun
            menuToggle.classList.toggle('active'); 
        });
        
        // Menyuni yopish qismi (havolaga bosilganda)
        mainNav.querySelectorAll('a').forEach(link => { 
            link.addEventListener('click', () => { 
                mainNav.classList.remove('active'); 
                // Menyuni yopganda ikonkani asl holiga qaytarish
                menuToggle.classList.remove('active'); 
            });
        });
    }

    // --- 3. Formani Yuborish (register.html sahifasida ishlaydi) ---
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) { 
            // Formspree ga ma'lumot yuborish uchun e.preventDefault() olib tashlandi.

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

            // Ma'lumotlar saqlanadi, keyin Formspree avtomatik ravishda to'lov sahifasiga yo'naltiradi.
        });
    }

    // 4. payment.html sahifasidagi logikani bu yerga qo'shish shart emas.
    // payment.html dagi ma'lumotlarni chiqarish logikasi o'sha faylning ichida bo'lishi kerak.

});
