import React, { FC, useState, useEffect, ChangeEvent } from "react";
import ChatPopup from "../Component/ChatPopup";
import { useNavigate, Link } from "react-router-dom";
import "./css/BoardStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";

const ArticleAdminControl: FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<
    | {
        isSelected: boolean;
        title: string;
        writer: string;
        day: string;
        price: number;
        detail: string;
        category: string;
        ID: string;
      }[]
    | []
  >([]);
  const [pages, setPages] = useState<number[]>([1]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const [openArticleId, setOpenArticleId] = useState<string | null>(null);
  const [chatList, setChatlist] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<{
    chatTitle: string;
    messages: { sender: string; text: string }[];
  } | null>(null);

  // 상품 데이터를 서버에서 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/all_products`
        );
        if (!response.ok) {
          throw new Error(`서버 응답 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log("API 응답 데이터:", data); // 응답 확인

        if (!Array.isArray(data)) {
          throw new Error("유효한 데이터 형식이 아닙니다.");
        }

        const productsWithId = data.map((product: any) => ({
          isSelected: false,
          title: product.title || "제목 없음",
          writer: product.seller?.name || "작성자 없음",
          day: product.createDate
            ? new Date(product.createDate).toLocaleDateString()
            : "날짜 없음",
          price: 0,
          detail: "",
          category: "",
          ID: product.productId,
        }));

        setArticles(productsWithId);

        const newPageCount = Math.ceil((data.length || 0) / 10);
        setPages(
          Array.from({ length: Math.max(newPageCount, 1) }, (_, i) => i + 1)
        );
        setCurrentPage((prev) => Math.min(prev, newPageCount));
      } catch (error) {
        console.error("게시물 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, [currentPage]);

  // 개별 상품 삭제
  const deleteArticle = async (productID: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product/${productID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("상품 삭제 실패");
      }

      setArticles((prevArticles) => {
        const newArticles = prevArticles.filter(
          (article) => article.ID !== productID
        );
        const newPageCount = Math.ceil(newArticles.length / 10);
        setPages(
          Array.from({ length: Math.max(newPageCount, 1) }, (_, i) => i + 1)
        );
        setCurrentPage((prev) => Math.min(prev, Math.max(newPageCount, 1)));
        return newArticles;
      });
    } catch (error) {
      console.error("상품 삭제 중 오류 발생:", error);
    }
  };

  // 게시글 검색
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  // 선택된 상품 삭제
  const deleteSelectedArticles = async (): Promise<void> => {
    try {
      const selectedIDs = articles
        .filter((article) => article.isSelected)
        .map((article) => article.ID);

      // 삭제 요청을 병렬로 처리
      await Promise.all(
        selectedIDs.map((productID) =>
          fetch(`${process.env.REACT_APP_API_URL}/api/product/${productID}`, {
            method: "DELETE",
          }).then((response) => {
            if (!response.ok) throw new Error(`삭제 실패: ${productID}`);
          })
        )
      );

      setArticles((prevArticles) => {
        const newArticles = prevArticles.filter(
          (article) => !article.isSelected
        );
        const newPageCount = Math.ceil(newArticles.length / 10);
        setPages(
          Array.from({ length: Math.max(newPageCount, 1) }, (_, i) => i + 1)
        );
        setCurrentPage((prev) => Math.min(prev, Math.max(newPageCount, 1)));
        return newArticles;
      });
    } catch (error) {
      console.error("선택된 상품 삭제 중 오류 발생:", error);
    }
  };

  // 선택된 게시글 선택/해제
  const toggleMemberSelected = (articleID: string): void => {
    setArticles((prevArticles) =>
      prevArticles.map((article) =>
        article.ID === articleID
          ? { ...article, isSelected: !article.isSelected }
          : article
      )
    );
  };

  // 선택된 게시글 모두 선택/해제
  const toggleAllMembers = (isChecked: boolean) => {
    setArticles((prevArticles) =>
      prevArticles.map((article) => ({
        ...article,
        isSelected: isChecked,
      }))
    );
  };

  // 게시글 열기
  const toggleChatlistOpen = (articleID: string) => {
    if (openArticleId === articleID) {
      setOpenArticleId(null);
    } else {
      setOpenArticleId(articleID);
      setChatlist(["멤버" + articleID, "멤버2", "멤버3"]);
    }
  };

  // 채팅 클릭
  const handleChatClick = (chatTitle: string) => {
    setSelectedChat({
      chatTitle,
      messages: [
        { sender: "사용자", text: "안녕하세요!" },
        { sender: "관리자", text: "네, 무엇을 도와드릴까요?" },
        { sender: "사용자", text: "문의 사항이 있어요." },
      ],
    });
  };

  const filteredArticles = articles.filter(
    (article) =>
      article.title.includes(searchKeyword) ||
      article.writer.includes(searchKeyword)
  );

  const displayedArticles = filteredArticles.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const displayedPages = pages.slice(startPage - 1, startPage + 9);

  // 게시글 클릭 시 상세 페이지로 이동
  const handleArticleClick = (articleID: string) => {
    navigate(`/product/${articleID}`);
  };

  return (
    <div>
      <h3 style={{ marginLeft: "30px" }}>게시글 관리 페이지</h3>
      <div style={{ maxWidth: "calc(100% - 100px)", margin: "0 auto" }}>
        <div className="div1">
          <div className="div1-left">
            <input
              type="text"
              placeholder="검색"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
          </div>
          <button className="div1-item3" onClick={deleteSelectedArticles}>
            선택 삭제
          </button>
        </div>
        <div className="div2">
          <div className="div-check">
            <input
              type="checkbox"
              className="custom-checkbox"
              onChange={(e) => toggleAllMembers(e.target.checked)}
              style={{ marginLeft: "15px" }}
            />
          </div>
          <p className="column-title">게시물 제목</p>
          <p className="column-writer">작성자</p>
          <p className="column-day" style={{ marginRight: "70px" }}>
            작성일자
          </p>
        </div>
        <div className="div-item">
          {displayedArticles.map((article) => (
            <div key={article.ID} className="div-items">
              <div className="div-check">
                <input
                  type="checkbox"
                  checked={article.isSelected}
                  className="custom-checkbox"
                  onChange={() => toggleMemberSelected(article.ID)}
                />
              </div>
              <span
                className="column-title"
                onClick={() => handleArticleClick(article.ID)}
              >
                {article.title}
              </span>
              <span className="column-writer">{article.writer}</span>
              <span className="column-day">{article.day}</span>
              <div
                onClick={() => toggleChatlistOpen(article.ID)}
                className="delete-button"
                style={{ paddingRight: "10px" }}
              >
                <FontAwesomeIcon icon={faComment} />
              </div>
              <div
                onClick={() => deleteArticle(article.ID)}
                className="delete-button"
                style={{ marginRight: "30px" }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
              {openArticleId === article.ID && (
                <div>
                  {chatList.map((chat, index) => (
                    <div
                      key={index}
                      onClick={() => handleChatClick(chat)}
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      {chat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        {selectedChat && (
          <ChatPopup
            chatTitle={selectedChat.chatTitle}
            messages={selectedChat.messages}
            onClose={() => setSelectedChat(null)}
          />
        )}
        <div className="div3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
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
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </div>
          ))}
          <button
            disabled={currentPage === pages.length}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleAdminControl;
