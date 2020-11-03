import { initialConfig } from './config.js';

const occupiedSeats = JSON.parse(localStorage.getItem('seats')) || [];
const movieSelect = document.getElementById('movie');
const containerSeats = document.querySelector('.container-seats');

// INITIAL LOAD

const loadSeats = () => {
  const fakeTimeout = Math.random() * 1500; // imitation of fetch
  const containerInner = document.querySelector('.container-inner');
  const options = movieSelect.options;
  const id = options[options.selectedIndex].id;

  setTimeout(() => {
    containerInner.classList.add('loaded');

    console.log(occupiedSeats);

    initialConfig.seats.forEach((row) => {
      const childRow = document.createElement('div');
      childRow.classList.add('row');

      row.forEach((seat) => {
        const childSeat = document.createElement('div');

        if (seat.seat) {
          childSeat.classList.add('seat');
          seat.id = `${id}${seat.row}${seat.seat}`;
        }

        if (!seat.seat) childSeat.classList.add('gap');

        if (occupiedSeats.includes(seat.id))
          childSeat.classList.add('occupied');

        childSeat.id = seat.id;
        childRow.appendChild(childSeat);
      });

      containerSeats.appendChild(childRow);
    });
  }, fakeTimeout);
};

loadSeats();

const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
console.log(movieSelect);
let ticketPrice = +movieSelect.value;

const updateSelectedCount = () => {
  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const selectedSeatsCount = selectedSeats.length;

  count.innerText = selectedSeatsCount;
  total.innerText = selectedSeatsCount * ticketPrice;
};

const setMovieData = (movieIndex, moviePrice) => {
  localStorage.setItem('selectedMovieIndex', movieIndex);
  localStorage.setItem('selectedMoviePrice', moviePrice);
};

// EVENTS
// Seats

container.addEventListener('click', (event) => {
  event.preventDefault();

  if (
    event.target.classList.contains('seat') &&
    !event.target.classList.contains('occupied')
  ) {
    event.target.classList.toggle('selected');
    console.log(event.target.id);
    updateSelectedCount();
  }

  if (event.target.id === 'submit') {
    const selectedSeatsQuery = document.querySelectorAll('.row .seat.selected');
    const selectedSeatsId = [];
    [...selectedSeatsQuery].forEach((seat) => selectedSeatsId.push(seat.id));
    localStorage.setItem(
      'seats',
      JSON.stringify([...occupiedSeats, ...selectedSeatsId])
    );
    window.location.reload();
  }

  if (event.target.id === 'reset') {
    localStorage.removeItem('seats');
    window.location.reload();
  }
});

// Movie
movieSelect.addEventListener('change', (event) => {
  event.preventDefault();
  setMovieData(event.target.selectedIndex, event.target.value);

  ticketPrice = +event.target.value;
  updateSelectedCount();
  containerSeats.innerHTML = '';
  loadSeats();
});

updateSelectedCount();
