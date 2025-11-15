document.getElementById("btnRegister").onclick = () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return showMsg("Username required");

  localStorage.setItem("username", username);
  localStorage.setItem("userId", 1); // mock ID

  window.location.href = "../home/home.html";
};

document.getElementById("btnLogin").onclick = () => {
  const username = document.getElementById("username").value.trim();
  if (!username) return showMsg("Username required");

  localStorage.setItem("username", username);
  localStorage.setItem("userId", 1);

  window.location.href = "../home/home.html";
};

function showMsg(msg) {
  document.getElementById("msg").textContent = msg;
}
