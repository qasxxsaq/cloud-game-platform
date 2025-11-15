const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "../login/login.html";
}

document.getElementById("usernameDisplay").textContent =
    localStorage.getItem("username") || "username";