import os
import requests


def token(request):
    if not "Authorization" in request.headers:
        return None, ("No credentials provided", 401)

    token = request.headers["Authorization"]

    if not token:
        return None, ("No credentials provided", 401)

    auth_svc_address = os.environ.get("AUTH_SVC_ADDRESS")
    response = requests.post(
        f"http://{auth_svc_address}/validate",
        headers == {"Authorization": token}
    )

    if response.status_code == 200:
        return response.text, None
    else:
        return None, (response.text, response.status_code)
