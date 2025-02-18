import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import "./css/Header.css";
import { Link } from "react-router-dom";

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

export default function Header() {
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  const menuLinkRef = useRef<HTMLLIElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = () => {
    if (menuLinkRef.current) {
      const rect = menuLinkRef.current.getBoundingClientRect();
      setSubmenuPosition({
        top: rect.top + window.scrollY + rect.height,
        left: rect.left + window.scrollX,
      });
    }
    setSubmenuOpen((prev) => !prev);
  };

  const closeSubmenu = (e: MouseEvent) => {
    if (
      submenuRef.current &&
      menuLinkRef.current &&
      !submenuRef.current.contains(e.target as Node) &&
      !menuLinkRef.current.contains(e.target as Node)
    ) {
      setSubmenuOpen(false);
    }
  };

  // 서브메뉴 항목 클릭 시 서브메뉴 닫기
  const closeSubmenuOnClick = () => {
    setSubmenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", closeSubmenu);
    return () => {
      document.removeEventListener("click", closeSubmenu);
    };
  }, []);

  return (
    <div className="header-wrap">
      <header className="header">
        <div className="logo-wrap">
          <div className="logo-text">도토리상점</div>
        </div>

        <nav className="menu-bar">
          <li onClick={toggleSubmenu} ref={menuLinkRef}>
            홈페이지 관리
          </li>
          <MenuLink to="#">고객문의 관리</MenuLink>
        </nav>

        <div className="nav-bar-wrap">
          <nav className="nav-bar">
            <NavLink to="/logout">로그아웃</NavLink>
          </nav>
        </div>

        {isSubmenuOpen && (
          <div
            className="submenu"
            ref={submenuRef}
            style={{
              top: `${submenuPosition.top}px`,
              left: `${submenuPosition.left}px`,
            }}
          >
            <ul>
              <li>
                <MenuLink
                  to="/admin/member-control"
                  onClick={closeSubmenuOnClick}
                >
                  회원 관리
                </MenuLink>
              </li>
              <li>
                <MenuLink
                  to="/admin/article-control"
                  onClick={closeSubmenuOnClick}
                >
                  상품 관리
                </MenuLink>
              </li>
              <li>
                <MenuLink
                  to="/admin/category-control"
                  onClick={closeSubmenuOnClick}
                >
                  카테고리 관리
                </MenuLink>
              </li>
            </ul>
          </div>
        )}

        <hr />
      </header>
    </div>
  );
}
