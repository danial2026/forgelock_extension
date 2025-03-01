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
  specialCharsToggle.checked = true;
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
    const strings = Array.from(
      document.querySelectorAll("#textFieldsContainer input")
    )
      .map((field) => field.value)
      .filter((value) => value.length > 0);

    const numbers = Array.from(
      document.querySelectorAll("#numberFieldsContainer input")
    )
      .map((field) => field.value)
      .filter((value) => value.length > 0);

    // Convert dates to UTC midnight Date objects
    const dates = Array.from(
      document.querySelectorAll("#dateFieldsContainer input")
    )
      .map((field) => {
        const date = new Date(field.value);
        return new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
      })
      .filter((value) => value instanceof Date && !isNaN(value));

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

document.addEventListener("DOMContentLoaded", function () {
  // Add field functionality
  const addButtons = document.querySelectorAll(".add-button");

  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const fieldType = this.getAttribute("data-field-type");
      addNewField(fieldType);
    });
  });

  function createRemoveButton() {
    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.innerHTML = "-";
    return removeButton;
  }

  function addNewField(fieldType) {
    const container = document.getElementById(`${fieldType}FieldsContainer`);
    const fieldCount = container.children.length + 1;

    // Create wrapper div for field and remove button
    const fieldContainer = document.createElement("div");
    fieldContainer.className = "field-container";

    let newField;
    switch (fieldType) {
      case "text":
        newField = document.createElement("input");
        newField.type = "text";
        newField.className = "text-field";
        newField.placeholder = `${fieldCount}${getOrdinalSuffix(
          fieldCount
        )} word or phrase`;
        break;
      case "date":
        newField = document.createElement("input");
        newField.type = "date";
        newField.className = "text-field";
        // Set to UTC midnight for today
        const now = new Date();
        const utcDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
        );
        newField.value = utcDate.toISOString().split("T")[0];
        newField.setAttribute("aria-label", `Date field ${fieldCount}`);
        // Add change listener to normalize to UTC midnight
        newField.addEventListener("change", function () {
          const date = new Date(this.value);
          const utc = new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
          );
          this.value = utc.toISOString().split("T")[0];
        });
        break;
      case "number":
        newField = document.createElement("input");
        newField.type = "number";
        newField.className = "text-field";
        newField.placeholder = `${fieldCount}${getOrdinalSuffix(
          fieldCount
        )} number`;
        break;
    }

    // Create remove button
    const removeButton = createRemoveButton();
    removeButton.addEventListener("click", function () {
      fieldContainer.remove();
      updatePlaceholders(container, fieldType);
    });

    // Add field and button to container
    fieldContainer.appendChild(newField);
    // Only add remove button for text fields if it's the 4th or later field
    if (fieldType !== "text" || fieldCount > 3) {
      fieldContainer.appendChild(removeButton);
    }
    container.appendChild(fieldContainer);
  }

  function getOrdinalSuffix(number) {
    const j = number % 10;
    const k = number % 100;
    if (j == 1 && k != 11) {
      return "st";
    }
    if (j == 2 && k != 12) {
      return "nd";
    }
    if (j == 3 && k != 13) {
      return "rd";
    }
    return "th";
  }

  // Update the initial fields setup
  const containers = ["textFieldsContainer"]; // Only setup text fields initially
  containers.forEach((containerId) => {
    const container = document.getElementById(containerId);
    const inputs = container.querySelectorAll("input");
    const fieldType = containerId.replace("FieldsContainer", "");

    inputs.forEach((input, index) => {
      const fieldContainer = document.createElement("div");
      fieldContainer.className = "field-container";

      // Get the input's parent
      const parent = input.parentNode;

      // Remove the input from its current position
      parent.removeChild(input);

      // Create remove button
      const removeButton = createRemoveButton();
      removeButton.addEventListener("click", function () {
        fieldContainer.remove();
        updatePlaceholders(container, fieldType);
      });

      // Add input and button to new container
      fieldContainer.appendChild(input);
      // Only add remove button for text fields if it's the 4th or later field
      if (fieldType !== "text" || index > 2) {
        fieldContainer.appendChild(removeButton);
      }
      container.appendChild(fieldContainer);
    });
  });

  // Function to update placeholders after removal
  function updatePlaceholders(container, fieldType) {
    if (fieldType === "text" || fieldType === "number") {
      const inputs = container.querySelectorAll("input");
      inputs.forEach((input, index) => {
        const count = index + 1;
        const suffix = getOrdinalSuffix(count);
        if (fieldType === "text") {
          input.placeholder = `${count}${suffix} word or phrase`;
        } else {
          input.placeholder = `${count}${suffix} number`;
        }
      });
    }
  }

  // Settings menu functionality
  const settingsIcon = document.querySelector(".settings-icon");
  const settingsMenu = document.getElementById("settingsMenu");
  const closeSettings = document.getElementById("closeSettings");

  settingsIcon.addEventListener("click", () => {
    settingsMenu.classList.add("show");
  });

  closeSettings.addEventListener("click", () => {
    settingsMenu.classList.remove("show");
  });
});
