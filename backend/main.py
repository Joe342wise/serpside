from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from serpapi import Client
from os import getenv
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

API_KEY = getenv("SERPAPI_API_KEY")
client = Client(api_key=API_KEY) if API_KEY else None

app = FastAPI(title="SerpSide API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class RestaurantResult(BaseModel):
    name: str
    rating: float | None = None
    reviews: int | None = None
    address: str | None = None
    price_level: str | None = None
    types: list[str] | None = None
    phone: str | None = None
    website: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    thumbnail: str | None = None

class ProductResult(BaseModel):
    title: str
    price: str | None = None
    source: str | None = None
    link: str | None = None
    rating: float | None = None
    reviews: int | None = None
    thumbnail: str | None = None

class SearchResponse(BaseModel):
    results: list
    error: str | None = None

@app.get("/api/restaurants")
def search_restaurants(
    q: str = Query("restaurants near Moscone Center"),
    location: str = Query("San Francisco"),
    max_results: int = Query(12, le=20),
):
    if not client:
        return SearchResponse(results=[], error="SERPAPI_API_KEY not configured. Set it in .env")
    params = {
        "engine": "google_maps",
        "q": q,
        "type": "search",
    }
    raw = client.search(params).as_dict()
    results = []
    for place in raw.get("local_results", [])[:max_results]:
        gps = place.get("gps_coordinates") or {}
        results.append(RestaurantResult(
            name=place.get("title") or "",
            rating=place.get("rating"),
            reviews=place.get("reviews"),
            address=place.get("address"),
            price_level=place.get("price"),
            types=place.get("types"),
            phone=place.get("phone"),
            website=place.get("website"),
            latitude=gps.get("latitude"),
            longitude=gps.get("longitude"),
            thumbnail=place.get("thumbnail"),
        ).model_dump())
    return SearchResponse(results=results)

@app.get("/api/products")
def search_products(
    q: str = Query(...),
    max_results: int = Query(12, le=20),
):
    if not client:
        return SearchResponse(results=[], error="SERPAPI_API_KEY not configured. Set it in .env")
    params = {
        "engine": "google_shopping",
        "q": q,
    }
    raw = client.search(params).as_dict()
    results = []
    for item in raw.get("shopping_results", [])[:max_results]:
        title = item.get("title") or ""
        source = item.get("source")
        link = item.get("link") or item.get("product_link") or item.get("tracking_link")
        if not link:
            q = f"{title} {source}" if source else title
            link = f"https://www.google.com/search?q={quote(q)}&tbm=shop"
        results.append(ProductResult(
            title=title,
            price=item.get("price"),
            source=source,
            link=link,
            rating=item.get("rating"),
            reviews=item.get("reviews"),
            thumbnail=item.get("thumbnail"),
        ).model_dump())
    results.sort(key=lambda r: _parse_price(r["price"]) if r["price"] else float("inf"))
    return SearchResponse(results=results)

def _parse_price(price: str) -> float:
    try:
        return float(price.replace("$", "").replace(",", ""))
    except (ValueError, AttributeError):
        return float("inf")

@app.get("/api/health")
def health():
    return {"status": "ok", "api_key_configured": client is not None}
