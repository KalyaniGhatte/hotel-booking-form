const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progress = document.querySelector(".progress");
const form = document.getElementById("bookingForm");

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const adults = document.getElementById("adults");
const children = document.getElementById("children");
const summary = document.getElementById("summary");

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");

const bookingHistory = document.getElementById("bookingHistory");
const historyContent = document.getElementById("historyContent");
const closeHistory = document.getElementById("closeHistory");
const viewBookingsBtn = document.getElementById("viewBookingsBtn");

let discountPercent = 0;
let currentStep = 0;
// ---------------- ROOM SELECTION ----------------
const roomCards = document.querySelectorAll(".room-card");
let selectedRoomPrice = 0;
let selectedRoomName = "";


const livePrice = document.getElementById("livePrice");

roomCards.forEach(card => {
    card.addEventListener("click", () => {

        roomCards.forEach(c => c.classList.remove("selected"));

        card.classList.add("selected");

        selectedRoomPrice = parseInt(card.dataset.price);
        selectedRoomName = card.querySelector("h3").innerText;

        // Animate live price display
        livePrice.innerHTML = `
            <strong>${selectedRoomName}</strong><br>
            ₹${selectedRoomPrice} per night`;
        livePrice.style.transform = "scale(1.05)";
        setTimeout(() => {
            livePrice.style.transform = "scale(1)";
        }, 200);
    });
});


/* ---------------- DATE RESTRICTION ---------------- */

// Prevent past dates
let today = new Date().toISOString().split("T")[0];
checkin.setAttribute("min", today);

// Update checkout minimum when checkin changes
checkin.addEventListener("change", () => {
    checkout.setAttribute("min", checkin.value);
});

/* ---------------- STEP NAVIGATION ---------------- */

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        if (!validateStep()) return;

        steps[currentStep].classList.remove("active");
        currentStep++;
        steps[currentStep].classList.add("active");
        updateProgress();

        if (currentStep === 4) {
            generateSummary();
        }
    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        steps[currentStep].classList.remove("active");
        currentStep--;
        steps[currentStep].classList.add("active");
        updateProgress();
    });
});

function updateProgress() {
    let percent = ((currentStep + 1) / steps.length) * 100;
    progress.style.width = percent + "%";
}

/* ---------------- VALIDATION ---------------- */

function validateStep() {

    if (currentStep === 0) {
        if (!checkin.value || !checkout.value) {
            alert("Please select both dates.");
            return false;
        }

        if (checkout.value <= checkin.value) {
            alert("Checkout must be after Check-in date.");
            return false;
        }
    }

    if (currentStep === 2) {
        if (!selectedRoomPrice) {
            alert("Please select a room type.");
            return false;
        }
    }

    if (currentStep === 1) {
        if (adults.value < 1) {
            alert("At least 1 adult is required.");
            return false;
        }
    }

    if (currentStep === 3) {

        if (customerName.value.trim() === "") {
            alert("Please enter your name.");
            return false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

        if (!emailPattern.test(customerEmail.value)) {
            alert("Please enter valid email.");
            return false;
        }

        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(customerPhone.value)) {
            alert("Enter valid 10-digit phone number.");
            return false;
        }
    }

    return true;
}

/* ---------------- SUMMARY ---------------- */

function generateSummary() {

    let nights = calculateNights();
    let total = nights * selectedRoomPrice;
    let discountAmount = total * discountPercent / 100;
    let finalTotal = total - discountAmount;

    summary.innerHTML = `
    <p><strong>Name:</strong> ${customerName.value}</p>
    <p><strong>Email:</strong> ${customerEmail.value}</p>
    <p><strong>Phone:</strong> ${customerPhone.value}</p>
        <p><strong>Check-in:</strong> ${checkin.value}</p>
        <p><strong>Check-out:</strong> ${checkout.value}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Room:</strong> ${selectedRoomName}</p>
        <p><strong>Total Price:</strong> ₹${total}</p>
        ${discountPercent > 0 ? `<p style="color:#1cc88a;"><strong>Discount (${discountPercent}%):</strong> -₹${discountAmount}</p>` : ""}
        <p><strong>Final Price:</strong> ₹${finalTotal}</p>
    `;
}
function calculateNights() {
    let start = new Date(checkin.value);
    let end = new Date(checkout.value);
    let diff = end - start;
    return diff / (1000 * 60 * 60 * 24);
}

/* ---------------- FINAL SUBMIT ---------------- */

/*if (form) {
    form.addEventListener("submit", function (e) {

        e.preventDefault();   // Stop page reload
        e.stopPropagation();  // Extra safety

        saveBooking();

        document.getElementById("successModal").classList.add("active");

        return false; // Extra safety
    });
}*/

function closeModal() {
    document.getElementById("successModal").classList.remove("active");

    // Reset form
    form.reset();

    // Reset step to 0
    currentStep = 0;

    steps.forEach(step => step.classList.remove("active"));
    steps[0].classList.add("active");

    // Reset progress bar
    updateProgress();

    // Hide booking history if open
    bookingHistory.style.display = "none";
}
const applyCoupon = document.getElementById("applyCoupon");
const couponInput = document.getElementById("couponInput");
const discountMessage = document.getElementById("discountMessage");

applyCoupon.addEventListener("click", () => {

    const code = couponInput.value.trim().toUpperCase();

    if (code === "HOTEL10") {
        discountPercent = 10;
    }
    else if (code === "NEWUSER20") {
        discountPercent = 20;
    }
    else if (code === "LUXURY30") {
        discountPercent = 30;
    }
    else {
        discountPercent = 0;
    }

    if (discountPercent > 0) {
        discountMessage.innerText = `🎉 ${discountPercent}% discount applied!`;
        discountMessage.style.color = "#074b32";
    } else {
        discountMessage.innerText = "❌ Invalid coupon code.";
        discountMessage.style.color = "red";
    }

    generateSummary(); // Update summary with discount
});

const showCoupon = document.getElementById("showCoupon");
const couponBox = document.getElementById("couponBox");

if (showCoupon && couponBox) {

    couponBox.style.display = "none";

    showCoupon.addEventListener("click", () => {

        if (couponBox.style.display === "none") {
            couponBox.style.display = "flex";
            showCoupon.innerText = "Hide coupon code";
        } else {
            couponBox.style.display = "none";
            showCoupon.innerText = "Have a coupon code?";
        }

    });
}

const showOffers = document.getElementById("showOffers");
const offersBox = document.getElementById("offersBox");

showOffers.addEventListener("click", () => {
    if (offersBox.style.display === "none") {
        offersBox.style.display = "block";
        showOffers.innerText = "Hide Offers";
    } else {
        offersBox.style.display = "none";
        showOffers.innerText = "View Available Offers";
    }
});

// -------- COUPON AUTO SUGGESTION --------

const coupons = ["HOTEL10", "NEWUSER20", "LUXURY30"];
const suggestionsBox = document.getElementById("couponSuggestions");

couponInput.addEventListener("input", () => {

    const value = couponInput.value.toUpperCase();
    suggestionsBox.innerHTML = "";

    if (value === "") {
        suggestionsBox.style.display = "none";
        return;
    }

    const filtered = coupons.filter(code => code.startsWith(value));

    if (filtered.length > 0) {
        suggestionsBox.style.display = "block";

        filtered.forEach(code => {
            const div = document.createElement("div");
            div.textContent = code;

            div.addEventListener("click", () => {
                couponInput.value = code;
                suggestionsBox.style.display = "none";
            });

            suggestionsBox.appendChild(div);
        });
    } else {
        suggestionsBox.style.display = "none";
    }
});

// -------- SAVE BOOKING TO LOCAL STORAGE --------
function calculateFinalPrice() {
    let nights = calculateNights();
    let total = nights * selectedRoomPrice;
    let discountAmount = total * discountPercent / 100;
    return total - discountAmount;
}
function saveBooking() {

    const booking = {
        name: customerName.value,
        email: customerEmail.value,
        phone: customerPhone.value,
        checkin: checkin.value,
        checkout: checkout.value,
        room: selectedRoomName,
        total: calculateFinalPrice(),
        date: new Date().toLocaleString()
    };

    let bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];

    bookings.push(booking);

    localStorage.setItem("hotelBookings", JSON.stringify(bookings));
}

// -------- DISPLAY BOOKINGS --------


if (viewBookingsBtn) {
    viewBookingsBtn.addEventListener("click", () => {

        let bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];

        if (bookings.length === 0) {
            historyContent.innerHTML = "<p>No bookings found.</p>";
        } else {
       historyContent.innerHTML = bookings.slice().reverse().map((b,index) => {

    const realIndex = bookings.length - 1 - index;

    return `
    <div style="
        background: rgba(255,255,255,0.2);
        padding:10px;
        margin-bottom:10px;
        border-radius:8px;
        color:white;">
        
        <p><strong>Name:</strong> ${b.name}</p>
        <p><strong>Room:</strong> ${b.room}</p>
        <p><strong>Check-in:</strong> ${b.checkin}</p>
        <p><strong>Total:</strong> ₹${b.total}</p>
        <p style="font-size:12px;">Booked on: ${b.date}</p>

        <button onclick="deleteBooking(${realIndex})"
        style="background:red;margin-top:5px;">
        Delete
        </button>

    </div>
    `;
}).join("");
        }

        bookingHistory.style.display = "block";
    });
}
if (closeHistory) {
    closeHistory.addEventListener("click", () => {
        bookingHistory.style.display = "none";
    });
}
const confirmBtn = document.getElementById("confirmBtn");

if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
        saveBooking();
        document.getElementById("successModal").classList.add("active");
    });
}
function deleteBooking(index){

    let bookings = JSON.parse(localStorage.getItem("hotelBookings")) || [];

    bookings.splice(index,1);

    localStorage.setItem("hotelBookings", JSON.stringify(bookings));

    viewBookingsBtn.click(); // refresh booking list
}