'use strict';

document.addEventListener('DOMContentLoaded', () => {


	// * Tabs

	const tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});

		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});
	}

	function showTabContent(i = 0) {
		tabsContent[i].classList.remove('hide');
		tabsContent[i].classList.add('show', 'fade');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', event => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});


	// * Timer

	const deadLine = '2020-12-31';

	function getTimeRemaining(endtime) {
		const total = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(total / (1000 * 60 * 60 * 24)),
			hours = Math.floor((total / (1000 * 60 * 60)) % 24),
			minutes = Math.floor((total / (1000 * 60)) % 60),
			seconds = Math.floor((total / 1000) % 60);

		return {
			total,
			days,
			hours,
			minutes,
			seconds
		};
	}

	class SetText {
		constructor(name, variable, one, two, eleven, other) {
			this.name = name;
			this.variable = variable;
			this.one = one;
			this.two = two;
			this.eleven = eleven;
			this.other = other;
		}

		showText() {
			this.variable = this.variable.trim();
			if (this.variable.length >= 2 && this.variable != '11') {
				this.variable = +this.variable.slice(this.variable.length - 1);
			}

			if (this.variable == 1) {
				this.name = this.one;
			} else if (this.variable == 2 || this.variable == 3 || this.variable == 4) {
				this.name = this.two;
			} else if (this.variable == '11') {
				this.name = this.eleven;
			} else {
				this.name = this.other;
			}

			return this.name;
		}
	}

	function addZero(num) {
		if (num < 10) {
			num = '0' + num;
		}
		return num;
	}


	function setClock(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateTime, 1000),
			nameDay = days.nextSibling,
			nameHours = hours.nextSibling,
			nameMinutes = minutes.nextSibling,
			nameSeconds = seconds.nextSibling;


		updateTime();


		function updateTime() {
			const t = getTimeRemaining(endtime);
			days.innerText = addZero(t.days);
			hours.innerText = addZero(t.hours);
			minutes.innerText = addZero(t.minutes);
			seconds.innerText = addZero(t.seconds);

			const setNameDay = new SetText(nameDay, days.innerText, 'день', 'дня', 'дней', 'дней'),
					setNameHours = new SetText(nameHours, hours.innerText, 'час', 'часа', 'часов', 'часов'),
					setNameMinutes = new SetText(nameMinutes, minutes.innerText, 'минута', 'минуты', 'минут', 'минут'),
					setNameSeconds = new SetText(nameSeconds, seconds.innerText, 'секунда', 'секунды', 'секунд', 'секунд');

			if (t <= 0) {
				clearInterval(timeInterval);
			}

			nameDay.data = setNameDay.showText();
			nameHours.data = setNameHours.showText();
			nameMinutes.data = setNameMinutes.showText();
			nameSeconds.data = setNameSeconds.showText();
		}
	}

	setClock('.timer', deadLine);


	// * Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
			modal = document.querySelector('.modal');

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearTimeout(modalTimerId);
	}

	modalTrigger.forEach(item => {
		item.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	modal.addEventListener('click', e => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', e => {
		if (e.code == 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 300000);

	function showModalByScroll() {
		if ((Math.round(window.pageYOffset + document.documentElement.clientHeight)) >=
			document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);


	// * Classes ("Наше меню на день")
	
	class MenuCard {
		constructor(src, alt, title, describe, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.describe = describe;
			this.price = price;
			this.parent = document.querySelector(parentSelector);
			this.classes = classes;
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = +this.price * this.transfer;
		}

		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(el => element.classList.add(el));
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.describe}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`;
			this.parent.append(element);
		}
	}

	
	const getResource = async url => {
		const res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status: ${res.status}`);
		}

		return await res.json();
	};

	// getResource('http://localhost:3000/menu')
	// 	.then(data => {
	// 		data.forEach(({img, altimg, title, descr, price}) => {
	// 			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
	// 		});
	// 	});


	axios.get('http://localhost:3000/menu')
		.then(data => {
			data.data.forEach(({img, altimg, title, descr, price}) => {
				new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
			});
		});


	/* getResource('http://localhost:3000/menu')
       .then(data => createCard(data));

   function createCard(data) {
       data.forEach(({img, altimg, title, descr, price}) => {
           const element = document.createElement('div');

           element.classList.add("menu__item");

           element.innerHTML = `
               <img src=${img} alt=${altimg}>
               <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;
            document.querySelector(".menu .container").append(element);
        });
    } */

	// * Forms
	
	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, мы с вами скоро свяжемся',
		failure: 'Что-то пошло не так'
	};

	forms.forEach(item => {
		bindPostData(item);
	});

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data
		});

		return await res.json();
	};

	function bindPostData(form) {
		form.addEventListener('submit', event => {
			event.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);
		
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then(data => {
					console.log(data);
					showThanksModal(message.success);
					statusMessage.remove();
				}).catch(() => {
					showThanksModal(message.failure);
				}).finally(() => {
					form.reset();
				});
		});
	}

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class="modal__content">
				<div class="modal__close" data-close>×</div>
				<div class="modal__title">${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}


	// * Slider

	const slides = document.querySelectorAll('.offer__slide'),
			slider = document.querySelector('.offer__slider'),
			prev = document.querySelector('.offer__slider-prev'),
			next = document.querySelector('.offer__slider-next'),
			total = document.querySelector('#total'),
			current = document.querySelector('#current'),
			slidesWrapper = document.querySelector('.offer__slider-wrapper'),
			slidesField = document.querySelector('.offer__slider-inner'),
			width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1,
		 offset = 0;

	total.textContent = `${addZero(slides.length)}`;
	current.textContent = `${addZero(slideIndex)}`;

	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';

	slides.forEach(item => {
		item.style.width = width;
	});

	slider.style.position = 'relative';

	const indicators = document.createElement('ol'),
			dots = [];
	indicators.classList.add('carousel-indicators');
	
	slider.append(indicators);

	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.classList.add('dot');
		indicators.append(dot);
		if (i == 0) {
			dot.style.opacity = 1;
		}
		dots.push(dot);
	}


	function currentDot() {
		dots.forEach(dot => dot.style.opacity = 0.5);
		dots[slideIndex - 1].style.opacity = 1;
	}

	function deleteNotDigits(item) {
		return +item.replace(/\D/g, '');
	}

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		slideIndex--;

		if (slideIndex < 1) {
			slideIndex = slides.length;
		}

		current.textContent = `${addZero(slideIndex)}`;

		currentDot();
	});

	next.addEventListener('click', () => {
		if (offset == (deleteNotDigits(width) * (slides.length - 1))) {
			offset = 0;
		} else {
			offset += deleteNotDigits(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		slideIndex++;

		if (slideIndex > slides.length) {
			slideIndex = 1;
		}

		current.textContent = `${addZero(slideIndex)}`;

		currentDot();
	});

	dots.forEach(dot => {
		dot.addEventListener('click', e => {
			const slideTo = e.target.getAttribute('data-slide-to');

			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			current.textContent = `${addZero(slideIndex)}`;

			currentDot();
		});
	});


	// * Calc

	const result = document.querySelector('.calculating__result span');
	let sex = 'female',
		 height, weight, age,
		 ratio = 1.375;

	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '_____';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round(ratio * (447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)));
		} else {
			result.textContent = Math.round(ratio * (88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)));
		}
	}

	calcTotal();

	function getStaticInformation(selectorParent, activeClass) {
		const elements = document.querySelectorAll(`${selectorParent} div`);

		elements.forEach(elem => {
			elem.addEventListener('click', e => {
				if (e.target.getAttribute('data-ratio')) {
					ratio = +e.target.getAttribute('data-ratio');
				} else {
					sex = e.target.getAttribute('id');
				}

				elements.forEach(item => {
					item.classList.remove(activeClass);
				});

				e.target.classList.add(activeClass);

				calcTotal();
			});
		});
	}

	getStaticInformation('#gender', 'calculating__choose-item_active');
	getStaticInformation('#activity', 'calculating__choose-item_active');

	function getDinamicInformation(selector) {
		const input = document.querySelector(selector);

		input.addEventListener('input', () => {
			switch(input.getAttribute('id')) {
				case 'weight':
					weight = +input.value;
					break;
				case 'height':
					height = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}
	
			calcTotal();
		});
	}

	getDinamicInformation('#weight');
	getDinamicInformation('#height');
	getDinamicInformation('#age');

});

