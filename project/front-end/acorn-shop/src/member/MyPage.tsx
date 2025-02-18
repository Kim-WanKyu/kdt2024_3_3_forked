import { Tab, Tabs } from "react-bootstrap";
import MemberChat from "../Chatting/MemberChat";
import CustomerService from "./CustomerService";
import "./css/MyPage.css"
import '../main.scss';
import { useNavigate } from 'react-router-dom';
import MyInfo from "./MyInfo";

const MyPage = () => {

  const navigate = useNavigate();


    return (
        <div className="mypage-wrap">
        <div className="mypage-profile-wrap">


        </div>

        <div className="mypage-tab-menu-wrap">

    <Tabs
      defaultActiveKey="info"
      id="mypage-tabs"
      className="mb-3"
      fill
    >
      <Tab eventKey="info" title="내 정보">
        <MyInfo />
      </Tab>
      <Tab eventKey="trades" title="내 거래">
        Tab content for Profile
      </Tab>
      <Tab eventKey="chat" title="채팅">
        <MemberChat />
      </Tab>
      <Tab eventKey="favorites" title="찜 보기">
        Tab content for favorites
      </Tab>
      <Tab eventKey="qna" title="내 문의">
        <CustomerService />
      </Tab>
    </Tabs>
        </div>
        </div>
    );
}

export default MyPage;