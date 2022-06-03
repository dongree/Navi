'use strict';

const addBtn = document.querySelector('.search__add__btn');
const area = document.querySelector('.search__address');

addBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.setAttribute('class', 'search__address__form');
  // li.innerHTML = `
  // <label class="search__address__title" for="input_address">주소</label>
  // <input id="input_address" type="text" />`;

  const searchId = new Date().getTime().toString();
  const searchLable = document.createElement('label');
  searchLable.setAttribute('class', 'search__address__title');
  searchLable.setAttribute('for', searchId);
  searchLable.textContent = '주소';

  const searchInput = document.createElement('input');
  searchInput.setAttribute('id', searchId);
  searchInput.setAttribute('type', 'text');

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'search__delete__btn');
  deleteBtn.textContent = '-';

  li.appendChild(searchLable);
  li.appendChild(searchInput);
  li.appendChild(deleteBtn);
  area.appendChild(li);

  deleteBtn.addEventListener('click', () => {
    area.removeChild(li);
  });
  console.log('haha');
});
