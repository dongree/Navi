'use strict';

const addBtn = document.querySelector('.search__add__btn');
const deleteBtn = document.querySelector('.search__delete__btn');
const area = document.querySelector('.search__address');

let addressNum = 2;

addBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  li.setAttribute('class', 'search__address__form');

  const searchId = new Date().getTime().toString();
  const searchLable = document.createElement('label');
  searchLable.setAttribute('class', 'search__address__title');
  searchLable.setAttribute('for', searchId);
  searchLable.textContent = `주소 ${addressNum}`;
  addressNum += 1;

  const searchInput = document.createElement('input');
  searchInput.setAttribute('id', searchId);
  searchInput.setAttribute('type', 'text');

  li.appendChild(searchLable);
  li.appendChild(searchInput);
  area.appendChild(li);
});

deleteBtn.addEventListener('click', () => {
  if (addressNum > 2) {
    area.removeChild(area.lastElementChild);
    addressNum -= 1;
  }
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

let markers = [];
let infowindows = [];
searchBtn.addEventListener('click', () => {
  resolvedValueHandler(addressToLatLng);
});

function resolvedValueHandler(promiseGenerator) {
  const promises = promiseGenerator();
  Promise.all(promises).then(points => {
    const bounds = getBounds(points);
    map.setBounds(bounds);
    showInfo(points);
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

function getBounds(points) {
  const bounds = new kakao.maps.LatLngBounds();
  for (let i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
  }
  return bounds;
}

function showInfo(points) {
  if (markers.length > 0) {
    hideMarkers();
    hideInfoWindows();
  }
  markers = [];
  infowindows = [];
  for (let i = 0; i < points.length; i++) {
    addMarker(points[i]);
    addInfoWindow(i + 1);
  }
  showMarkers();
  showInfoWindows();
}

function addMarker(point) {
  const marker = new kakao.maps.Marker({ position: point });
  markers.push(marker);
}

function addInfoWindow(num) {
  const infowindow = new kakao.maps.InfoWindow({
    content: `<div style="width:150px;text-align:center;padding:6px 0;">주소${num}</div>`,
  });
  infowindows.push(infowindow);
}

function showInfoWindows() {
  for (let i = 0; i < infowindows.length; i++) {
    infowindows[i].open(map, markers[i]);
  }
}

function hideInfoWindows() {
  for (let i = 0; i < infowindows.length; i++) {
    infowindows[i].close();
  }
}

function showMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function hideMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}
