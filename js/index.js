// $(document).ready(function(){
//     $('.brand_carousel').slick({
//         slidesToShow: 4,
//         slidesToScroll: 1,
//         autoplay: true,
//         autoplaySpeed: 100,
//         easing: 'ease-in-out',
//     });
// });
(function () {
    const track = document.getElementById('galleryTrack');
    const dotsWrap = document.getElementById('galleryDots');
    const slides = track ? track.querySelectorAll('.gallery-slide') : [];
    let current = 0;
    let autoTimer;

    function buildDots() {
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
            btn.addEventListener('click', () => { galleryGoTo(i); resetAuto(); });
            dotsWrap.appendChild(btn);
        });
    }

    function updateDots() {
        dotsWrap.querySelectorAll('.gallery-dot').forEach((d, i) => {
            d.classList.toggle('active', i === current);
        });
    }

    function galleryGoTo(n) {
        current = (n + slides.length) % slides.length;
        track.style.transform = 'translateX(-' + current * 100 + '%)';
        updateDots();
    }

    window.galleryMove = function (dir) {
        galleryGoTo(current + dir);
        resetAuto();
    };

    function startAuto() {
        autoTimer = setInterval(() => galleryGoTo(current + 1), 6000);
    }

    function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
    }

    if (slides.length > 0) {
        buildDots();
        startAuto();
    }
})();
var arr = ["/images/amc/aditya_birla_new.png",
    "/images/amc/axis.png",
    "/images/amc/baroda_pioneer.png",
    "/images/amc/bnp_paribas.png",
    "/images/amc/boi_axa.png",
    "/images/amc/canara_robeco.png",
    "/images/amc/dsp.png",
    "/images/amc/edelweiss.png",
    "/images/amc/franklin.png",
    "/images/amc/hdfc_new.png",
    "/images/amc/hsbc_new.png",
    "/images/amc/icici_new.png",
    "/images/amc/idbi.png",
    "/images/amc/idfc.png",
    "/images/amc/iifl_new.png",
    "/images/amc/indiabulls.png",
    "/images/amc/invesco.png",
    "/images/amc/iti.png",
    "/images/amc/jm_financial.png",
    "/images/amc/kotak_mahindra_new.png",
    "/images/amc/larsen_turbo_new.png",
    "/images/amc/lic.png",
    "/images/amc/mahindra.png",
    "/images/amc/mirae_asset.png",
    "/images/amc/motilal_oswal.png",
    "/images/amc/navi.png",
    "/images/amc/nippon_india.png",
    "/images/amc/nj.png",
    "/images/amc/pgim.png",
    "/images/amc/ppfas.png",
    "/images/amc/quant.png",
    "/images/amc/quantum.png",
    "/images/amc/samco.png",
    "/images/amc/sbi.png",
    "/images/amc/shriram_new.png",
    "/images/amc/Star_Health_and_Allied_Insurance.svg.png",
    "/images/amc/sundaram.png",
    "/images/amc/tata.png",
    "/images/amc/taurus.png",
    "/images/amc/trust.png",
    "/images/amc/union.png",
    "/images/amc/uti.png",
    "/images/amc/whiteoak.png"]


arr.forEach((item) => {
    console.log('<div><img src="' + item + '"' + ' alt="' + item + '"' + "></div>");
})


// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('nav-links');
    nav.classList.toggle('active');
}

// SIP Modal Toggle
const modal = document.getElementById('sipModal');
const medimodal = document.getElementById('mediModal');

function openModal() {
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}
function openMediModal() {
    medimodal.style.display = 'flex';
}

function closeMediModal() {
    medimodal.style.display = 'none';
}
// Close Modal on Outside Click
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Testimonial Rotation
// let currentTestimonial = 0;
// const items = document.querySelectorAll('.testimonial-item');
//
// function rotateTestimonials() {
//     items[currentTestimonial].classList.remove('active');
//     currentTestimonial = (currentTestimonial + 1) % items.length;
//     items[currentTestimonial].classList.add('active');
// }
//
// if (items.length > 0) {
//     setInterval(rotateTestimonials, 5000);
// }
//
// let currentSlide = 0;
// let isPaused = false;
// const slides = document.querySelectorAll('.t-slide');
// const pauseBtn = document.getElementById('pause-btn');
//
// // Main Slider Function
// function showSlide(index) {
//     slides.forEach(slide => slide.classList.remove('active'));
//
//     // Boundary checks
//     if (index >= slides.length) currentSlide = 0;
//     else if (index < 0) currentSlide = slides.length - 1;
//     else currentSlide = index;
//
//     slides[currentSlide].classList.add('active');
// }
//
// function nextSlide() {
//     showSlide(currentSlide + 1);
// }
//
// function prevSlide() {
//     showSlide(currentSlide - 1);
// }
//
// // Timer Logic
// let slideInterval = setInterval(nextSlide, 7000); // 7 seconds per slide
//
// function togglePause() {
//     isPaused = !isPaused;
//     if (isPaused) {
//         clearInterval(slideInterval);
//         pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
//         pauseBtn.style.background = 'var(--emerald)';
//     } else {
//         slideInterval = setInterval(nextSlide, 7000);
//         pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
//         pauseBtn.style.background = 'var(--navy)';
//     }
// }
//
// // Optional: Stop video if user navigates away from the slide
// function stopVideo() {
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(i => {
//         const source = i.src;
//         i.src = source; // Resets the iframe/stops video
//     });
// }


let slideIndex = 0;
let autoPlayActive = true;
let slideTimer;

const slides = document.querySelectorAll('.t-slide');
const pauseBtn = document.getElementById('pauseBtn');

function initSlider() {
    if (slides.length <= 1) {
        // If 1 slide, hide controls and stop interval
        document.querySelector('.t-controls').style.display = 'none';
        return;
    }
    startTimer();
}

function showSlides(n) {
    // Correctly handle the wrap-around (Infinite Loop)
    slideIndex = (n + slides.length) % slides.length;

    slides.forEach(slide => {
        slide.classList.remove('active');
        // Stop any playing videos in background iframes
        const iframe = slide.querySelector('iframe');
        if (iframe) {
            const src = iframe.src;
            iframe.src = src;
        }
    });

    slides[slideIndex].classList.add('active');
}

function moveSlide(n) {
    showSlides(slideIndex + n);
    resetTimer(); // Reset auto-play when user manually clicks
}

function startTimer() {
    slideTimer = setInterval(() => {
        moveSlide(1);
    }, 10000); // 8 seconds per slide
}

function resetTimer() {
    if (autoPlayActive) {
        clearInterval(slideTimer);
        startTimer();
    }
}

function toggleAutoPlay() {
    if (autoPlayActive) {
        clearInterval(slideTimer);
        pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        startTimer();
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    autoPlayActive = !autoPlayActive;
}

// Kick it off
initSlider();


function toggleFaq(btn) {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');
 
    /* close all */
    document.querySelectorAll('.faq-q.open').forEach(b => {
        b.classList.remove('open');
        b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
    });
 
    /* open clicked one if it was closed */
    if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
    }
}