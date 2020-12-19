function addZero(num) {
	if (num < 10) {
		num = '0' + num;
	}
	return num;
}

function timer(id, deadLine) {
	// * Timer

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

	setClock(id, deadLine);
}

export default timer;
export {addZero};