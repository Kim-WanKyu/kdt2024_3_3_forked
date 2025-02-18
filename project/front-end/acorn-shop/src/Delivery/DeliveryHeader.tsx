import React, { FC, JSX } from "react";
import { Link } from "react-router-dom";

const DeliveryHeader: FC = (): JSX.Element => {
  return (
    <header className="div_normal">
      <Link to="/member-control">
        <div className="logo">
          <h3>logo</h3>
        </div>
      </Link>
      <nav className="nav_normal">
        <ul>
          <li>
            <Link to="/deliverymain">메인</Link>
          </li>
          <li>
            <Link to="/select-region">배달 가능지역</Link>
          </li>
          <button>알람</button>
        </ul>
      </nav>
    </header>
  );
};

export default DeliveryHeader;
