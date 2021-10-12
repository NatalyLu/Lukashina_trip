(function () {
  let areasTabs = document.querySelector("#areas-tabs");
  let tabsArray = areasTabs.querySelectorAll(".tabs__tab");
  // Собираем карточки, клик по которым будет также переключать табы
  let areasList = document.querySelector("#areas-list");


  let switchArea = (evt) => {
    tabsArray.forEach(item =>{
      item.classList.remove("active");
    });
    // Поиск активного элемента
    // Разбиваем путь у целевого таба на 2 составляющие (до и после "#") 
    // Берем последний элемент массива - это и будет id нужного таба
    areasTabs.querySelector("#" + evt.target.getAttribute("href").split('#').pop()).classList.add("active");
  }

  // При первой загрузке страницы делаем первый элемент активным
  tabsArray[0].classList.add("active");

  areasTabs.addEventListener("click", (evt) => {
    evt.preventDefault();
    // Проверяем произведен ли клик по нужному элементу, а не мимо
    if (evt.target.classList.contains("tabs__item")) {
      switchArea(evt);
    }
  })

  areasList.addEventListener("click", (evt) => {
    evt.preventDefault();
    if (evt.target.classList.contains("areas__link")) {
      switchArea(evt);
      scrollTo(areasTabs);
    }
  })  
})();