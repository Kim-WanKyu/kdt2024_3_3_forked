//package com.acornshop.constant;
//
//import jakarta.persistence.AttributeConverter;
//import jakarta.persistence.Converter;
//
//import jakarta.persistence.AttributeConverter;
//import org.springframework.data.geo.Point;
//import org.springframework.data.geo.Polygon;
//
//@Converter
//public class PolygonConverter implements AttributeConverter<Polygon, String> {
//
//    @Override
//    public String convertToDatabaseColumn(Polygon attribute) {
//        if (attribute == null) {
//            return null;
//        }
//        // Polygon 객체를 WKT(Well-Known Text) 형식으로 변환
//        return attribute.toString();  // 예시: WKT 형식으로 변환
//    }
//
//    @Override
//    public Polygon convertToEntityAttribute(String dbData) {
//        if (dbData == null) {
//            return null;
//        }
//        // WKT 형식의 String 데이터를 Polygon 객체로 변환하는 로직
//        // 예시: WKT 형식을 Polygon 객체로 변환
//        return new Polygon(new Point(1.2,2.2), new Point(2.2,3.2), new Point(6.2,2.2), new Point(1.2,2.2));  // 실제로는 WKT를 Polygon 객체로 변환해야 함
//    }
//}
