const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");
const progress = document.querySelector(".progress");
const form = document.getElementById("bookingForm");

const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const adults = document.getElementById("adults");
const children = document.getElementById("children");
const roomType = document.getElementById("roomType");
const summary = document.getElementById("summary");

let currentStep = 0;

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

        if (currentStep === 3) {
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
        if (!roomType.value) {
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

    return true;
}

/* ---------------- SUMMARY ---------------- */

function generateSummary() {

    let nights = calculateNights();
    let pricePerNight = parseInt(roomType.value);
    let total = nights * pricePerNight;

    summary.innerHTML = `
        <p><strong>Check-in:</strong> ${checkin.value}</p>
        <p><strong>Check-out:</strong> ${checkout.value}</p>
        <p><strong>Nights:</strong> ${nights}</p>
        <p><strong>Adults:</strong> ${adults.value}</p>
        <p><strong>Children:</strong> ${children.value}</p>
        <p><strong>Total Price:</strong> ₹${total}</p>
    `;
}

function calculateNights() {
    let start = new Date(checkin.value);
    let end = new Date(checkout.value);
    let diff = end - start;
    return diff / (1000 * 60 * 60 * 24);
}

/* ---------------- FINAL SUBMIT ---------------- */

form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("🎉 Booking Confirmed Successfully!");
    location.reload();
});