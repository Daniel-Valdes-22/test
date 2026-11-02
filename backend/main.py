from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from auth import authenticate_user
from database import Base, engine, get_db
from models import Book, Purchase, User
from schemas import BookOut, LoginRequest, PurchaseOut, UserOut
from seed import seed_data

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Simple Library")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    db = next(get_db())
    try:
        seed_data(db)
    finally:
        db.close()


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/login", response_model=UserOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> User:
    user = authenticate_user(db, payload.username, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return user


@app.get("/api/books", response_model=list[BookOut])
def list_books(user_id: int | None = None, db: Session = Depends(get_db)) -> list[BookOut]:
    books = db.query(Book).order_by(Book.title).all()
    owned_ids: set[int] = set()
    if user_id is not None:
        owned_ids = {
            row.book_id
            for row in db.query(Purchase).filter(Purchase.user_id == user_id).all()
        }
    return [
        BookOut(
            id=book.id,
            title=book.title,
            author=book.author,
            price=book.price,
            description=book.description,
            owned=book.id in owned_ids,
        )
        for book in books
    ]


@app.post("/api/books/{book_id}/buy", response_model=PurchaseOut)
def buy_book(book_id: int, user_id: int, db: Session = Depends(get_db)) -> Purchase:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    existing = (
        db.query(Purchase)
        .filter(Purchase.user_id == user_id, Purchase.book_id == book_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=409, detail="Book already purchased")

    purchase = Purchase(user_id=user_id, book_id=book_id)
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    return purchase


@app.get("/api/purchases", response_model=list[PurchaseOut])
def list_purchases(user_id: int, db: Session = Depends(get_db)) -> list[Purchase]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return (
        db.query(Purchase)
        .filter(Purchase.user_id == user_id)
        .order_by(Purchase.purchased_at.desc())
        .all()
    )
