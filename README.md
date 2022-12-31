# 💫 TRACK 1 SERVER

### <strong> 💻 ERD </strong>

<br/>
<img width="637" alt="스크린샷 2022-12-31 오후 2 35 29" src="https://user-images.githubusercontent.com/86148470/210127180-52a41baa-71dd-481c-ba87-f218c101b03b.png">
<br/>
<br/>

### <strong> 👩🏻‍💻 역할 분담 </strong>
<img width="705" alt="스크린샷 2022-12-31 오후 3 20 58" src="https://user-images.githubusercontent.com/86148470/210127304-762814aa-6323-40ee-85b4-282d64c06931.png">


<br>

### <strong> 🏃 Used 🏃 </strong>
<br>
<p>
<img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
<img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img alt="Prisma" src="https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white"/>
<img alt="AWS" src="https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white"/><br>
<img alt="Prettier" src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black"/>
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=for-the-badge&logo=ESLint&logoColor=white"/>
</p>
  
<br>

## 🏃 Coding Convention 🏃
<br>
<details markdown="1">
<summary>네이밍</summary>

### DB

- DB 이름은 **UpperCamelCase**를 사용합니다.

<br>

### 함수, 변수, 타입
- 함수와 변수에는 **lowerCamelCase**를 사용합니다.
- 함수명은 동사로 시작합니다.
- 타입명은 **파스칼케이스**를 사용합니다.
  - interface이름에 I를 붙이지 않습니다.
- 기본 클래스 파일을 생성하거나 컴포넌트를 생성할 때는 약어 규칙에 따라 네이밍합니다.  

<br>

### 변수 네이밍

- `사진` → photo
- `유저` → user 
- `배열을 담은 변수`→ ~s(복수형)
- `상태` → status 

---
</details>

<br>

## ✉️ Commit Strategy

```
feature : 새로운 기능 추가
fix : 버그 수정
docs : 문서 수정
test : 테스트 코드 추가
refactor : 코드 리팩토링
style : 코드 의미에 영향을 주지 않는 변경사항
chore : 빌드 부분 혹은 패키지 매니저 수정사항
```
<br>

## 🗂 프로젝트 폴더링

```jsx

📦 config             
 ┣ 📜 index.ts
 ┗ 📜 s3Config.ts

📦 controller               
 ┣ 📜 index.ts
 ┗ 📜 mypageController.ts
 ┗ 📜 profileController.ts
 ┗ 📜 tracksController.ts
 ┗ 📜 userController.ts
 ┗ 📜 vocalsController.ts

📦 interfaces                
 ┗ 📂 user
 ┃ ┣ 📜 index.ts
 ┃ ┗ 📜 ProducerCreateDTO.ts
 ┃ ┗ 📜 UserLogInDTO.ts
 ┃ ┗ 📜 vocalsController.ts
 ┗ 📜 index.ts
 
 📦 middlewares               
 ┗ 📂 S3download
 ┃ ┣ 📜 index.ts
 ┗ 📂 S3upload
 ┃ ┣ 📜 index.ts
 ┃ ┗ 📜 uploadCommentWav.ts
 ┃ ┗ 📜 uploadProfileImage.ts
 ┃ ┗ 📜 uploadWavAndImage.ts
 ┗ 📂 user
 ┃ ┣ 📜 auth.ts
 ┃ ┗ 📜 index.ts
 ┃ ┗ 📜 validator.ts
 ┗ 📜 index.ts

📦 constants                  
 ┣ 📜 index.ts
 ┣ 📜 responseMessage.ts
 ┗ 📜 reponse.ts
 ┗ 📜 statusCode.ts
 ┗ 📜 tokenType.ts

📦 modules                   
 ┗ 📜 jwtHandler.ts

📦 router                   
 ┣ 📜 index.ts
 ┗ 📜 mypageRouter.ts
 ┗ 📜 profileRouter.ts
 ┗ 📜 tracksRouter.ts
 ┗ 📜 userRouter.ts
 ┗ 📜 vocalsRouter.ts
 
📦 service                  
 ┣ 📜 index.ts
 ┗ 📜 mypageService.ts
 ┗ 📜 profileService.ts
 ┗ 📜 tracksService.ts
 ┗ 📜 userService.ts
 ┗ 📜 vocalsService.ts
 
📜 index.ts
```

## ✨ Branch Strategy
<br>
	
### 🌴 브랜치
#### 📌 브랜치 단위
- 브랜치 단위 = 이슈 단위 = PR단위

#### 📌 브랜치명
- 브랜치는 뷰 단위로 생성합니다.
- 브랜치 규칙 → feature/#이슈번호
- `ex) feature/#1`
- 탭이름 - yewon, minwook 
- 공통적인 것 작업 - Global
    - feature/chore/fix/network

<br>
## <strong> API 로직 구현 진척도 : 100% </strong>
<br>
<br>

## <strong> API 명세서 초안 링크 </strong>

[API 명세서](https://granite-allosaurus-84c.notion.site/API-Docs-76a02ccc9b4e4fe9bd4dc48335242ec5)

<br>





