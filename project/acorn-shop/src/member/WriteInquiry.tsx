import React, { FC, JSX, useState, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

import '../main.scss';

const WriteInquiry: FC = (): JSX.Element => {
  const [Images, setImages] = useState<{ name: string; base64: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일 선택 창 열기
  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Base64 변환 함수
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // 파일 업로드 핸들러
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const fileArray = Array.from(event.target.files);

      // 각 파일을 Base64로 변환
      const base64Array = await Promise.all(
        fileArray.map(async (file) => ({
          name: file.name,
          base64: await convertToBase64(file),
        }))
      );

      setImages((prevImages) => [...prevImages, ...base64Array]);
    }
  };

  // 이미지 삭제 함수
  const deleteImage = (index: number): void => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="page-wrap">
      <div className="page-h5" style={{ marginLeft:"100px" }}>
        <h5 className="p-4 fw-bold w-100 d-flex">문의하기</h5>
      </div>
      <Form className="w-75 m-auto">
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label className="fw-bold">제목</Form.Label>
          <Form.Control type="text" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="fw-bold">내용</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <Form.Group controlId="formFileMultiple" className="mb-3">
          <Form.Label className="fw-bold">사진</Form.Label>
          <Form.Control 
              type="file" multiple
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
          />
          {/* 업로드된 파일 목록 */}
          
          <div className="rounded border overflow-scroll" 
                  style={{height:"100px", borderColor: "lightgray"}}>
            {Images.length > 0 && (
              <div>
              {Images.map((image, index) => (
                <div key={index} 
                    className="d-flex justify-content-center gap-2 mt-1"
                     >
                  <span className="text-sm-left">{image.name}</span>
                  <Button variant="light" size="sm" onClick={() => deleteImage(index)}>삭제</Button>
               </div>
            ))}
          </div>
        )}
      </div>
        </Form.Group>

        <Button variant="light" className="mt-3" 
                style={{padding:"10px 20px"}}
        >게시하기</Button>
      </Form>


    </div>
  );
};

export default WriteInquiry;
