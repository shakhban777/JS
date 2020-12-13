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

	const modalTimerId = setTimeout(openModal, 120000);

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

	new MenuCard(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой ивысоким качеством!',
		10,
		'.menu__field .container'
	).render();

	new MenuCard(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		14,
		'.menu__field .container'
	).render();

	new MenuCard(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		21,
		'.menu__field .container'
	).render();


	// * Forms
	
	const forms = document.querySelectorAll('form');

	const message = {
		loading: 'img/form/spinner.svg',
		success: 'Спасибо, мы с вами скоро свяжемся',
		failure: 'Что-то пошло не так'
	};

	forms.forEach(item => {
		postData(item);
	});

	function postData(form) {
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
			
			const object = {};

			formData.forEach(function(key, value) {
				object[key] = value;
			});

			fetch('server.php', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(object)
			})
				.then(data => data.text())
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
});
