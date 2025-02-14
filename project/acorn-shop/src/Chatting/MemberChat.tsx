import React, { FC, JSX, useState, useEffect } from "react";
import Chat from "./component/ChatComponent";
import '../main.scss';

const MemberChat: FC = (): JSX.Element => {
  const [chatList, setChatList] = useState<
    { name: string; product: string; date: string }[]
  >([]);

  const fakeDB = [
    { name: "멤버1", product: "물건1", date: "2025-02-03" },
    { name: "멤버2", product: "물건2", date: "2025-02-04" },
    { name: "멤버3", product: "물건3", date: "2025-02-05" },
  ];

  useEffect(() => {
    setTimeout(() => {
      setChatList(fakeDB);
    }, 500);
  }, []);

  return (
    <div>
      <div>
        채팅 리스트
        <div>채팅인원</div>
      </div>
      <div>
        <div>
          <div>채팅상대 이름</div>
          <div>판매제품</div>
          <div>시간</div>
        </div>
        <div>제품</div>
        <button>판매확정</button>
      </div>
      
      <Chat />
    </div>
  );
};

export default MemberChat;
