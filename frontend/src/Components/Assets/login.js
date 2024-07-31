document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("beforeunload", function(event) {
    window.location.href = "index.html";
  });
});