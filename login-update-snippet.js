// Add this inside your successful login block.
// Example: after checking that the username and password are correct.

sessionStorage.setItem("loggedIn", "true");
sessionStorage.setItem("username", username);
window.location.href = "dashboard.html";
