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
var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = {
  //지도를 생성할 때 필요한 기본 옵션
  center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
  level: 3, //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options);
var geocoder = new kakao.maps.services.Geocoder();

searchBtn.addEventListener('click', () => {
  const lists = [...area.children];
  const addresses = lists.map(li => li.querySelector('input').value);
  addresses.map((address, idx) => {
    geocoder.addressSearch(address, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:6px 0;">배달지${
            idx + 1
          }</div>`,
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        // map.setCenter(coords);
      } else {
        console.log(`${idx + 1}칸을 잘못 입력하였습니다.`);
      }
    });
  });
});
