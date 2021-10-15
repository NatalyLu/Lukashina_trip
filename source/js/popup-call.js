(function () {
  let popupCall = document.querySelector("#popup-call");
  let callbackForm = document.querySelector("#callback-form");
  let targetItems = document.querySelectorAll(".button-callback");

  [].slice.call(targetItems).forEach(item => {
    item.addEventListener("click", (evt) => {
      evt.preventDefault();
      openPopup(evt, popupCall);
    });
  });

  [].slice.call(targetItems).forEach(item => {
    item.addEventListener("keydown", (evt) => {
      if (evt.keyCode === window.util.ENTER_KEYCODE) {
        openPopup(evt, popupCall);
      }
    });
  });

  addSubmitAction(popupCall);
  addSubmitAction(callbackForm);
})();
