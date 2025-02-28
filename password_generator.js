// Constants
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";

// Utility functions for crypto operations
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha384(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-384", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha512(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function generateSalt(strings, numbers, dates) {
  const input =
    strings.join("") +
    numbers.join("") +
    dates.map((d) => d.getTime()).join("");

  // Use Web Crypto API instead of Node's crypto
  const msgBuffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // Convert to base64url format
  const base64 = btoa(String.fromCharCode(...hashArray));
  const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_");
  return base64url.substring(0, 32);
}

async function algorithm1(strings, numbers, dates) {
  const input =
    strings.join("") +
    numbers.join("") +
    dates.map((d) => d.getTime()).join("");

  const salt = await generateSalt(strings, numbers, dates);
  const keyMaterial = new TextEncoder().encode(salt);
  const key = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );

  const msgBuffer = new TextEncoder().encode(input);
  const signature = await crypto.subtle.sign("HMAC", key, msgBuffer);
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex.substring(0, 16);
}

async function algorithm2(strings, numbers, dates) {
  let combined =
    strings.join("") +
    (await generateSalt(strings, numbers, dates)) +
    numbers.join("") +
    dates.map((d) => d.toISOString()).join("");

  // Argon2-inspired multiple mixing rounds
  for (let i = 0; i < 1000; i++) {
    combined = await sha256(combined);
  }
  return combined.substring(0, 16);
}

async function algorithm3(strings, numbers, dates) {
  const input =
    strings.join("") +
    numbers.join("") +
    dates.map((d) => d.getTime()).join("");
  const salt = await generateSalt(strings, numbers, dates);
  const hashBuffer = await crypto.subtle.digest(
    "SHA-384",
    new TextEncoder().encode(input + salt)
  );
  const result = new Uint8Array(hashBuffer);

  // XOR-based mixing
  for (let i = 0; i < result.length - 1; i++) {
    result[i] ^= result[i + 1];
  }

  return btoa(String.fromCharCode(...result)).substring(0, 16);
}

async function algorithm4(strings, numbers, dates) {
  let result = "";
  const input =
    strings.join("") +
    numbers.join("") +
    dates.map((d) => d.toISOString()).join("");

  for (let i = 0; i < 4; i++) {
    const positionSalt =
      (await generateSalt(strings, numbers, dates)) + i.toString();
    const hash = await sha256(input + positionSalt);
    const startPos = (i * 4) % (hash.length - 4);
    result += hash.substring(startPos, startPos + 4);
  }

  return result.substring(0, Math.min(16, result.length));
}

async function algorithm5(strings, numbers, dates) {
  const salt = await generateSalt(strings, numbers, dates);
  const input1 = await sha256(strings.join("") + salt);
  const input2 = await sha512(numbers.join("") + salt);
  const input3 = await sha384(dates.map((d) => d.getTime()).join("") + salt);

  let result = "";
  for (let i = 0; i < 12; i += 3) {
    result += input1[i % input1.length];
    result += input2[i % input2.length];
    result += input3[i % input3.length];
  }

  return result.padEnd(16, "0");
}

async function algorithm6(strings, numbers, dates) {
  let hash = 0;
  const input =
    strings.join("") +
    numbers.join("") +
    dates.map((d) => d.getTime()).join("");

  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash = hash & hash;
  }

  const finalInput =
    hash.toString() + (await generateSalt(strings, numbers, dates)) + input;
  const result = await sha512(finalInput);
  return result.substring(0, 16);
}

async function algorithm7(strings, numbers, dates) {
  const blocks = [
    strings.join(""),
    numbers.join(""),
    dates.map((d) => d.getTime()).join(""),
  ];

  let previousHash = await generateSalt(strings, numbers, dates);
  let result = "";

  for (const block of blocks) {
    previousHash = await sha512(previousHash + block);
    result += previousHash.substring(0, 5);
  }

  return result.substring(0, 16);
}

async function algorithm8(strings, numbers, dates) {
  const salt = await generateSalt(strings, numbers, dates);
  let layer1 = strings.join("") + salt;
  let layer2 = numbers.join("") + salt;
  let layer3 = dates.map((d) => d.getTime()).join("") + salt;

  layer1 = await sha256(layer1);
  layer2 = await sha384(layer2 + layer1);
  layer3 = await sha512(layer3 + layer2);

  const combined = layer1 + layer2 + layer3;
  return combined.substring(0, 16);
}

async function generateUltraSecurePassword(
  strings = [],
  numbers = [],
  dates = [],
  hasSpecialChars = true,
  length = 48
) {
  // Ensure arrays are initialized
  strings = strings || [];
  numbers = numbers || [];
  dates = dates || [];

  // Phase 1: Initial mixing using all algorithms
  const results = await Promise.all([
    algorithm1(strings, numbers, dates),
    algorithm1(strings, numbers, dates),
    algorithm2(strings, numbers, dates),
    algorithm3(strings, numbers, dates),
    algorithm4(strings, numbers, dates),
    algorithm5(strings, numbers, dates),
    algorithm6(strings, numbers, dates),
    algorithm7(strings, numbers, dates),
    algorithm8(strings, numbers, dates),
  ]);

  // Update Phase 2: Complex intermixing to match Dart output patterns
  let masterHash = "";
  for (let i = 0; i < results.length; i++) {
    const nextIndex = (i + 1) % results.length;
    const salt = await generateSalt(strings, numbers, dates);
    const combined = results[i] + salt + results[nextIndex];
    const hash = await sha512(combined);
    masterHash += hash;
  }

  // Phase 3: Character mapping
  const charCodes = [];
  for (let i = 0; i < masterHash.length - 1; i += 2) {
    const value = parseInt(masterHash.substring(i, i + 2), 16);
    charCodes.push(value);
  }

  // Phase 4: Character generation to match Dart patterns
  let password = "";
  for (let i = 0; i < length; i++) {
    const charType = charCodes[i % charCodes.length] % 4;
    const charCode = charCodes[(i + 1) % charCodes.length];

    switch (charType) {
      case 0: // Uppercase
        password += String.fromCharCode(65 + (charCode % 26));
        break;
      case 1: // Lowercase
        password += String.fromCharCode(97 + (charCode % 26));
        break;
      case 2: // Number
        password += charCode % 10;
        break;
      case 3: // Special
        password += hasSpecialChars
          ? SPECIAL_CHARS[charCode % SPECIAL_CHARS.length]
          : charCode % 10;
        break;
    }
  }

  // Phase 5: Final transformation
  let chars = password.split("");
  chars[0] = chars[0].toUpperCase();
  chars[1] = hasSpecialChars
    ? SPECIAL_CHARS[charCodes[0] % SPECIAL_CHARS.length]
    : (charCodes[0] % 10).toString();
  chars[2] = (charCodes[1] % 10).toString();

  // Additional mixing
  for (let i = 3; i < chars.length; i++) {
    if (i % 5 === 0) {
      chars[i] = hasSpecialChars
        ? SPECIAL_CHARS[charCodes[i % charCodes.length] % SPECIAL_CHARS.length]
        : (charCodes[i % charCodes.length] % 10).toString();
    } else if (i % 7 === 0) {
      chars[i] = (charCodes[i % charCodes.length] % 10).toString();
    } else if (i % 3 === 0) {
      chars[i] = i % 6 === 0 ? chars[i].toUpperCase() : chars[i].toLowerCase();
    }
  }

  // Phase 6: Final security measures
  const finalPass = chars.join("");
  const validator = await sha384(
    finalPass + (await generateSalt(strings, numbers, dates))
  );

  if (validator.startsWith("0") && hasSpecialChars) {
    return extraTransform(finalPass, charCodes);
  }

  return finalPass;
}

function extraTransform(password, charCodes) {
  const chars = password.split("");
  for (let i = 0; i < chars.length; i++) {
    if (i % 4 === 0) {
      const specialIndex =
        charCodes[i % charCodes.length] % SPECIAL_CHARS.length;
      chars[i] = SPECIAL_CHARS[specialIndex];
    }
  }
  return chars.join("");
}

// TODO: make sure its commited before pushing
// export { generateUltraSecurePassword };