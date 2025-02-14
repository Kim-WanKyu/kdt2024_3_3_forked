import { Form, Image } from "react-bootstrap";
import "../main.scss";
import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { ProductImageData } from "../api/save-product";
import ImagePicker from "../Component/ImagePicker";

const ProductList:FC = () => {
    const [category, setCategory] = useState<string[]>([]);
    const { postId } = useParams<{ postId: string }>();
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
          productImages: any;
        }[]
      | []
    >([]);  
  const [openArticleId, setOpenArticleId] = useState<string | null>(null);

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
          productImages: product.productImages?.map((img: any) => img.imgUrl) || [],
        }));

        setArticles(productsWithId);

      } catch (error) {
        console.error("게시물 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchProducts();
  }, []);

  // 게시글 열기
  const toggleChatlistOpen = (articleID: string) => {
    if (openArticleId === articleID) {
      setOpenArticleId(null);
    } else {
      setOpenArticleId(articleID);
    }
  };
  // 게시글 클릭 시 상세 페이지로 이동
  const handleArticleClick = (articleID: string) => {
    navigate(`/product/${articleID}`);
  };

    return (
        <div>
            <div className="mb-3">
        {[
          "패션/잡화",
          "생활가전",
          "취미/게임/음반",
          "식품",
          "티켓/교환권",
          "기타",
        ].map((cat) => (
          <label key={cat} className="m-2 d-inline-flex justify-content-center">
            <Form.Check
              type="checkbox"
              value={cat}
              onChange={(e) => {
                setCategory((prev) =>
                  e.target.checked
                    ? [...prev, e.target.value]
                    : prev.filter((c) => c !== cat)
                );
              }}
            />
            {cat}
          </label>
        ))}
      </div>
      <div className="m-3">
            {/* 아이템 */}
            {/* <div className="border rounded w-25"
                onClick={()=>{
                    navigate(`/product/:postId`); //post id 로 이동
                }}
            >
                <img src="https://placehold.co/200" 
                    alt="img"
                    className="mw-100"
                />
                <div className="d-flex justify-content-between mt-3 ms-3 mx-3">
                    <p>상품 이름</p>
                    <p>상품 가격</p>
                </div>
                <div className="d-flex justify-content-between ms-3 mx-3">
                    <p>거리</p>
                </div>
            </div> */}
            <div className="d-flex gap-1">
            {articles.map((article) => (
            <div key={article.ID}
              onClick={() => handleArticleClick(article.ID)}
              className="border rounded w-25"  
            >
                <img
                  src={article.productImages[0] ?? "https://i.imgur.com/HCe1Gv1.png"}
                    className="mw-100 mb-3"
                />

                <div className="d-flex justify-content-between ms-3 mx-3">
                    <p className="">{article.title}</p>
                    <p>{article.price.toLocaleString()}원</p>
                </div>
                <div className="d-flex justify-content-between ms-3 mx-3">
                    <p>{article.writer}</p>
                    <p>{article.day}</p>
                </div>

            </div>
          ))}
            </div>
        </div>
        </div>
    );
}

export default ProductList;