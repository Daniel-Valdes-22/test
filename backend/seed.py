from sqlalchemy.orm import Session

from auth import hash_password
from models import Book, User


DEMO_USERS = [
    ("alice", "password123"),
    ("bob", "password123"),
]

DEMO_BOOKS = [
    ("The Quiet Library", "Mara Ellison", 12.99, "A night clerk finds stories that rewrite themselves."),
    ("Pages of Salt", "Jonah Reed", 9.5, "A coastal town keeps its history in borrowed books."),
    ("Catalog of Rain", "Lina Ortiz", 14.0, "Essays on weather, memory, and reading outdoors."),
    ("Secondhand Atlas", "Theo Park", 11.25, "Maps that lead to bookstores instead of cities."),
    ("Binding Light", "Asha Nair", 16.5, "A binder discovers illuminated manuscripts that glow."),
]


def seed_data(db: Session) -> None:
    if db.query(User).count() == 0:
        for username, password in DEMO_USERS:
            db.add(User(username=username, password_hash=hash_password(password)))

    if db.query(Book).count() == 0:
        for title, author, price, description in DEMO_BOOKS:
            db.add(
                Book(
                    title=title,
                    author=author,
                    price=price,
                    description=description,
                )
            )

    db.commit()
