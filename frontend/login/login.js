document.getElementById("btnRegister").onclick = async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username) return showMsg("Username required");
  if (!password) return showMsg("Password required");

  try {
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "../home/index.html";
    } else {
      showMsg(data.message);
    }
  } catch (err) {
    console.error(err);
    showMsg("Failed to register. Try again.");
  }
};

document.getElementById("btnLogin").onclick = async() => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username) return showMsg("Username required");
  if (!password) return showMsg("Password required");

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "../home/index.html";
    } else {
      showMsg(data.message);
    }
  } catch (err) {
    console.error(err);
    showMsg("Failed to login. Try again.");
  }
};

function showMsg(msg) {
  document.getElementById("msg").textContent = msg;
}
