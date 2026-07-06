// Protect the dashboard page.
// If the user is not logged in, send them back to the login page.
if (sessionStorage.getItem("loggedIn") !== "true") {
  window.location.replace("login.html");
}

const username = sessionStorage.getItem("username") || "User";
const usernameText = document.getElementById("usernameText");

if (usernameText) {
  usernameText.textContent = username;
}

function logout() {
  sessionStorage.removeItem("loggedIn");
  sessionStorage.removeItem("username");
  window.location.href = "login.html";
}

document.getElementById("logoutBtn")?.addEventListener("click", logout);
document.getElementById("logoutTopBtn")?.addEventListener("click", logout);

document.getElementById("profileBtn")?.addEventListener("click", function () {
  alert("Profile section coming soon.");
});

document.getElementById("settingsBtn")?.addEventListener("click", function () {
  alert("Settings section coming soon.");
});

document.getElementById("viewProfileBtn")?.addEventListener("click", function () {
  alert("User profile clicked.");
});

document.getElementById("openSettingsBtn")?.addEventListener("click", function () {
  alert("Settings clicked.");
});
