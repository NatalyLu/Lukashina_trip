(function () {
  let popup = document.getElementById("popup-call");
  let targetItems = document.querySelectorAll(".button-callback");
  let fields = popup.querySelectorAll(".form__field");

  console.log(targetItems);

  [].slice.call(targetItems).forEach(item => {
    item.addEventListener("click", (evt) => {
      evt.preventDefault();
      openPopup(evt, popup);
    });
  });

  [].slice.call(targetItems).forEach(item => {
    item.addEventListener("keydown", (evt) => {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        openPopup(evt, popup);
      }
    });
  });

  [].slice.call(fields).forEach(field => {
    field.addEventListener("input", () => {
      if (field.classList.contains("error")) {
        removeError(field);
      }
    });
  });

  popup.querySelector(".form").addEventListener("submit", (evt) => {
    evt.preventDefault();
    sendFormData(evt, popup, "/action");
  });
})();
