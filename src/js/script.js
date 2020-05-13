document.addEventListener('DOMContentLoaded', () => {
  const slider = tns({
    container: '.carousel__inner',
    items: 1,
    slideBy: 'page',
    autoplay: false,
    controls: false,
    nav: false,
    responsive: {
      640: {
        edgePadding: 20,
        gutter: 20,
        items: 1,
      },
      700: {
        gutter: 30,
      },
      900: {
        items: 1,
      },
    },
  });

  document.querySelector('.prev').addEventListener('click', () => {
    slider.goTo('prev');
  });

  document.querySelector('.next').addEventListener('click', () => {
    slider.goTo('next');
  });

  function tabs({ target }) {
    if (target.parentNode.classList.contains('catalog__tab')) {
      document
        .querySelectorAll('.catalog__tab_active')
        .forEach((tab) => tab.classList.remove('catalog__tab_active'));

      target.parentNode.classList.add('catalog__tab_active');

      document
        .querySelectorAll('.catalog__content_active')
        .forEach((content) =>
          content.classList.remove('catalog__content_active')
        );

      const data = target.parentNode.dataset.tab;
      switch (data) {
        case 'fitness':
          document
            .querySelector('#fitness')
            .classList.add('catalog__content_active');
          break;
        case 'run':
          document
            .querySelector('#run')
            .classList.add('catalog__content_active');
          break;
        case 'triathlon':
          document
            .querySelector('#triathlon')
            .classList.add('catalog__content_active');
          break;
        default:
          break;
      }
    }
  }

  document.body.addEventListener('click', tabs);

  function toggleSlide(target, targetSibling, parentCls, siblingCls) {
    target.parentNode.classList.toggle(parentCls);
    targetSibling.classList.toggle(siblingCls);
  }

  function showDetail({ target }) {
    if (target.classList.contains('catalog-item__link')) {
      event.preventDefault();
      toggleSlide(
        target,
        target.parentNode.nextElementSibling,
        'catalog-item__content_active',
        'catalog-item__list_active'
      );
    }

    if (target.classList.contains('catalog-item__back')) {
      event.preventDefault();
      toggleSlide(
        target,
        target.parentNode.previousElementSibling,
        'catalog-item__list_active',
        'catalog-item__content_active'
      );
    }
  }

  document.body.addEventListener('click', showDetail);

  //Modal
  const overlay = document.querySelector('.overlay');
  const modalConsultation = document.getElementById('consultation');
  const modalOrder = document.getElementById('order');
  const modalDescr = document.querySelector('#order .modal__descr');

  function showModal({ target }) {
    if (target.dataset.modal === 'consultation') {
      switchModalDisplay('block', modalConsultation);
    }
    if (target.classList.contains('button_mini')) {
      switchModalDisplay('block', modalOrder);
      modalDescr.textContent =
        target.parentNode.parentNode.firstElementChild.firstElementChild.childNodes[3].textContent;
    }
  }

  function closeModal({ target }) {
    if (
      target.classList.contains('overlay') ||
      target.classList.contains('modal__close')
    ) {
      switchModalDisplay('none', modalConsultation);
      switchModalDisplay('none', modalOrder);
    }
  }

  function switchModalDisplay(value, modal) {
    overlay.style.display = value;
    modal.style.display = value;
  }

  document.body.addEventListener('click', showModal);
  document.body.addEventListener('click', closeModal);

  //validation forms
  function validForms(form) {
    $(form).validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },
        phone: 'required',
        email: {
          required: true,
          email: true,
        },
      },
      messages: {
        name: {
          required: 'Пожалуйста, введите ваше имя',
          minlength: jQuery.validator.format(
            'Поле  должно содержать не менее 2-х символов!'
          ),
        },
        phone: 'Пожалуйста, введите ваш номер телефона',
        email: {
          required: 'Пожалуйста, введите вашу почту',
          email: 'Неправильно введен адрес почты',
        },
      },
    });
  }

  validForms('#consultation-form form');
  validForms('#consultation form');
  validForms('#order form');

  //maskedInput
  $('input[name=phone]').mask('+7 (999) 999-99-99');

  $('form').submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: 'mailer/smart.php',
      data: $(this).serialize(),
    }).done(function () {
      $(this).find('input').val('');
      $('#consultation, #order').fadeOut();
      $('.overlay, #thanks').fadeIn('slow');
      $('form').trigger('reset');
    });
    return false;
  });

  //Smooth scroll and pageup
  $(window).scroll(function () {
    if ($(this).scrollTop() > 1600) {
      $('.pageup').fadeIn();
    } else {
      $('.pageup').fadeOut();
    }
  });

  $("a[href^='#'").click(function () {
    const _href = $(this).attr('href');
    $('html,body').animate({
      scrollTop: $(_href).offset().top + 'px',
    });
    return false;
  });

  //wow.js init
  new WOW().init();
});
