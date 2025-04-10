function validateForm() {
    let isValid = true;
    // Reset all error messages and styles
    clearErrors();

    // Full Name Validation
    const name = document.getElementById("full-name");
    if (!name.value.match(/[A-Za-z\s]+/)) {
        document.getElementById("name-error").textContent = "Please enter a valid name (letters only).";
        isValid = false;
    }

    // Email Validation
    const email = document.getElementById("email");
    if (!email.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[com]{3}$/)) {
        document.getElementById("email-error").textContent = "Please enter a valid email address.";
        isValid = false;
    }

    // Phone Number Validation
    const phone = document.getElementById("phone");
    if (!phone.value.match(/^\d{11}$/)) {
        document.getElementById("phone-error").textContent = "Please enter a valid 10-digit phone number.";
        isValid = false;
    }

    // Address Validation
    const address = document.getElementById("address");
    if (address.value.trim() === "") {
        document.getElementById("address-error").textContent = "Address is required.";
        isValid = false;
    }

    // Credit Card Number Validation
    const cardNumber = document.getElementById("card-number");
    if (!cardNumber.value.match(/^\d{16}$/)) {
        document.getElementById("card-number-error").textContent = "Please enter a valid 16-digit credit card number.";
        isValid = false;
    }

    // Expiry Date Validation
    const expiryDate = document.getElementById("expiry-date");
    const today = new Date();
    const selectedDate = new Date(expiryDate.value + "-01"); // Create a date object from the month
    if (selectedDate <= today) {
        document.getElementById("expiry-date-error").textContent = "Please select a future expiry date.";
        isValid = false;
    }

    // CVV Validation
    const cvv = document.getElementById("cvv");
    if (!cvv.value.match(/^\d{3}$/)) {
        document.getElementById("cvv-error").textContent = "Please enter a valid 3-digit CVV.";
        isValid = false;
    }

    return isValid;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach(function (message) {
        message.textContent = "";
    });

    const invalidInputs = document.querySelectorAll("input:invalid");
    invalidInputs.forEach(function (input) {
        input.style.borderColor = "red";
    });

    const validInputs = document.querySelectorAll("input:valid");
    validInputs.forEach(function (input) {
        input.style.borderColor = "green";
    });
}
