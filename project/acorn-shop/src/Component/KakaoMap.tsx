import { useEffect, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapProps {
  address: string; // 🔥 주소를 prop으로 받음
}

export default function KakaoMap({ address }: KakaoMapProps) {
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  // 카카오맵 로드
  useEffect(() => {
    window.kakao.maps.load(() => {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 기본 위치: 서울
        level: 3,
      };
      const newMap = new window.kakao.maps.Map(container, options);
      setMap(newMap);
      setMarker(new window.kakao.maps.Marker());
    });
  }, []);

  // 주소 변경 시 좌표 검색 후 지도 이동
  useEffect(() => {
    if (!map || !address) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const position = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        map.panTo(position);

        if (marker) {
          marker.setMap(null);
          marker.setPosition(position);
          marker.setMap(map);
        }
      }
    });
  }, [map, address]);

  return <div id="map" style={{ width: "100%", height: "300px" }}></div>;
}
