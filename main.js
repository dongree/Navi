'use strict';

const addBtn = document.querySelector('.search__add__btn');
const area = document.querySelector('.search__address');

addBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.setAttribute('class', 'search__address__form');

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
});

const searchBtn = document.querySelector('.search__ok__btn');

const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
const options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};

const map = new kakao.maps.Map(container, options);
const geocoder = new kakao.maps.services.Geocoder();
const bounds = new kakao.maps.LatLngBounds();

searchBtn.addEventListener('click', () => {
  resolvedValueHandler(addressToLatLng);
});

function resolvedValueHandler(promiseGenerator) {
  const promises = promiseGenerator();
  Promise.all(promises).then(points => {
    const bounds = handleBound(points);
    map.setBounds(bounds);
  });
}

function addressToLatLng() {
  const lists = [...area.children];
  const addresses = lists.map(li => li.querySelector('input').value);
  const addressPromise = addresses.map(address => {
    return new Promise((resolve, reject) => {
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
          resolve(coords);
        } else {
          reject(status);
        }
      });
    });
  });
  return addressPromise;
}

function handleBound(points) {
  const bounds = new kakao.maps.LatLngBounds();
  for (let i = 0; i < points.length; i++) {
    // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
    const marker = new kakao.maps.Marker({ position: points[i] });
    marker.setMap(map);

    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(points[i]);
  }
  return bounds;
}
