import React, { FC, JSX, useState, ChangeEvent, useEffect } from "react";
import "./css/CustomerService.css";
import BasicLink from "../Component/StyledComponent";
import { Button, Form, InputGroup, Pagination } from "react-bootstrap";
import axios from "axios";
import '../main.scss';

const CustomerService: FC = (): JSX.Element => {
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

  


  const [state, setState] = useState({
    data: [],
    limit: 10,
    activePage: 1
  });
  useEffect(() => {
    axios
      .get(
        `https://jsonplaceholder.typicode.com/posts?_page=1&_limit=${state.limit}`
      )
      .then((res) => {
        setState((prev) => ({
          ...prev,
          data: res.data
        }));
      })
      .catch((error) => console.log(error));
  }, [state.limit]);
  const handlePageChange = (pageNumber: number) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));

    axios
      .get(`https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}`)
      .then((res) => {
        setState((prev) => ({
          ...prev,
          data: res.data
        }));
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="customer-service-wrap">
      <div className="customer-service-header">
        <div>
          <h5 className="fw-bold">고객 문의</h5>
        </div>
        
        <div className="d-flex gap-3">

          <InputGroup>
            <Form.Control
              placeholder="search"
              aria-label="qna-search"
              aria-describedby="qna-search-bar"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Button variant="outline-primary" id="qna-search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
            </Button>
          </InputGroup>
          <div className="w-50">
          <Button> 
            <BasicLink to={`/mypage/qna/new`} style={{color: "white"}}>문의하기</BasicLink>
          </Button>
          </div>
        </div>

      </div>
      
      <hr />

      <div className="customer-service-body">
        <>
          <div className="customer-service-list-head">
            <p>No.</p>
            <p>제목</p>
            <p>글쓴이</p>
            <p>작성시간</p>
          </div>
          <hr />
        </>

        {/* 문의글 리스트 */}
        <div className="customer-service-list">

          {displayedArticles.map((article, index) => (
            <>
              <div key={index} className="customer-service-list-item">
                <p>{article.Nonumber}</p>
                <p>
                  <BasicLink to={`/adminInquiry/${article.ID}`}>
                    {article.name}
                  </BasicLink>
                </p>
                <p>{article.writer}</p>
                <p>{article.date}</p>
              </div>
              <hr />
            </>
          ))}

        </div>
              
        <Pagination className="px-4 justify-content-center">
          {state.data.map((_, index) => {
            return (
              <Pagination.Item
                onClick={() => handlePageChange(index + 1)}
                key={index + 1}
                active={index + 1 === state.activePage}
              >
                {index + 1}
              </Pagination.Item>
            );
          })}
        </Pagination>
      </div>
      {/* 임시 */}


      {/* <div className="pagenaitor-wrap">
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
      </div> */}

    </div>
  );
};

export default CustomerService;
