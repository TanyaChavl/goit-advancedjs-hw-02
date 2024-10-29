import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector("[data-start]");
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");
let selectedDate = null;
let countdownInterval = null;

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    
    if (selectedDate < new Date()) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
      });
      startButton.disabled = true;
    } else {
      startButton.classList.remove("disabled");
      startButton.classList.add("enabled");  
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

function startCountdown() {
    startButton.classList.remove("enabled");
    startButton.classList.add("disabled");
    startButton.disabled = true;

  countdownInterval = setInterval(() => {
    const timeRemaining = selectedDate - new Date();

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      updateInterface(0, 0, 0, 0);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    updateInterface(days, hours, minutes, seconds);
  }, 1000);
}

function updateInterface(days, hours, minutes, seconds) {
  daysElement.textContent = String(days).padStart(2, "0");
  hoursElement.textContent = String(hours).padStart(2, "0");
  minutesElement.textContent = String(minutes).padStart(2, "0");
  secondsElement.textContent = String(seconds).padStart(2, "0");
}

startButton.addEventListener("click", startCountdown);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}