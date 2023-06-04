window.addEventListener("DOMContentLoaded", () => {
  /////////////// Блок отвечает за измение картинок и стиля питания  /////////////////////
  //Назначение переменных
  let tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items"); //?

  function hideTabContent() {
    //Скрываем все картинки
    tabsContent.forEach((item) => {
      item.classList.add("hide");
      item.classList.remove("show", "fade");
    });

    //перебираем все tabheader__item и удаляем класс tabheader__item_active (выделение жирным черным цветом)
    tabs.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  }

  //Показываем первую картинку(по умолчанию)
  function showTabContent(i = 0) {
    //Добавляем два класса 'show', 'fade'(отвечает за плавность анимации)
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  //Вешаем на клик событие для делегирования событий
  tabsParent.addEventListener("click", (event) => {
    //Присваиваем переменной target значение. Делается для того, чтобы каждый раз не писать event.target, а использовать только target
    let target = event.target;
    //Если нажимаем на Фитнес или Премиум или Постное или Сбалансированное, то происходит переключение картинки
    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((item, i) => {
        //Target - это то на что мы нажали из Фитнес или Премиум или Постное или Сбалансированное
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  ////Блок Таймера
  let deadline = "2023-06-23";

  function getTimeRemaining(endtime) {
    let days;
    let hours;
    let minutes;
    let seconds;
    let t = Date.parse(endtime) - Date.parse(new Date()); // Date.parse(endtime) -  колчиство миллисекундв в нашем конечном времени, до которого нам нужно дойти(досчитать), Date.parse(new Date()) - настоящее время.
    //Если дата уже прошла, то в таймере выставляется 00 00 00 00
    if (t <= 0) {
      days = 0;
      hours = 0;
      minutes = 0;
      seconds = 0;
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)); // Количество в сутках миллисекунд
      hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((t / 1000 / 60) % 60);
      seconds = Math.floor((t / 1000) % 60);
    }

    //Возвращает данные в виде объекта
    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  //Добавляет к числу "0", если оно от 0-9
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    //Обращатся к селекторам days, hours
    let timer = document.querySelector(selector);
    let days = timer.querySelector("#days");
    let hours = timer.querySelector("#hours");
    let minutes = timer.querySelector("#minutes");
    let seconds = timer.querySelector("#seconds");
    let timeInterval = setInterval(updateClock, 1000);

    updateClock();

    //Функция, которая отвечает за обновление времени на таймере
    function updateClock() {
      let t = getTimeRemaining(endtime);

      //Изменяет данные на странице через комманду innerHTML
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);
      //Если на таймера показывает 0, то отсчет прекращается
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock(".timer", deadline);
  /////////////Конец Блока Таймера /////////////

  ///////////////Модальное окно////////////////
  //Назначение переменных
  let modalTrigger = document.querySelectorAll("[data-modal]");
  let modal = document.querySelector(".modal");

  //Отвечает за открытие модального окна
  function openModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    //modal.classList.toggle("show"); //подключаем класс show c style.css и тем самым показываем модальное окно
    document.body.style.overflow = "hidden"; // Убираем возможность прокрутки при включенном модальном окне
    clearInterval(modalTimerId);
  }

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  //отвечает за закрытие модального окна принажатии на крестик
  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    //modal.classList.toggle("show");
    document.body.style.overflow = ""; //Включаем возможность прокрутки, когда модальное окна закрыто
  }

  //отвечает за закрытие модального окна принажатии не на крестик
  modal.addEventListener("click", (e) => {
    //если кликаем на подложку или на крестик то модальное окна закрывается//
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  //отвечает за закрытие модального окна принажатии на клавишу spice
  document.addEventListener("keydown", (event) => {
    if (event.code === "Spice" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  //Окно само появлется через 5000 мс
  let modalTimerId = setTimeout(openModal, 50000);

  //Модальное окно появляется после того, как долистал до конца страницы
  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 1
    ) {
      openModal(); //открывает модальное окно
      window.removeEventListener("scroll", showModalByScroll); //удаляет обработчик событий в том случае, если долистал до конца страницы
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  ///Конец блока модальное окно///
  ///Блок карточек Фитнес, Премиум, Постное///

  //Создание базовой карточки
  class BaseMenuField {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
    }
    //Сюда копируем с index.html
    render() {
      let element = document.createElement("div");
      if (this.classes.length === 0) {
        //Если в classes не передается значений, т.е нет не одного класса,
        this.element = "menu__item";
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className)); //Добалвляет класс к classes для создания обертки
      }

      element.innerHTML = `
          <img src=${this.src} alt=${this.alt}>
          <h3 class="menu__item-subtitle">"${this.title}"</h3>
          <div class="menu__item-descr">
            ${this.descr}
          </div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
        `;
      this.parent.append(element);
    }
  }

  //Получаем данные с сервера. Так как этот код не ждет друг-друга, то он ассинхронный( мы не знаем через сколько он вырнется с сервера) А значит надо использовать оператор async / await (await ставится перед операциями, которые необходимо дождаться)
  let getResource = async (url) => {
    // Мы отправили запрос, но в тоже время была создана переменная res, в которую мы пока ничего не записали
    let res = await fetch(url);
    //Если с запросом пошло что-то не так
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json(); //возвращаем промис
  };

  getResource("http://localhost:3000/menu") //получаем ответ (записан будет в data)
    .then((data) => {
      data.forEach(({ img, altimg, title, descr, price }) => {
        new BaseMenuField(
          img,
          altimg,
          title,
          descr,
          price,
          ".menu .container"
        ).render();
      });
    });

  //Отправление запроса через библиотеку AXIOS

  //axios.get("http://localhost:3000/menu").then((data) =>
  //  data.data.forEach(({ img, altimg, title, descr, price }) => {
  //    new BaseMenuField(
  //      img,
  //      altimg,
  //      title,
  //      descr,
  //      price,
  //      ".menu .container"
  //    ).render();
  //  })
  //);

  //Окончание блока карточек Фитнес, Премиум, Постное///
  ////////ФОРМЫ, обратная связь///////
  let forms = document.querySelectorAll("form");

  let message = {
    loading: "img/formspinner.svg",
    success: "Спасибо, мы с вами свяжемся",
    failure: "Что-то пошло не так ...",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  //Получаем данные с сервера. Так как этот код не ждет друг-друга, то он ассинхронный( мы не знаем через сколько он вырнется с сервера) А значит надо использовать оператор async / await (await ставится перед операциями, которые необходимо дождаться)
  let postData = async (url, data) => {
    // Мы отправили запрос, но в тоже время была создана переменная res, в которую мы пока ничего не записали
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: data,
    });
    return await res.json(); //возвращаем промис
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("img"); //создал изображение
      statusMessage.src = message.loading; //подставил ему аттрибут src
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `; //установили изображение посредине

      form.insertAdjacentElement("afterend", statusMessage); //вставка элемента

      let formData = new FormData(form); // формируем форму. В форме(файл index.html) должен быть аттрибут name = ''

      let json = JSON.stringify(Object.fromEntries(formData.entries())); //formData.entries – превращаем в массив массивов, Object.fromEntries(formData.entries())) – превращаем в классический объект, После этого мы тот классический объект превращаем в json

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success); //Показывается модальное окно с текстом и через 4 сек оно закрывается

          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset(); //сбрасываем форму
        });
    });
  }
  ////// Делаем красивое оповещение пользователя///////
  function showThanksModal(message) {
    //message то, что будем показывать пользователю
    let prevModalDialog = document.querySelector(".modal__dialog");
    prevModalDialog.classList.add("hide"); //скрываем диалоговое окно

    openModal();

    let thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
    <div class = "modal__content">
      <div class = "modal__close" data-close>x</div>
      <div class = "modal__title">${message}</div>
    </div>
    `;

    document.querySelector(".modal").append(thanksModal);
    //Возвращаем первоначальное модальное окно
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      closeModal();
    }, 4000);
  }

  ////////////////////////Слайдер простой///////////////////
  //Получение элементов
  //   let slides = document.querySelectorAll(".offer__slide");
  //   let prev = document.querySelector(".offer__slider-prev");
  //   let next = document.querySelector(".offer__slider-next");
  //   let total = document.querySelector('#total');
  //   let current = document.querySelector('#current');
  //   let slideIndex = 1;

  //   showSlides(slideIndex)

  //   //Выставляем конечное количество слайдов. Тут их 4
  // if(slides.length<10) {
  //   total.textContent = `0${slides.length}`;
  // } else {
  //   total.textContent = slides.length;
  // }

  //   //функция по показу и скрытию наших слайдов. В n приходит slideIndex. ВЫСТАВЛЯЕМ ГРАНИЦЫ.
  //   function showSlides(n) {
  //     //Если мы нажимаем на стрелку вправо и выходим за границу количества слайдов, то устанавливается 1 слайд
  //     if (n > slides.length) {
  //       slideIndex = 1;
  //     }
  //     // Если мы нажимаем на стрелку влево и выходим за границу количества слайдов, то устанавливается последний слайд
  //     if (n < 1) {
  //       slideIndex = slides.length;
  //     }

  //     //скрываем все слайды
  //     slides.forEach((item) => item.classList.add('hide'));

  //     //показываем один текущий слайд
  //     slides[slideIndex-1].classList.remove('hide');
  //     slides[slideIndex-1].classList.add('show');

  //     //после щелчка будет меняться номер текущего слайда
  //     if(slides.length<10) {
  //       current.textContent = `0${slideIndex}`;
  //     } else {
  //       current.textContent = slideIndex;
  //     }
  //   }

  //   //Функция ответственная за переключение слайдов
  //   function plusSlides(n) {
  //     //в n приходит или 1 или -1.
  //     showSlides((slideIndex += n));
  //   }

  //   prev.addEventListener("click", () => {
  //     plusSlides(-1);
  //   });
  //   next.addEventListener("click", () => {
  //     plusSlides(1);
  //   });

  ///////////////////////////Обновленный слайдер //////////////////////////

  let slides = document.querySelectorAll(".offer__slide");
  let prev = document.querySelector(".offer__slider-prev");
  let next = document.querySelector(".offer__slider-next");
  let total = document.querySelector("#total");
  let current = document.querySelector("#current");
  let slidesWrapper = document.querySelector(".offer__slider-wrapper"); //большое окно. Все что не подходит под ширину этого блока будет скрыто от пользователя
  let slidesField = document.querySelector(".offer__slider-inner"); //блок ввиде карусели и занимает столько места, сколько слайдов в ширину
  let width = window.getComputedStyle(slidesWrapper).width; //получаю ширину объекта из elements/Computed/width
  let slideIndex = 1;
  let offset = 0; //отступ, ориентируясь на который мы листаем слайды влево или вправо

  //Установаливаем количество слайдов
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`; //устанавливаем количество слайдов и добавляем к ним 0(например 01-09), если слайдов меньше 10
    current.textContent = `0${slideIndex}`; //устанавливаем номер слайда добавляем к ниму 0(например 01-09), с него будет начинаться слайдер, если слайдов меньше 10
  } else {
    total.textContent = slides.length; //устанавливаем количество слайдов
    current.textContent = slideIndex; //устанавливаем номер слайда с которого будет начинаться слайдер
  }

  slidesField.style.width = 100 * slides.length + "%"; //устанавливаем блоку ширину. Делается это, чтобы можно было помястить все слайды в этот блок.

  slidesField.style.display = "flex"; //выставляем картинки в горизантальную линию
  slidesField.style.transition = "0.5s all"; //для плавного передвижения картинок

  slidesWrapper.style.overflow = "hidden"; //скрываем все элементы, которые не попадают в область видимости

  slides.forEach((slide) => {
    slide.style.width = width; //перебираем все слайды и устанавливаем их одной ширины
  });

  //Находим offer__slider-inner. он занимает 2600 mpx по ширине.

  /////Делаем точки на слайде/////

  let slider = document.querySelector(".offer__slider"); //для создания точек на слайде
  slider.style.position = "relative";

  let indicators = document.createElement("ol"); //создаем элемент
  let dots = []; //создаем для того, чтобы точка стало интерактивной

  indicators.classList.add("carousel-indicators"); //присваеваем ему класс

  slider.append(indicators); //вставляем элемент indicators в slider

  for (let i = 0; i < slides.length; i++) {
    let dot = document.createElement("li"); //создаем элемент
    dot.setAttribute("data-slide-to", i + 1); //присваеваем аттрибут data-slide-to
    dot.style.cssText = `
      box-sizing: content-box;
      flex: 0 1 auto;
      width: 30px;
      height: 6px;
      margin-right: 3px;
      margin-left: 3px;
      cursor: pointer;
      background-color: #fff;
      background-clip: padding-box;
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      opacity: .5;
      transition: opacity .6s ease;
    `; //присваваем стили dot

    if (i == 0) {
      //устаналиваем индикатор активности
      dot.style.opacity = 1;
    }
    indicators.append(dot); //вставлеям элемент dot в indicators
    dots.push(dot); //добавляем элемент в массив, который мы сами и создали
  }

  /////______________________/////

  function changeColorsDots() {
    dots.forEach((dot) => (dot.style.opacity = ".5")); //перебирает массив и меняет цвет точек на слайдере
    dots[slideIndex - 1].style.opacity = 1;
  }

  function addZero() {
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  //вырезает 'px' из строки 200px
  function deleteNotDigits(str) {
    return +str.replace(/\D/g, "");
  }
  //Блок ответственный за смещение слайдера влево или вправо
  next.addEventListener("click", () => {
    //если мы долистали слайдер до самого конца, то мы возвращаемся в самое начало. Для этого надо видоизменить width, в котором лежит 500 и два символа (px)
    if (offset == deleteNotDigits(width) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += deleteNotDigits(width); //смещение слайда, если он не доходит до конца(границы)
    }
    slidesField.style.transform = `translateX(-${offset}px)`; //команда в которую помещаются данные для движения слайда

    //номер слайда меняется
    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    addZero();

    ////кусочек кода от блока точки на слайду///
    changeColorsDots();
    ///_____________///
  });

  prev.addEventListener("click", () => {
    if (offset == 0) {
      offset = deleteNotDigits(width) * (slides.length - 1);
    } else {
      offset -= deleteNotDigits(width); //смещение слайда, если он не доходит до конца(границы)
    }
    slidesField.style.transform = `translateX(-${offset}px)`; //команда в которую помещаются данные для движения слайда

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    addZero();

    ////кусочек кода от блока точки на слайду///
    changeColorsDots();
    ///_____________///
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      let slideTo = e.target.getAttribute("data-slide-to"); //получаем элемент по аттрибуту data-slide-to. Соответственно: 1,2,3 или 4

      slideIndex = slideTo;
      offset = deleteNotDigits(width) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`; //команда в которую помещаются данные для движения слайда

      addZero();

      ////кусочек кода от блока точки на слайду///
      changeColorsDots();
    });
  });
});
//dd//
