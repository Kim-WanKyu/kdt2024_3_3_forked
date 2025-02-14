import React, { FC, JSX, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImagePicker from "../Component/ImagePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import ListPopup from "../Component/DeliveryListPopup";
import "./css/ArticleStyle.css";

const SaleArticle: FC = (): JSX.Element => {
  const { postId } = useParams<{ postId: string }>(); // ✅ URL에서 게시글 ID 가져오기
  const [data, setData] = useState<any | null>(null);
  const [sellerData, setSellerData] = useState<any | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isDelivery, setDelivery] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<{
    deliveryList: { delivery: string; count: string }[];
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/product/${postId}`
        );

        if (response.ok) {
          const result = await response.json();
          setData(result);

          // 판매자 정보 가져오기
          if (result.seller?.memberId) {
            const sellerResponse = await fetch(
              `${process.env.REACT_APP_API_URL}/api/member/${result.seller.memberId}`
            );
            if (sellerResponse.ok) {
              const sellerResult = await sellerResponse.json();
              setSellerData(sellerResult);
            } else {
              console.error("판매자 정보를 찾을 수 없습니다.");
            }
          }
        } else {
          console.error("해당 게시글을 찾을 수 없습니다.");
          alert("해당 게시글이 존재하지 않습니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("게시글 불러오기 오류:", error);
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [postId, navigate]);

  if (!data || !sellerData) {
    return <div>로딩 중...</div>;
  }

  const handleDeliveryModal = () => {
    setSelectedDelivery({
      deliveryList: [
        { delivery: "사용자", count: "1" },
        { delivery: "관리자", count: "2" },
        { delivery: "사용자", count: "3" },
      ],
    });
  };

  const handleChatClick = () => {
    if (isDelivery) {
      handleDeliveryModal();
    } else {
      navigate("/chatPage");
    }
  };

  return (
    <div style={{ maxWidth: "calc(100% - 100px)", margin: "0 auto" }}>
      {/* 🔹 카테고리 정보 */}
      <div className="div1">{data.category?.name}</div>

      {/* 🔹 이미지 슬라이드 */}
      <div className="div2">
        <ImagePicker
          images={data.productImages?.map((img: any) => img.imgUrl) || []}
        />
      </div>

      {/* 🔹 상품 정보 */}
      <div className="div3">
        <div style={{ width: "100px" }}>
          <FontAwesomeIcon icon={solidHeart} />
          {data.wishCount || 0}
        </div>
        <div style={{ width: "400px" }}>{data.tradePlace}</div>
        <div style={{ width: "100px" }}>{data.createDate?.split("T")[0]}</div>
      </div>
      <div className="div4">{data.title}</div>
      <div className="div5">{data.price.toLocaleString()} 원</div>

      {/* 🔹 거래 방식 선택 */}
      <div className="div6">
        <label>
          <input
            type="radio"
            name="deliveryMethod"
            value="direct"
            defaultChecked
            onChange={() => setDelivery(false)}
          />
          <span>직거래</span>
        </label>
        <label>
          <input
            type="radio"
            name="deliveryMethod"
            value="delivery"
            onChange={() => setDelivery(true)}
          />
          <span>배달</span>
        </label>
      </div>

      {/* 🔹 찜하기 및 채팅 버튼 */}
      <div className="div7">
        <button onClick={() => setIsLiked(!isLiked)}>
          <FontAwesomeIcon icon={isLiked ? solidHeart : regularHeart} />
          찜하기
        </button>
        <button onClick={handleChatClick}>채팅하기</button>{" "}
      </div>

      {/* 🔹 배달 리스트 팝업 */}
      {selectedDelivery && (
        <ListPopup
          deliveryList={selectedDelivery.deliveryList}
          onClose={() => setSelectedDelivery(null)}
        />
      )}

      {/* 🔹 상품 설명 */}
      <div className="div8">{data.detail}</div>

      {/* 🔹 판매자 정보 */}
      <div className="div9">
        <img
          src={sellerData.profileImage || "https://i.imgur.com/FBLyroc.jpg"}
          alt="판매자 프로필"
          style={{ width: "100px", height: "100px", borderRadius: "50%" }}
        />
        <div className="experiment">
          <div style={{ fontWeight: "bold" }}>{sellerData.name}</div>
          <div>{sellerData.phone}</div>
          <div>
            {sellerData.bank} {sellerData.account}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleArticle;
