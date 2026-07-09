from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse
import json
import sys

ROOT = Path(__file__).resolve().parents[1] / "dist"

ROLE_USERS = {
    "student": {
        "id": "1",
        "username": "aarav",
        "firstName": "Aarav",
        "lastName": "Patel",
        "email": "student@school.edu",
        "role": "student",
        "profileId": "dyslexic",
        "gradeLevel": "8",
        "classId": "1",
    },
    "teacher": {
        "id": "2",
        "username": "arjun",
        "firstName": "Arjun",
        "lastName": "Sharma",
        "email": "teacher@school.edu",
        "role": "teacher",
    },
    "admin": {
        "id": "3",
        "username": "admin",
        "firstName": "System",
        "lastName": "Admin",
        "email": "admin@laams.edu",
        "role": "admin",
    },
    "parent": {
        "id": "4",
        "username": "rahul",
        "firstName": "Rahul",
        "lastName": "Patel",
        "email": "parent@home.com",
        "role": "parent",
    },
}


class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path)
        candidate = (ROOT / parsed.path.lstrip("/")).resolve()
        if candidate.is_file() and ROOT in candidate.parents:
            return str(candidate)
        return str(ROOT / "index.html")

    def do_GET(self):
        parsed = urlparse(self.path)
        path = Path(self.translate_path(self.path))
        if path.name != "index.html":
            return super().do_GET()

        html = path.read_text(encoding="utf-8")
        query = parse_qs(parsed.query)
        role = query.get("screenRole", [""])[0]
        profile = query.get("a11yProfile", [""])[0]
        user = ROLE_USERS.get(role)
        if user:
            seeded_profile = profile or user.get("profileId", "typical")
            injection = f"""
<script>
localStorage.setItem('laams_jwt_token', 'mock-jwt-token-for-{user["id"]}');
localStorage.setItem('laams_user_data', {json.dumps(json.dumps(user))});
localStorage.setItem('laams-a11y-profile', {json.dumps(seeded_profile)});
</script>
"""
            html = html.replace("<head>", f"<head>{injection}", 1)
        elif "clearSession=true" in parsed.query:
            html = html.replace(
                "<head>",
                "<head><script>localStorage.clear();</script>",
                1,
            )

        encoded = html.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"LAAMS screenshot server running at http://127.0.0.1:{port}", flush=True)
    server.serve_forever()
