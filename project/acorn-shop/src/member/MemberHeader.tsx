import styled from "styled-components";
import "./css/Header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../main.scss';
import { auth } from "../firebase";
import { useEffect, useState } from "react";

const NavLink = styled(Link)`
  width: 100%;
  color: #888888;
  font-size: 14px;
  margin: 0 5px;
`;
const MenuLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: var(--main-color);
  font-size: 18px;
  font-weight: bold;
  margin: 0 10px;

`;
const LogoLink = styled(Link)`
  text-decoration: none;
  color: var(--main-color);
`;


export default function Header() {
  const navigate = useNavigate();

  const location = useLocation();
  const [isAdminPage, setIsAdminPage] = useState(true);

  useEffect(() => {
    location.pathname === "/admin/member-control"
    || location.pathname === "/admin/category-control"
    || location.pathname === "/admin/article-control"
      ? setIsAdminPage(true)
      : setIsAdminPage(false);
  }, [location.pathname, setIsAdminPage]);

  if (isAdminPage) return null;

  

  return (
    <div className="header-wrap">
      <header className="header">

        {/* 로고 */}
        <div className="logo-wrap">
          <LogoLink to="/list">
            <div className="logo-text">도토리마켓</div>
          </LogoLink>
        </div>

        {/* 검색창 */}
        <div className="search-bar-wrap">
          <input className="search-bar" type="text" placeholder="검색어를 입력하세요." />
        </div>

        {/* 메뉴바 */}
        <nav className="menu-bar">
          <MenuLink to="/product/new">판매하기</MenuLink>
          <MenuLink to="/mypage/info">내 거래</MenuLink>
          <MenuLink to="/mypage/info">마이페이지</MenuLink>
        </nav>


        {/* 로그인 회원가입 */}
        {
          !auth.currentUser ?
          <nav className="nav-bar">
            <NavLink to="/login">로그인</NavLink>
            <NavLink to="/register">회원가입</NavLink>
          </nav>
          :
          <nav className="nav-bar">
            <NavLink to="/" onClick={ () => {
              navigate("/");
              auth.signOut();
            }}>로그아웃</NavLink>
          </nav>
        }

      </header>
      <hr/>
    </div>
  );
}