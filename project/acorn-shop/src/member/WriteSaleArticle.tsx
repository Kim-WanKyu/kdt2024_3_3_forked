import React, { FC, JSX, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { auth, storage } from "../firebase";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { createProduct, ProductImageData } from "../api/save-product";
import { CustomHTTPError } from "../api/skel";

import "../main.scss";
import { Button, Form } from "react-bootstrap";
// 
// css 추가 02.12
// 

const WriteSaleArticle: FC = (): JSX.Element => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [Images, setImages] = useState<File[]>([]); // 파일 타입으로 변경. <= useState<{ name: string; base64: string }[]>([]);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDelivery, setIsDelivery] = useState<boolean>(false); // 직거래/배달 여부
  const [isNegotiable, setIsNegotiable] = useState<boolean>(true); // 가격 제안 가능 여부
  const [categories, setCategories] = useState<string[]>([]); // 카테고리 목록
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  
  const [isLoading, setLoading] = useState(false); // 로딩 중인지 여부.
  const [productImgs, setProductImgs] = useState<ProductImageData[]>([]);
  
  const fbProdImgBasicUrl = 'prod-img'; // 파이어베이스 Storage 상품 이미지 저장 기본 경로.


  // 카테고리 목록을 가져오는 함수
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/product/category`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(
          data.content.map((category: { name: string }) => category.name)
        ); // 카테고리 목록 설정
      } else {
        alert("카테고리 목록을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("카테고리 조회 오류:", error);
      alert("카테고리 조회 중 오류 발생");
    }
  };

  useEffect(() => {
    fetchCategories(); // 컴포넌트가 마운트되면 카테고리 목록을 불러옵니다.
  }, []);

  const generatePostId = (): string => {
    const date = new Date();
    const yyyymmdd = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters =
      letters[Math.floor(Math.random() * 26)] +
      letters[Math.floor(Math.random() * 26)];
    const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
    return `${randomLetters}${randomNumbers}${yyyymmdd}`;
  };

  // 사진 추가 버튼 클릭 시, 첨부한 이미지, 파일 변수로 저장하는 함수.. onChange()..
  const  AttachFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      
      const newFiles: File[] = [];
      if (files && files.length > 0) {
        for (let index = 0; index < files.length; index++) {
          if((index + Images.length) >= 5) {
            alert(`최대 5개 첨부 가능`);
            break;
          } // 5개까지 첨부 가능...

          const element = files[index];
          
          if (!element){
            alert(`element is null`);
          }
          if (!element.type.includes("image/")) {
            alert(`이미지 외 첨부 불가: ${element.name}`);
          }
          else if (element.size > 5 * 1024 * 1024) {
            alert(`5MB 이상 첨부 불가: ${element.name}`);
          }
          else {
            newFiles.push(element);
          }
        }
        setImages((prevFiles) => [...prevFiles, ...newFiles] );
      }
    }
  };
  // ㄴ Images 변경될 때 실행..
  useEffect(() => {
    if (Images.length > 0) {
      // 파일들을 setProductImgs 에 [{이름, url}] 형식으로 저장..
      const imgArr: ProductImageData[] = [];
      for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        // url은 임시로 ""..
        const tmpImgData: ProductImageData = { imgName: element.name, imgUrl: "" };
        imgArr.push(tmpImgData);
      }
      setProductImgs(imgArr);
    }
  }, [Images]);

  const handlePost = async () => {
    if (!title || price === null || !category || !address || !description) {
      alert("모든 항목을 입력해주세요!");
      return;
    } else if (title.length > 50) {
      alert("제목이 너무 깁니다. (50자 이하)");
      return;
    } else if (description.length > 150) {
      alert("설명이 너무 깁니다. (150자 이하)");    
      return;  
    }

    // 로그인 아니면, 상품 올리는 것 방지.
    if (!auth.currentUser) return;
    // 로딩 중이면, 상품 올리는 것 방지.
    if (isLoading) return;
    setLoading(true);

    const postId = generatePostId(); // 게시글 ID 생성
    const userId = auth.currentUser?.uid;

    try {
      // 파이어베이스 Storage 에 이미지 등록 하여 url 받아오기..
      if (Images.length > 0) {
        for (let index = 0; index < Images.length; index++) {
          const element = Images[index];
          // 이미지를 저장할 위치를 참조.
          const imgLocationRef = ref(storage, `${fbProdImgBasicUrl}/${userId}/${postId}/${index}`);
          // 이미지를 업로드하고, 업로드 결과에 대한 참조를 받음.
          const result = await uploadBytes(imgLocationRef, element);
          // 업로드된 이미지(result)의  URL을 가져옴.
          const url = await getDownloadURL(result.ref);

          // productImgs 에 url 넣어줌.
          productImgs[index].imgUrl = url;
        }
      }
    } catch (error) {
      // 이미지 저장 실패.
      // 파이어베이스 Storage 에 등록된 이미지 다시 삭제.
      const forderLocationRef = ref(storage, `${fbProdImgBasicUrl}/${userId}/${postId}`);
      const {items} = await listAll(forderLocationRef);
      const deletePromises = items.map((fileRef) => {deleteObject(fileRef)});
      await Promise.all(deletePromises);
      setLoading(false);
      console.log('이미지 저장 실패 - 이미지 삭제');
      return;
    }

    console.log('-- 파이어베이스 이미지 정상 등록');
    console.log(Images);
    console.log(productImgs);
    
    
    try{
      // 스프링부트 통해 DB에 저장..
      await createProduct(
        postId,
        userId,
        price,
        title,
        description,
        address,
        isDelivery,
        isNegotiable,
        category,
        productImgs
      );

      // 성공.
      console.log('-- 스프링부트 상품 정상 등록');
      alert("게시글이 등록되었습니다!");
      navigate(`/product/${postId}`);
    } catch(e) {
      // 실패.
      alert("게시글 저장 실패");

      if (e instanceof CustomHTTPError) {
        console.error(`게시글 저장 실패(c) - message: ${e.message}, status: ${e.status}`);
      } else {
        console.error(`게시글 저장 실패 - e: ${e}`);
      }

      // 상품 저장 실패.
      // 파이어베이스 Storage 에 등록된 이미지 다시 삭제.
      const forderLocationRef = ref(storage, `${fbProdImgBasicUrl}/${userId}/${postId}`);
      const {items} = await listAll(forderLocationRef);
      const deletePromises = items.map((fileRef) => {deleteObject(fileRef)});
      await Promise.all(deletePromises);

      console.log('스프링부트 상품 저장 실패 - 파이어베이스 이미지 삭제');
      setLoading(false);
      return;
    } finally {
      setLoading(false);
      return;
    }
    
  };

  return (
    <div className="m-5">
      <div className="mt-5 mb-3">
        <h3>제목</h3>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="m-auto w-50 mt-3"
        />
      </div>

      <div className="mb-3">
        <h3>가격설정</h3>
        <label>
          <Form.Check
            type="radio"
            name="priceOption"
            value="negotiable"
            checked={isNegotiable}
            onChange={() => setIsNegotiable(true)}
            className="m-2 d-inline-flex justify-content-center"
          />
          가격 제안 가능
        </label>
        <label>
          <Form.Check 
            type="radio"
            name="priceOption"
            value="fixed"
            checked={!isNegotiable}
            onChange={() => setIsNegotiable(false)}
            className="m-2 d-inline-flex justify-content-center"
          />
          가격 제안 불가능
        </label>
        <Form.Control
          type="number"
          value={price ?? ""}
          onChange={(e) =>
            setPrice(e.target.value ? Number(e.target.value) : null)
          }
          className="m-auto w-50 mt-3"
        />
      </div>

      <div className="mb-3">
        <h3>카테고리</h3>
        {categories.map((cat) => (
          <label key={cat}  
              className="m-2 d-inline-flex justify-content-center">
            <Form.Check
              type="radio"
              name="category"
              value={cat}
              checked={category === cat}
              onChange={(e) => setCategory(e.target.value)}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="mb-3">
        <h3>거래 위치</h3>
        <Form.Control type="text" value={address} readOnly
            className="m-auto w-50 mt-3 mb-2" />
        <Button onClick={() => setIsAddressModalOpen(true)}>주소 찾기</Button>
      </div>

      <div className="mb-3">
        <h3>상세 설명</h3>
        <Form.Control
          type="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="m-auto w-50 mt-3"
        />
      </div>

      <div className="mb-3">
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            AttachFiles(e);
          }}
        />
        <h3>사진 추가</h3>
        <Button onClick={() => fileInputRef.current?.click()}>사진 추가</Button>
      </div>

      <div>
        {Images.length > 0 &&
          Images.map((image, index) => (
            <div key={index}>
              <p>{image.name}</p>
              <Button
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
              >
                삭제
              </Button>
            </div>
          ))}
      </div>

      {isLoading 
        ? <Button type="button" >Loading</Button> 
        : <Button onClick={handlePost} size="lg" className="btn-success">게시하기</Button>
      }

      {isAddressModalOpen && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, 0)",
            zIndex: 1000,
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <DaumPostcode
            onComplete={(data) => {
              setAddress(data.address);
              setIsAddressModalOpen(false);
            }}
          />
          <Button onClick={() => setIsAddressModalOpen(false)}>닫기</Button>
        </div>
      )}
    </div>
  );
};

export default WriteSaleArticle;
