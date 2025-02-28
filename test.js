import { generateUltraSecurePassword } from "./password_generator.js";

const password = await generateUltraSecurePassword(
  ["", "", ""],
  [],
  [],
  true,
  16
);
console.log("3/3n[[^9Nd;t*;5#");
console.log(password);
console.log("3/3n[[^9Nd;t*;5#" == password);
console.log("--------------------------------");

const password2 = await generateUltraSecurePassword(
  [" ", " ", " "],
  [],
  [],
  true,
  16
);
console.log("W%0tu_?3X[[s1i8%");
console.log(password2);
console.log("W%0tu_?3X[[s1i8%" == password2);
console.log("--------------------------------");

const password3 = await generateUltraSecurePassword(
  ["12", "12", "12"],
  [],
  [],
  false,
  58
);
console.log("Y668E8990y2I7116036C42T544pj9S692022ZqG2277WX7B1551z4AJ35e");
console.log(password3);
console.log(
  "Y668E8990y2I7116036C42T544pj9S692022ZqG2277WX7B1551z4AJ35e" == password3
);
console.log("--------------------------------");

const password4 = await generateUltraSecurePassword(
  ["1", "2", "3"],
  [],
  [],
  false,
  58
);
console.log("212499Y67s041k69qK02291955Fx588Vlri2VcBu066ly4u5D31gO4770d");
console.log(password4);
console.log(
  "212499Y67s041k69qK02291955Fx588Vlri2VcBu066ly4u5D31gO4770d" == password4
);
console.log("--------------------------------");

const password5 = await generateUltraSecurePassword(
  ["1", "2", "3"],
  [1],
  [],
  false,
  58
);
console.log("Q080H9L3622hTv93FyL5517i66555j9T03668B8m466900Rg775x1o5531");
console.log(password5);
console.log(
  "Q080H9L3622hTv93FyL5517i66555j9T03668B8m466900Rg775x1o5531" == password5
);
console.log("--------------------------------");

const password6 = await generateUltraSecurePassword(
  ["1", "2", "3"],
  [1, 2],
  [],
  false,
  58
);
console.log("K402E0M6r00vW332aE1c803pO0Sf5A6W0cI25849955977Lk4415f7992q");
console.log(password6);
console.log(
  "K402E0M6r00vW332aE1c803pO0Sf5A6W0cI25849955977Lk4415f7992q" == password6
);
console.log("--------------------------------");

const password7 = await generateUltraSecurePassword(
  ["1", "2", "3"],
  [],
  [new Date("2025-02-28T00:00:00.000Z")],
  false,
  58
);
console.log("K14488S6z33PE664AY7776ZiW0855c2jzzm28W4y000AH1T80007c9B375");
console.log(password7);
console.log(
  "K14488S6z33PE664AY7776ZiW0855c2jzzm28W4y000AH1T80007c9B375" == password7
);
console.log("--------------------------------");

const password8 = await generateUltraSecurePassword(
  ["1", "2", "3"],
  [],
  [new Date("2025-02-28T00:00:00.000Z")],
  true,
  58
);
console.log("K}448!S6z~~PE66!AY7))6ZiW&855c:jzzm-{W4y->0AH}T[00&=c9B?7~");
console.log(password8);
console.log(
  "K}448!S6z~~PE66!AY7))6ZiW&855c:jzzm-{W4y->0AH}T[00&=c9B?7~" == password8
);
console.log("--------------------------------");