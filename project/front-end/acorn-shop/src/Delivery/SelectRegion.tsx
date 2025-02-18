import React, { FC, JSX, useState, ChangeEvent } from "react";

const SelectRegion: FC = (): JSX.Element => {
  const [regions, setRegions] = useState<string[]>([]);
  const [searchState, setsearchState] = useState<string>(""); //시도
  const [searchCity, setsearchCity] = useState<string>(""); //시군구

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setsearchState(e.target.value);
  };

  const filteredRegions = regions.filter((member) => {
    //아무튼 시도, 시군구 검색 함수
  });

  return (
    <div>
      <h3>배달 가능 지역</h3>
      <div>배달 리스트</div>
      <div>
        <h4>시도 선택</h4>
        <input type="text" value={searchState} onChange={handleSearchChange} />

        <h4>시군구 선택</h4>
        <input type="text" value={searchCity} onChange={handleSearchChange} />
      </div>
      <div>
        <div>시도 표시</div>
        <div>시군구 표시</div>
        <div>읍면동 표시</div>
      </div>
    </div>
  );
};

export default SelectRegion;
