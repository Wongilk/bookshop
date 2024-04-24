INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩팥..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2023-12-07");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2023-10-01");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..!", "김해님", 100, "목차입니다.", 20000, "2023-07-16");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2023-03-01");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2023-02-01");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백석..", "김심청", 100, "목차입니다.", 20000, "2023-01-15");

INSERT INTO books (title, img, categoryId, form, isbn, summary, detail, author, pages, contents, price, pubDate)
VALUES ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2023-06-05");

// 카테고리 이름 추가해서
select * from books left join categories on books.categoryId = categories.id where books.id = 1;

INSERT INTO likes (userId, likedBookId) VALUES (1, 1);
INSERT INTO likes (userId, likedBookId) VALUES (1, 2);
INSERT INTO likes (userId, likedBookId) VALUES (1, 3);
INSERT INTO likes (userId, likedBookId) VALUES (3, 1);
INSERT INTO likes (userId, likedBookId) VALUES (4, 4);
INSERT INTO likes (userId, likedBookId) VALUES (2, 1);
INSERT INTO likes (userId, likedBookId) VALUES (2, 2);
INSERT INTO likes (userId, likedBookId) VALUES (2, 3);
INSERT INTO likes (userId, likedBookId) VALUES (2, 5);

// 도서에 대한 좋아요 수
SELECT *, (select count(*) from likes where likedBookId = books.id) as likes 
FROM bookshop.books;

// 유저가 좋아요 했는 지
select *, (select count(*) from bookshop.likes where userId = 1 and likedBookId = 8) as liked from books where id = 8;

// 해당 도서의 좋아요 수 + 유저가 좋아요 했는 지
select *, 
(select count(*) from likes where likedBookId = books.id) as likes,
(select count(*) from bookshop.likes where userId = 1 and likedBookId = 1) as liked from books where id = 1;

insert into cartItems (bookId, quantity, userId) values (1,1,1);
insert into cartItems (bookId, quantity, userId) values (2,2,1);
insert into cartItems (bookId, quantity, userId) values (3,1,2);

// 장바구니 조회
select cartItems.id, bookId, quantity, title,summary, price,img 
from cartItems 
left join books 
on cartItems.bookId = books.id
where cartItems.userId = 1

//장바구니 삭제
delete from cartItems where id = 

//주문할 상품 조회
select cartItems.id, bookId, quantity, title,summary, price,img 
from cartItems 
left join books 
on cartItems.bookId = books.id
where cartItems.userId = 1 and cartItems.id in(1,2,3)

//배송지 입력 of 주문하기 (deliveries)
insert into deliveries (address,receiver,contact) values ("경기도 화성시", "김원길", "010-0000-0000"); 
const deliveryId = select max(id) from deliveries

// 주문 정보 입력 of 주문하기 (orders)
insert into orders (deliveryId, userId, bookTitle,totalPrice,totalQuantity) 
values (deliveryId ,1,"어린왕자들",60000,3)
const orderId = select max(id) from orders

// 주문 상세 목록 입력 of 주문하기 (orderedBook)
insert into orderedBooks (orderId,bookId,quantity) 
values(orderId,1,1);
insert into orderedBooks (orderId,bookId,quantity) 
values(orderId,3,2);

//결제된 도서 카트에서 삭제
delete from cartItems where id in (${cartItems})