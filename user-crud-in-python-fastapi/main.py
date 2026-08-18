from contextlib import asynccontextmanager
from typing import List
from fastapi import Depends, FastAPI, HTTPException, status
import psycopg
from psycopg import Connection

from database import get_db, init_db, pool
from schemas import ItemCreate, ItemResponse, ItemUpdate


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool.open()
    init_db()
    yield
    pool.close()


app = FastAPI(title="Raw SQL CRUD API", lifespan=lifespan)


# 1. CREATE
@app.post(
    "/items", response_model=ItemResponse, status_code=status.HTTP_201_CREATED
)
def create_item(item: ItemCreate, db: Connection = Depends(get_db)):
    with db.cursor() as cur:
        query = """
            INSERT INTO items (title, description, price)
            VALUES (%s, %s, %s)
            RETURNING id, title, description, price, created_at;
        """
        cur.execute(query, (item.title, item.description, item.price))
        created_item = cur.fetchone()
        db.commit()
        return created_item


# 2. READ ALL
@app.get("/items", response_model=List[ItemResponse])
def get_items(
    limit: int = 10, offset: int = 0, db: Connection = Depends(get_db)
):
    with db.cursor() as cur:
        query = """
            SELECT id, title, description, price, created_at
            FROM items
            ORDER BY id ASC
            LIMIT %s OFFSET %s;
        """
        cur.execute(query, (limit, offset))
        return cur.fetchall()


# 3. READ ONE
@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Connection = Depends(get_db)):
    with db.cursor() as cur:
        query = """
            SELECT id, title, description, price, created_at
            FROM items
            WHERE id = %s;
        """
        cur.execute(query, (item_id,))
        item = cur.fetchone()

        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        return item


# 4. UPDATE (PATCH)
@app.patch("/items/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int, item_data: ItemUpdate, db: Connection = Depends(get_db)
):
    # Filter out fields that weren't provided in the request
    update_data = item_data.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update",
        )

    # Dynamically build the SET clause safely
    set_clauses = [f"{field} = %s" for field in update_data.keys()]
    values = list(update_data.values())
    values.append(item_id)

    query = f"""
        UPDATE items
        SET {", ".join(set_clauses)}
        WHERE id = %s
        RETURNING id, title, description, price, created_at;
    """

    with db.cursor() as cur:
        cur.execute(query, values)
        updated_item = cur.fetchone()
        if not updated_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        db.commit()
        return updated_item


# 5. DELETE
@app.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Connection = Depends(get_db)):
    with db.cursor() as cur:
        query = "DELETE FROM items WHERE id = %s RETURNING id;"
        cur.execute(query, (item_id,))
        deleted = cur.fetchone()

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found"
            )
        db.commit()
        return None