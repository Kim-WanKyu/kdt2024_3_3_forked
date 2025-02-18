import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MemberHeader from './member/MemberHeader';
import DeliveryMain from './Delivery/DeliveryMain';
import SaleArticle from './member/SaleArticle';
import WriteInquiry from './member/WriteInquiry';
import MemberChat from './Chatting/MemberChat';
import CustomerService from './member/CustomerService';
import MyPage from './member/MyPage';
// import MemberControl from './pages/MemberControl';
import './main.scss';
import { useEffect, useState } from 'react';
import ProductList from './member/ProductList';
import ArticleAdminControl from './Admin/ArticleAdminControl';
import AdminHeader from './Admin/AdminHeader';
import DeliveryHeader from './Delivery/DeliveryHeader';
import CategoryControl from './Admin/CategoryControl';
import MemberControl from './Admin/MemberControl';
import WriteSaleArticle from './member/WriteSaleArticle';


function App() {
  const [message, setMessage] = useState([]);

  useEffect(() => {
    fetch("test").then((response) => {
        return response.json();
      })
      .then(function (data) {
        setMessage(data);
      });
  }, []);

  return (
    <div className="App">
      {/* <MemberControl /> */}
    <BrowserRouter>

      {/* 
      <div id="header-div">
        {isHeader1 ? <Deliveryheader /> : <MemberHeader />}
        <button onClick={swapHeaders}>
          스왑
        </button>
      </div> 
      */}
<MemberHeader/>
{/* <DeliveryHeader /> */}
<Routes>
  {/* <Route path="/article-admin" element={<ArticleAdminControl />} />
  <Route path="/member-control" element={<MemberControl />} />
  <Route path="/category-control" element={<CatecoryControl />} />
  <Route
    path="/admin-CustomerService"
    element={<AdminCustomerService />}
  />
  <Route path="/adminInquiry/:id" element={<AdminInquiry />} /> */}

{/* 로그인 회원가입 화면 */}
  <Route path='/login' element={<><Login /></>} />
  <Route path='/register' element={<><Register /></>} />
  <Route path='/find-account' element={<>아이디 / 비밀번호 찾기</>} />

{/* 일반회원 화면 */}
  <Route path='/mypage/info' element={<><MyPage /></>} />
  <Route path='/mypage/trades' element={<>마이페이지-거래목록</>} />
  <Route path='/mypage/chat' element={<><MemberChat /></>} />
  <Route path='/mypage/favorites' element={<>마이페이지-찜</>} />
  <Route path='/mypage/qna' element={<><CustomerService /></>} />
  <Route path='/mypage/qna/new' element={<><WriteInquiry /></>} />

  {/* <Route path="/" element={<>HOME</>} /> */}
  <Route path="/list" element={<><ProductList /></>} />
  <Route path="/" element={<><ProductList /></>} />{" "}
  <Route path="/product/:postId" element={<><SaleArticle /></>} />
  <Route path="/product/new" element={<><WriteSaleArticle /></>} />
  {/* 판매글 작성 페이지 */}


{/* 관리자 화면 */}
  <Route path="/admin/member-control" element={<><AdminHeader/><MemberControl /></>} />
  <Route path="/admin/category-control" element={<><AdminHeader/><CategoryControl /></>} />
  <Route
    path="/admin/article-control"
    element={<><AdminHeader/><ArticleAdminControl /></>}
  />

</Routes>


    </BrowserRouter>
    </div>
  );
}

export default App;
