let pageUrls = {
    about: '/index.html?about',
    contact: '/index.html?contact'
};

// Global variable to track if reCAPTCHA is loaded
let recaptchaReady = false;

function OnStartUp() {
    // Load reCAPTCHA script dynamically
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    popStateHandler();
}

// reCAPTCHA load callback
function onRecaptchaLoad() {
    recaptchaReady = true;
    // Re-render contact page if it's active to initialize captcha
    if (window.location.href.includes('contact')) {
        RenderContactPage();
    }
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', (event) => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">About Me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">Contact with me</h1>
    <form id="contact-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="message">Message:</label>
        <textarea id="message" name="message" required></textarea>
        <div id="recaptcha-container"></div>
        <div class="error" id="captchaError" style="color:red;"></div>
        <button type="submit">Submit</button>
    </form>`;
    
    // Initialize reCAPTCHA if it's ready
    if (recaptchaReady && typeof grecaptcha !== 'undefined') {
        grecaptcha.render('recaptcha-container', {
            'sitekey': '6Les03ErAAAAAD0_FS39nH7CSDJHvA9pjMrP-FB8',
            'theme': 'light'
        });
    }
    
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!recaptchaReady || typeof grecaptcha === 'undefined') {
            document.getElementById('captchaError').textContent = "CAPTCHA not loaded yet. Please try again.";
            return;
        }
        
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
            document.getElementById('captchaError').textContent = "Please complete the CAPTCHA!";
            return;
        }
        
        document.getElementById('captchaError').textContent = "";
        alert("Form submitted successfully!");
        this.reset();
        grecaptcha.reset();
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
    <h1>Photo Gallery</h1>
    <div class="gallery">
        <img src="images/image1.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image2.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image3.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image4.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image5.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image6.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image7.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image8.jpg" loading="lazy" onclick="openModal(this.src)">
        <img src="images/image9.jpg" loading="lazy" onclick="openModal(this.src)">
    </div>
    <div class="modal" id="modal" onclick="closeModal()">
        <span class="close" onclick="closeModal()">&times;</span>
        <img id="modalImg">
    </div>`;
}

function openModal(src) {
    document.getElementById('modal').style.display = 'block';
    document.getElementById('modalImg').src = src;
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    if (loc.includes('contact')) { RenderContactPage(); }
    if (loc.includes('about')) { RenderAboutPage(); }
    if (loc.includes('gallery')) { RenderGalleryPage(); }
}

window.onpopstate = popStateHandler;