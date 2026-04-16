// script.js - AGC Interactions

document.addEventListener('DOMContentLoaded', () => {

    // 1. Sticky Navbar
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // 3. Hero Slider Auto-play and manual controls
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');
    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    const goToSlide = (index) => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        resetInterval();
    };

    const nextSlide = () => {
        let index = currentSlide + 1;
        if (index >= slides.length) index = 0;
        goToSlide(index);
    };

    const prevSlide = () => {
        let index = currentSlide - 1;
        if (index < 0) index = slides.length - 1;
        goToSlide(index);
    };

    const startInterval = () => {
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds
    };

    const resetInterval = () => {
        clearInterval(slideInterval);
        startInterval();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    startInterval();

    // 4. Smooth Scroll for Back To Top
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    // 5. Registration Form Logic (Dynamic Select + LocalStorage)
    const categorySelect = document.getElementById('courseCategory');
    const courseSelect = document.getElementById('courseName');
    const form = document.getElementById('admissionForm');
    const formAlert = document.getElementById('formAlert');

    const courseMapping = {
        engineering: ["B.Tech Computer Science", "B.Tech Civil", "B.Tech Mechanical", "B.Tech AI & Data Science", "M.Tech CSE"],
        pharmacy: ["B.Pharmacy", "D.Pharmacy", "M.Pharmacy"],
        management: ["BBA", "MBA", "B.Com", "M.Com"],
        paramedical: ["B.Sc Medical Lab Science", "B.Sc Nutrition & Dietetics", "Radiology"],
        law: ["BA.LLB", "LLB"]
    };

    categorySelect.addEventListener('change', function() {
        const selected = this.value;
        const courses = courseMapping[selected];
        
        // Reset course select
        courseSelect.innerHTML = '<option value="" disabled selected>Select Course *</option>';
        
        if (courses) {
            courseSelect.disabled = false;
            courses.forEach(course => {
                const opt = document.createElement('option');
                opt.value = course;
                opt.textContent = course;
                courseSelect.appendChild(opt);
            });
        } else {
            courseSelect.disabled = true;
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic Validation
        const name = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const category = categorySelect.value;
        const course = courseSelect.value;
        const dob = document.getElementById('dob').value;
        
        if (!name || !email || !mobile || !category || !course) {
            showAlert('Please fill in all required fields.', 'error');
            return;
        }

        // Store Data in localStorage
        const formData = {
            id: Date.now(),
            name, email, mobile, 
            whatsapp: document.getElementById('whatsapp').value,
            dob, category, course,
            date: new Date().toLocaleDateString()
        };

        let submissions = JSON.parse(localStorage.getItem('agc_registrations') || '[]');
        submissions.push(formData);
        localStorage.setItem('agc_registrations', JSON.stringify(submissions));

        showAlert('Application submitted successfully! Our counselor will contact you soon.', 'success');
        form.reset();
        courseSelect.disabled = true;
    });

    function showAlert(msg, type) {
        formAlert.textContent = msg;
        formAlert.className = `form-alert ${type}`;
        setTimeout(() => {
            formAlert.classList.add('d-none');
        }, 5000);
    }

    // 6. Number Counter Animation using Intersection Observer
    const counters = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const runCountAnimation = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (target > 1000 ? '+' : '');
                }
            };
            updateCounter();
        });
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            runCountAnimation();
            hasCounted = true;
        }
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if(statsSection) {
        observer.observe(statsSection);
    }
});
