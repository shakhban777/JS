import {addZero} from './timer';

function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {
	// * Slider

	const slides = document.querySelectorAll(slide),
			slider = document.querySelector(container),
			prev = document.querySelector(prevArrow),
			next = document.querySelector(nextArrow),
			total = document.querySelector(totalCounter),
			current = document.querySelector(currentCounter),
			slidesWrapper = document.querySelector(wrapper),
			slidesField = document.querySelector(field),
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

}

export default slider;