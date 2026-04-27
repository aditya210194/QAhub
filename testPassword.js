const bcrypt = require("bcryptjs");

const hashedPassword = "$2a$10$L.SqtOQXRJTGArBP4MjPlOht7t6ilAsR5tlr0iKqa9XKKPlkcfJZG"; // From MongoDB
const enteredPassword = "123456789"; // The password user enters

bcrypt.compare(enteredPassword, hashedPassword, (err, result) => {
    if (err) console.log("Error:", err);
    console.log("Password Match:", result);
});