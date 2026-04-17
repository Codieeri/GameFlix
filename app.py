import hashlib
import os
import re
import sqlite3
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
FREE_TO_GAME_BASE = "https://www.freetogame.com/api/games"
STEAM_DETAILS = "https://store.steampowered.com/api/appdetails"
HEADERS = {"User-Agent": "GameFlix/1.0"}
DB_PATH = "/home/z/my-project/db/gameflix.db"

ALL_CATEGORIES = [
    "mmorpg", "shooter", "strategy", "moba", "racing", "sports", "social",
    "sandbox", "survival", "pvp", "pve", "zombie", "card", "battle-royale",
    "mmo", "anime", "management", "farming", "tower-defense", "horror",
    "open-world", "turn-based", "space", "pixel", "superhero", "fighting",
    "action", "rpg", "puzzle", "arcade", "adventure", "casual",
]

KIDS_CATEGORIES = [
    "sports", "puzzle", "racing", "action", "mmorpg", "strategy", "sandbox",
    "social", "management", "farming", "card", "casual", "shooter", "moba",
    "open-world", "survival",
]

KID_GENRES = [
    "sports", "puzzle", "arcade", "casual", "board", "card", "educational",
    "family", "platformer", "racing", "strategy", "management", "farming",
    "social", "sandbox", "idle", "typing", "match-3",
]

KID_TITLE_KEYWORDS = [
    "ludo", "chess", "puzzle", "kid", "family", "cartoon", "pet", "animal",
    "farm", "soccer", "racing", "cook", "bake", "color", "draw", "paint",
    "school", "math", "word", "quiz", "memory", "bubble", "candy", "fruit",
    "garden", "park", "zoo", "pony", "fairy", "dragon", "build", "craft",
    "lego", "block", "ball", "jump", "run", "fly", "swim", "dance", "music",
    "sing", "story", "adventure", "explor", "rocket", "star", "moon", "sun",
]

VIOLENT_EXCLUDE = [
    "horror", "zombie", "survival horror", "blood", "gore", "violent",
    "kill", "murder", "death", "war", "combat", "weapon", "gun", "shoot",
    "sniper", "assassin", "slaughter", "massacre", "terror", "ghost",
    "demon", "satan", "hell", "torture", "mutilat",
]

# ---------------------------------------------------------------------------
# In-memory cache
# ---------------------------------------------------------------------------
cache: dict[str, dict] = {}


def get_cached(key: str, ttl: int = 300):
    """Return cached data if still fresh, else None."""
    entry = cache.get(key)
    if entry and (time.time() - entry["timestamp"]) < ttl:
        return entry["data"]
    return None


def set_cache(key: str, data, ttl: int = 300):
    cache[key] = {"data": data, "timestamp": time.time()}


# ---------------------------------------------------------------------------
# Database helpers
# ---------------------------------------------------------------------------
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Free-to-Game API helpers
# ---------------------------------------------------------------------------
def fetch_category(category: str):
    """Fetch games for a single category from the Free-to-Game API."""
    try:
        url = f"{FREE_TO_GAME_BASE}?category={category}"
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as exc:
        print(f"[WARN] Failed to fetch category '{category}': {exc}")
        return []


def build_game_pool():
    """Fetch from all categories in parallel, deduplicate by id."""
    cached = get_cached("game_pool", ttl=300)
    if cached is not None:
        return cached

    print("[INFO] Building game pool from all categories...")
    pool: dict[int, dict] = {}
    seen_ids: set[int] = set()

    def _task(cat):
        return cat, fetch_category(cat)

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(_task, c): c for c in ALL_CATEGORIES}
        for future in as_completed(futures):
            cat, games = future.result()
            for g in (games or []):
                gid = g.get("id")
                if gid and gid not in seen_ids:
                    seen_ids.add(gid)
                    pool[gid] = g

    result = list(pool.values())
    set_cache("game_pool", result, ttl=300)
    print(f"[INFO] Game pool built: {len(result)} games")
    return result


def sort_games(games: list, sort_by: str) -> list:
    if sort_by == "popularity":
        return sorted(games, key=lambda g: g.get("id", 0), reverse=True)
    elif sort_by == "release-date":
        return sorted(games, key=lambda g: g.get("release_date", ""), reverse=True)
    elif sort_by == "alphabetical":
        return sorted(games, key=lambda g: g.get("title", "").lower())
    return games


# ---------------------------------------------------------------------------
# Routes — Games
# ---------------------------------------------------------------------------
@app.route("/api/games", methods=["GET"])
def list_games():
    """List games with optional sort-by and category filtering."""
    try:
        sort_by = request.args.get("sort", "") or request.args.get("sort-by", "popularity")
        category = request.args.get("category")

        cache_key = f"games_{category or 'all'}_{sort_by}"
        cached = get_cached(cache_key, ttl=300)
        if cached is not None:
            return jsonify(cached)

        games = build_game_pool()

        if category and category != "all":
            games = [g for g in games if category.lower() in g.get("genre", "").lower()]

        games = sort_games(games, sort_by)
        set_cache(cache_key, games, ttl=300)
        return jsonify(games)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/games/search", methods=["GET"])
def search_games():
    """Search games by query string."""
    try:
        q = request.args.get("q", "").strip()
        if not q:
            return jsonify({"error": "Query parameter 'q' is required"}), 400

        cache_key = f"search_{q.lower()}"
        cached = get_cached(cache_key, ttl=120)
        if cached is not None:
            return jsonify(cached)

        ql = q.lower()
        pool = build_game_pool()

        results = [
            g for g in pool
            if any(
                ql in (g.get(field, "") or "").lower()
                for field in ("title", "genre", "developer", "publisher", "short_description")
            )
        ]

        set_cache(cache_key, results, ttl=120)
        return jsonify(results)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/games/kids", methods=["GET"])
def kids_games():
    """Return kid-friendly games."""
    try:
        section = request.args.get("section", "")

        cache_key = f"kids_{section}"
        cached = get_cached(cache_key, ttl=300)
        if cached is not None:
            return jsonify(cached)

        # Fetch kids categories
        all_games: dict[int, dict] = {}
        seen: set[int] = set()

        def _task(cat):
            return cat, fetch_category(cat)

        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = {executor.submit(_task, c): c for c in KIDS_CATEGORIES}
            for future in as_completed(futures):
                cat, games = future.result()
                for g in (games or []):
                    gid = g.get("id")
                    if gid and gid not in seen:
                        seen.add(gid)
                        all_games[gid] = g

        # Filter kid-friendly
        kid_games = []
        for g in all_games.values():
            title_l = (g.get("title") or "").lower()
            genre_l = (g.get("genre") or "").lower()
            desc_l = (g.get("short_description") or "").lower()

            # Exclude violent
            if any(v in genre_l or v in title_l or v in desc_l for v in VIOLENT_EXCLUDE):
                continue

            # Include if kid genre matches
            is_kid_genre = genre_l in KID_GENRES or any(kg in genre_l for kg in KID_GENRES)

            # Include if kid title keyword matches
            is_kid_title = any(kw in title_l for kw in KID_TITLE_KEYWORDS)

            if is_kid_genre or is_kid_title:
                kid_games.append(g)

        # Further categorize by section
        if section:
            section_map = {
                "puzzle": ["puzzle", "match-3", "card", "board", "word", "memory"],
                "sports": ["sports", "racing", "soccer", "football", "basketball", "tennis", "golf"],
                "racing": ["racing", "driving", "kart"],
                "adventure": ["adventure", "explor", "platformer"],
                "creative": ["sandbox", "build", "craft", "farm", "management", "farming", "design"],
            }
            section_kw = section_map.get(section, [])
            if section_kw:
                kid_games = [
                    g for g in kid_games
                    if any(
                        kw in (g.get("genre") or "").lower()
                        or kw in (g.get("title") or "").lower()
                        or kw in (g.get("short_description") or "").lower()
                        for kw in section_kw
                    )
                ]

        set_cache(cache_key, kid_games, ttl=300)
        return jsonify(kid_games)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/games/<int:game_id>", methods=["GET"])
def get_game(game_id: int):
    """Get a single game by ID."""
    try:
        pool = build_game_pool()
        game = next((g for g in pool if g.get("id") == game_id), None)
        if game is None:
            return jsonify({"error": "Game not found"}), 404
        return jsonify(game)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/games/<int:game_id>/screenshots", methods=["GET"])
def get_screenshots(game_id: int):
    """Get screenshots from Steam Store API."""
    try:
        cache_key = f"screenshots_{game_id}"
        cached = get_cached(cache_key, ttl=86400)
        if cached is not None:
            return jsonify(cached)

        url = f"{STEAM_DETAILS}?appids={game_id}&cc=us&l=english"
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        app_data = data.get(str(game_id), {}).get("data", {})
        raw_screenshots = app_data.get("screenshots", [])

        screenshots = [
            {
                "id": s.get("id"),
                "path_thumbnail": s.get("path_thumbnail"),
                "path_full": s.get("path_full"),
            }
            for s in raw_screenshots
        ]

        full_description = app_data.get("detailed_description", "")

        result = {"screenshots": screenshots, "fullDescription": full_description}
        set_cache(cache_key, result, ttl=86400)
        return jsonify(result)
    except Exception as exc:
        print(f"[WARN] Failed to fetch screenshots for game {game_id}: {exc}")
        return jsonify({"screenshots": [], "fullDescription": ""}), 200


# ---------------------------------------------------------------------------
# Routes — Auth
# ---------------------------------------------------------------------------
@app.route("/api/auth/register", methods=["POST"])
def register():
    """Register a new user."""
    try:
        body = request.get_json(silent=True)
        if not body:
            return jsonify({"error": "Request body must be JSON"}), 400

        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip()
        password = body.get("password") or ""

        # Validation
        errors = []
        if not username:
            errors.append("Username is required")
        elif len(username) < 3:
            errors.append("Username must be at least 3 characters")

        if not email:
            errors.append("Email is required")
        elif not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            errors.append("Invalid email format")

        if not password:
            errors.append("Password is required")
        elif len(password) < 6:
            errors.append("Password must be at least 6 characters")

        if errors:
            return jsonify({"error": "; ".join(errors)}), 400

        # Hash password
        pw_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

        conn = get_db()
        try:
            cursor = conn.execute(
                "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                (username, email, pw_hash),
            )
            conn.commit()
            user_id = cursor.lastrowid
            return jsonify({
                "success": True,
                "user": {"id": user_id, "username": username, "email": email},
            }), 201
        except sqlite3.IntegrityError:
            conn.rollback()
            # Determine if duplicate email or username
            row = conn.execute("SELECT email FROM users WHERE email = ?", (email,)).fetchone()
            if row:
                return jsonify({"error": "Email already registered"}), 409
            return jsonify({"error": "Username already taken"}), 409
        finally:
            conn.close()
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    """Log in an existing user by email or username."""
    try:
        body = request.get_json(silent=True)
        if not body:
            return jsonify({"error": "Request body must be JSON"}), 400

        email = (body.get("email") or "").strip()
        password = body.get("password") or ""

        if not email or not password:
            return jsonify({"error": "Email/username and password are required"}), 400

        pw_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()

        conn = get_db()
        try:
            # Try email first, then username
            row = conn.execute(
                "SELECT id, username, email, password FROM users WHERE email = ?",
                (email,),
            ).fetchone()

            if not row:
                row = conn.execute(
                    "SELECT id, username, email, password FROM users WHERE username = ?",
                    (email,),
                ).fetchone()

            if not row or row["password"] != pw_hash:
                return jsonify({"error": "Invalid credentials. Check your email/username and password."}), 401

            return jsonify({
                "success": True,
                "user": {"id": row["id"], "username": row["username"], "email": row["email"]},
            })
        finally:
            conn.close()
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    init_db()
    print("GameFlix API running on port 3030")
    try:
        from waitress import serve
        serve(app, host="0.0.0.0", port=3030, threads=4)
    except ImportError:
        app.run(host="0.0.0.0", port=3030, debug=False, threaded=True)
