import React, { FC, JSX, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

const AdminCustomerService: FC = (): JSX.Element => {
  const [articles, setArticles] = useState<
    {
      Nonumber: string;
      name: string;
      comment: number;
      ID: string;
      writer: string;
      date: string;
    }[]
  >([]);
  const [pages, setPages] = useState<number[]>([1]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const addQandA = (): void => {
    setArticles((prevQandAs) => {
      const newQandA = {
        Nonumber: String(prevQandAs.length + 1), // 숫자를 문자열로 변환
        name: `제목${prevQandAs.length + 1}`,
        comment: 1,
        ID: `ID${prevQandAs.length + 1}`,
        writer: `ID${prevQandAs.length + 1}`,
        date: "0000-00-00",
      };
      const newQandAs = [newQandA, ...prevQandAs];

      // 페이지 업데이트는 useState의 비동기적 특성을 고려하여 따로 처리
      setPages((prevPages) => {
        const newPageCount = Math.ceil(newQandAs.length / 10);
        return newPageCount !== prevPages.length
          ? Array.from({ length: Math.max(newPageCount, 1) }, (_, i) => i + 1)
          : prevPages;
      });

      return newQandAs;
    });
  };

  const handlePageClick = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const filteredArticles = articles.filter((QandA) => {
    return (
      QandA.name.includes(searchKeyword) || QandA.ID.includes(searchKeyword)
    );
  });

  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const displayedPages = pages.slice(startPage - 1, startPage + 9);

  return (
    <div>
      <div className="div_normal">
        <h3>고객문의 페이지</h3>
        <input
          type="text"
          placeholder="검색"
          value={searchKeyword}
          onChange={handleSearchChange}
        />
      </div>
      <div className="div_normal">
        <p>No.</p>
        <p>제목</p>
        <p>글쓴이</p>
        <p>작성시간</p>
      </div>
      <div>
        <button onClick={addQandA}>글 추가</button>
      </div>
      <div>
        {displayedArticles.map((article, index) => (
          <div key={index} className="member-item">
            <p>{article.Nonumber}</p>
            <p>
              <Link to={`/adminInquiry/${article.ID}`}>{article.name}</Link>
            </p>
            <p>{article.writer}</p>
            <p>{article.date}</p>
          </div>
        ))}
      </div>
      <div className="div_pagenaitor">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageClick(currentPage - 1)}
        >
          &lt;
        </button>
        {displayedPages.map((page) => (
          <div
            key={page}
            style={{
              margin: "0 5px",
              cursor: "pointer",
              fontWeight: page === currentPage ? "bold" : "normal",
            }}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </div>
        ))}
        <button
          disabled={currentPage === pages.length}
          onClick={() => handlePageClick(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AdminCustomerService;
