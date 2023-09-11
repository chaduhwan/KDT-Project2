//선택한 장소의 정보
let placeId = '';
let placeName = '';
let placeAddress = '';
let placeLati;
let placeLogi;

//유저의 현재 위치 가져오기
//위도 latitude/ 경도 longitude
// let lati = '';
// let longi = '';
// navigator.geolocation.getCurrentPosition((position) => {
//     lati = position.coords.latitude
//     longi = position.coords.longitude
// })

// 마커를 담을 배열
let markers = [];

let mapContainer = document.getElementById('map'), // 지도를 표시할 div
  mapOption = {
    // center: new kakao.maps.LatLng(lati, longi), // 지도의 중심좌표
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3, // 지도의 확대 레벨
  };

// 지도생성
let map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체 생성
let ps = new kakao.maps.services.Places();

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우
let infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 키워드로 장소 검색
searchPlaces();

function searchPlaces() {
  infowindow.close(); //인포윈도우 초기화
  let keyword = document.getElementById('keyword').value;
  if (!keyword.replace(/^\s+|\s+$/g, '')) {
    //공백방지
    alert('키워드를 입력해주세요!');
    return false;
  }
  // 장소검색 객체를 통해 키워드로 장소검색을 요청
  ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백
function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    // 정상적으로 검색이 완료됐으면 검색 목록과 마커를 표출

    //검색한 장소의 데이터 받아오기
    // for (let i = 0; i < data.length; i++) {
    //     let id = data[i].id; // 주소 검색 결과의 ID
    //     let name = data[i].place_name; // 장소명
    //     let address = data[i].address_name; // 주소
    //     console.log(id, name, address)
    // }

    displayPlaces(data);

    // 페이지 번호 표출
    displayPagination(pagination);
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert('검색 결과가 존재하지 않습니다.');
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert('검색 결과 중 오류가 발생했습니다.');
    return;
  }
}

// 검색 결과 목록과 마커를 표출하는 함수
function displayPlaces(places) {
  let listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(),
    bounds = new kakao.maps.LatLngBounds(),
    listStr = '';

  // 검색 결과 목록에 추가된 항목들을 제거
  removeAllChildNods(listEl);

  // 지도에 표시되고 있는 마커를 제거
  removeMarker();

  for (let i = 0; i < places.length; i++) {
    // 마커를 생성하고 지도에 표시
    let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
      marker = addMarker(placePosition, i),
      itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성

    //장소 정보
    placeId = places[i].id; // 주소 검색 결과의 ID
    placeName = places[i].place_name; // 장소명
    placeAddress = places[i].address_name; // 주소
    placeLati = places[i].y; //위도
    placeLogi = places[i].x; //경도

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해 LatLngBounds 객체에 좌표를 추가
    bounds.extend(placePosition);

    // 마커와 검색결과 항목에 mouseover 했을때
    // 해당 장소에 인포윈도우에 장소명을 표시
    // mouseout 했을 때는 인포윈도우를 닫음
    (function (marker, title) {
      kakao.maps.event.addListener(marker, 'click ', function () {
        map.panTo(placePosition);
        map.setLevel(2);
        displayInfowindow(marker, title, placeId, placeName);
      });
      // kakao.maps.event.addListener(marker, 'blur', function () {
      //     infowindow.close();
      // });
      //목록의 장소 클릭하면 지도 이동+마커 표시
      itemEl.onclick = function () {
        map.panTo(placePosition);
        map.setLevel(2);
        displayInfowindow(marker, title, placeId, placeName);
        console.log(placeId, placeName, placeAddress);
      };
      // itemEl.onmouseout = function () {
      //     infowindow.close();
      // };
    })(marker, places[i].place_name);
    fragment.appendChild(itemEl);
  }

  // 검색결과 항목들을 검색결과 목록 Element에 추가
  listEl.appendChild(fragment);
  menuEl.scrollTop = 0;

  // 검색된 장소 위치를 기준으로 지도 범위를 재설정
  map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수
function getListItem(index, places) {
  let el = document.createElement('li'),
    itemStr =
      '<span class="markerbg marker_' +
      (index + 1) +
      '"></span>' +
      '<div class="info">' +
      '   <h5>' +
      places.place_name +
      '</h5>';

  if (places.road_address_name) {
    itemStr +=
      '    <span>' +
      places.road_address_name +
      '</span>' +
      '   <span class="jibun gray">' +
      places.address_name +
      '</span>';
  } else {
    itemStr += '    <span>' + places.address_name + '</span>';
  }

  itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';

  el.innerHTML = itemStr;
  el.className = 'item';

  // el.onclick = function () {
  //     map.panTo(new kakao.maps.LatLng(places.y, places.x));
  //     map.setLevel(5);
  // };

  return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수
function addMarker(position, idx, title) {
  let imageSrc =
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url
    imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
    imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
    },
    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
    marker = new kakao.maps.Marker({
      position: position, // 마커의 위치
      image: markerImage,
      clickable: true,
    });

  marker.setMap(map); // 지도 위에 마커를 표출
  markers.push(marker); // 배열에 생성된 마커를 추가

  return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거
function removeMarker() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시하는 함수
function displayPagination(pagination) {
  let paginationEl = document.getElementById('pagination'),
    fragment = document.createDocumentFragment(),
    i;

  // 기존에 추가된 페이지번호를 삭제
  while (paginationEl.hasChildNodes()) {
    paginationEl.removeChild(paginationEl.lastChild);
  }

  for (i = 1; i <= pagination.last; i++) {
    let el = document.createElement('a');
    el.href = '#';
    el.innerHTML = i;

    if (i === pagination.current) {
      el.className = 'on';
    } else {
      el.onclick = (function (i) {
        return function () {
          pagination.gotoPage(i);
        };
      })(i);
    }

    fragment.appendChild(el);
  }
  paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수
// 인포윈도우에 장소명을 표시
function displayInfowindow(marker, title, id, name) {
  // https://place.map.kakao.com/622222463
  let kakaoMapURL = `https://place.map.kakao.com/${id}`;
  let content =
    `<div class='infowindow' >` +
    title +
    '</div>' +
    '<a style="margin:5px; color: blue;" href="' +
    kakaoMapURL +
    '" target="_blank">자세히보기</a><br/>' +
    '<button style="margin:5px" type=button onclick="selectPlace()" >첨부하기</button>';
  infowindow.setContent(content);
  infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수
function removeAllChildNods(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.lastChild);
  }
}

const modal = $('#searchModal');

function showSearchPlaces() {
  modal.css('display', 'flex');
}

async function selectPlace() {
  console.log(placeId, placeName, placeAddress);
  await axios({
    method: 'POST',
    url: 'bob/select',
    data: {
      placeId,
      placeName,
      placeAddress,
      placeLati,
      placeLogi,
    },
  });
  modal.css('display', 'none');
  // 이미지 지도에 표시할 마커입니다
  let marker2 = {
    position: new kakao.maps.LatLng(placeLati, placeLogi),
    text: `${placeName}`, // 마커에 표시할 텍스트
  };
  let mapper = document.createElement('div');
  mapper.style.cssText = `    
    width: 300px;
    height: 300px;
  `;
  let switcher = document.querySelector('.toastui-editor-mode-switch');
  //   switcher.children[0].classList.remove('active');
  switcher.children[1].classList.add('manipulate');
  switcher.children[0].classList.add('manipulate2');
  $(document).ready(function () {
    $('.manipulate').trigger('click');
  });

  let here = document.querySelector('.toastui-editor-ww-container').children[0]
    .children[0].children[0];
  let showmaker = document.createElement('img');
  //   showmaker.src = staticMapContainer2.children[0].children[0].src;
  showmaker.contentEditable = false;
  showmaker.classList.add('mapper');
  showmaker.style.cssText = `    
  width: 300px;
  height: 300px;
`;
  let showmaker2 = document.createElement('img');
  showmaker2.classList.add('ProseMirror-separator');
  here.append(showmaker);
  here.append(showmaker2);
  let staticMapContainer2 = document.querySelector('.mapper');
  let staticMapOption = {
    center: new kakao.maps.LatLng(placeLati, placeLogi), // 이미지 지도의 중심좌표
    level: 3, // 이미지 지도의 확대 레벨
    marker: marker2, // 이미지 지도에 표시할 마커
  };
  // 이미지 지도를 생성합니다
  let staticMap = new kakao.maps.StaticMap(
    staticMapContainer2,
    staticMapOption,
  );
}
