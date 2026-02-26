from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models.user import User
import bcrypt

auth_bp = Blueprint("auth", __name__)

def bad(msg, code=400):
    return jsonify({"error": msg}), code

@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()
    password = data.get("password") or ""

    if not name:
        return bad("Name required")
    if not email or "@" not in email:
        return bad("Enter a valid email")
    if len(password) < 6:
        return bad("Password must be at least 6 characters")

    if User.query.filter_by(email=email).first():
        return bad("Account already exists", 409)

    pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(email=email, name=name, password_hash=pw_hash)

    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.to_dict()}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email:
        return bad("Email required")
    if not password:
        return bad("Password required")

    user = User.query.filter_by(email=email).first()
    if not user:
        return bad("Wrong email or password", 401)

    ok = bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8"))
    if not ok:
        return bad("Wrong email or password", 401)

    # Demo-simple: no token. Frontend just treats this as “logged in”.
    # (If you want JWT later, we can add it.)
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.post("/change-password")
def change_password():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    current_password = data.get("currentPassword") or ""
    new_password = data.get("newPassword") or ""

    if not email:
        return bad("Email required")
    if not current_password:
        return bad("Current password required")
    if len(new_password) < 6:
        return bad("New password must be at least 6 characters")

    user = User.query.filter_by(email=email).first()
    if not user:
        return bad("Account not found", 404)

    ok = bcrypt.checkpw(current_password.encode("utf-8"), user.password_hash.encode("utf-8"))
    if not ok:
        return bad("Current password is incorrect", 401)

    user.password_hash = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    db.session.commit()

    return jsonify({"ok": True}), 200


@auth_bp.put("/profile")
def update_profile():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    name = (data.get("name") or "").strip()

    if not email:
        return bad("Email required")
    if not name:
        return bad("Name required")

    user = User.query.filter_by(email=email).first()
    if not user:
        return bad("Account not found", 404)

    user.name = name
    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200