# Task_Test

## Day1

Project init & 파일/폴더/프로젝트 구조 세팅 및 프로젝트 전체 구상  
Router 설정
Nav 설정
tailwind 테마분리
로그인페이지?
특이사항 : taliwind v4(latest) 초기 설정 방법이 그 전 버전과 크게 달라짐\

## Day2

api 기본 설정 및 컨셉 실증  
페이지별 api작성(2/?)

## Day3

Payments, MerchantList Page 작성,
특이사항 : 대시보드 혹은 데이터의 최신화가 중요하다고 생각되어 ReactQuery를 사용하는데 페이지에 재접속할때마다 axios 요청을 보내면 store에 저장한 정보가 쓸모없는게 아닌가? 즉, store가 필요 없는 상태가 아닌가 의문
staleTime(데이터 폐기 시간)을 느리게 설정한다면 실시간성이 떨어지고, 테스트가 아닌 실무에서 적용한다면 Etag등의 도움을 받아 최신화를 하면 된다고 판단하여 일단 현재 구조(즉시 refetch)를 유지.
