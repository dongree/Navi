'use strict';

const addBtn = document.querySelector('.search__add__btn');
const area = document.querySelector('.search__address');

addBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.setAttribute('class', '.search__address__form');
  li.innerHTML = `
  <label class="search__address__title" for="input_address">주소</label>
  <input id="input_address" type="text" />`;

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'search__delete__btn');
  deleteBtn.textContent = '-';

  li.appendChild(deleteBtn);
  area.appendChild(li);

  deleteBtn.addEventListener('click', () => {
    area.removeChild(li);
  });
  console.log('haha');
});
