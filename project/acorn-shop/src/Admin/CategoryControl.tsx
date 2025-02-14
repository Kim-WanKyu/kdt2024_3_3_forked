import React, { FC, useState, ChangeEvent, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import "./css/CategoryControl.css"; // CSS 파일을 import

const CategoryControl: FC = () => {
  const [inputCategory, setAddCategory] = useState<string>(""); // 새 카테고리 입력값
  const [category, setCategorys] = useState<
    { categorylabel: string; id: number }[]
  >([]); // 카테고리 목록
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태

  // 카테고리 목록을 가져오는 함수
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product/category?page=1&size=10`
      );
      if (response.ok) {
        const data = await response.json();
        setCategorys(
          data.content.map((item: { name: string; id: number }) => ({
            categorylabel: item.name,
            id: item.id,
          }))
        ); // 카테고리 목록 설정
      } else {
        alert("카테고리 목록을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("카테고리 조회 오류:", error);
      alert("카테고리 조회 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(); // 컴포넌트가 마운트되면 카테고리 목록을 불러옵니다.
  }, []);

  // 카테고리 추가 함수
  const addCategory = async (): Promise<void> => {
    if (!inputCategory.trim()) return; // 빈 문자열 방지

    const newCategory = { name: inputCategory };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product/category`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCategory),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategorys((prevCategories) => [
          ...prevCategories,
          { categorylabel: data.name, id: data.id },
        ]);
        setAddCategory(""); // 입력 필드 초기화
      } else {
        alert("카테고리 추가 실패");
      }
    } catch (error) {
      console.error("카테고리 추가 오류:", error);
      alert("카테고리 추가 중 오류 발생");
    }
  };

  // 카테고리 삭제 함수
  const deleteCategory = async (id: number, index: number): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product/category/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCategorys((prevCategorys) => {
          const newCategorys = [...prevCategorys];
          newCategorys.splice(index, 1); // 해당 인덱스의 멤버 삭제
          return newCategorys;
        });
      } else {
        alert("카테고리 삭제 실패");
      }
    } catch (error) {
      console.error("카테고리 삭제 오류:", error);
      alert("카테고리 삭제 중 오류 발생");
    }
  };

  return (
    <div className="category-control-container">
      <div className="category-list">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : category.length === 0 ? (
          <p>카테고리가 없습니다.</p>
        ) : (
          category.map((item, index) => (
            <div key={item.id} className="category-item">
              <div className="category-item-content">
                <span>{item.categorylabel}</span>
                <div
                  onClick={() => deleteCategory(item.id, index)}
                  className="delete-icon"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="category-add">
        <h4>카테고리 추가</h4>
        <input
          type="text"
          value={inputCategory}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setAddCategory(e.target.value)
          }
          style={{ maxWidth: "calc(100% - 100px)", margin: "0 auto" }}
          className="category-input"
          placeholder="카테고리 입력"
        />
        <button onClick={addCategory} className="add-button">
          추가
        </button>
      </div>
    </div>
  );
};

export default CategoryControl;
