// Get DOM elements
const lengthSlider = document.getElementById("lengthSlider");
const lengthValue = document.getElementById("lengthValue");
const specialCharsToggle = document.getElementById("specialChars");
const generateBtn = document.querySelector(".generate-btn");
const resetBtn = document.querySelector(".reset-btn");
const textFields = document.querySelectorAll(".text-field");
const snackbar = document.getElementById("snackbar");

function showSnackbar(message) {
  // Remove any existing show class first
  snackbar.classList.remove("show");

  // Force a reflow to restart animation
  void snackbar.offsetWidth;

  // Update message and show
  snackbar.textContent = message;
  snackbar.classList.add("show");

  // Remove show class after animation
  setTimeout(() => {
    snackbar.classList.remove("show");
  }, 3000);
}

// Initialize event listeners
// Update length value display
lengthSlider.addEventListener("input", (e) => {
  lengthValue.textContent = e.target.value;
});

// Reset functionality
resetBtn.addEventListener("click", () => {
  lengthSlider.value = 16;
  lengthValue.textContent = "16";
  specialCharsToggle.checked = false;
  textFields.forEach((field) => {
    field.value = "";
  });
});

// Add this function for clipboard operations
async function copyToClipboard(text) {
  try {
    // Try using the Clipboard API first
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    try {
      // Fallback: Create temporary textarea
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      // Execute copy command
      document.execCommand("copy");
      textArea.remove();
      return true;
    } catch (err2) {
      console.error("Failed to copy text:", err2);
      return false;
    }
  }
}

// Update the generate button click handler
generateBtn.addEventListener("click", async () => {
  try {
    const strings = Array.from(textFields)
      .map((field) => field.value)
      .filter((value) => value.length > 0);

    const numbers = []; // Add number field handling here
    const dates = []; // Add date field handling here

    console.log("Generating password with:", {
      strings,
      numbers,
      dates,
      hasSpecialChars: specialCharsToggle.checked,
      length: parseInt(lengthSlider.value),
    });

    const password = await generateUltraSecurePassword(
      strings,
      numbers,
      dates,
      specialCharsToggle.checked,
      parseInt(lengthSlider.value)
    );

    console.log("Generated password:", password);

    // Try to copy to clipboard
    const copied = await copyToClipboard(password);

    // Show appropriate message
    if (copied) {
      showSnackbar("Password copied to clipboard!");
      generateBtn.textContent = "Copied!";
    } else {
      showSnackbar("Password generated but couldn't copy to clipboard");
      generateBtn.textContent = "Done!";
    }

    setTimeout(() => {
      generateBtn.textContent = "Generate Password";
    }, 2000);
  } catch (error) {
    console.error("Password generation failed:", error);
    showSnackbar("Error generating password!");
    generateBtn.textContent = "Error!";
    setTimeout(() => {
      generateBtn.textContent = "Generate Password";
    }, 2000);
  }
});
