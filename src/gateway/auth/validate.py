import os
import requests


def token(request):
    print("Validating token")
    if not "Authorization" in request.headers:
        return None, ("No credentials provided", 401)

    token = request.headers["Authorization"]

    if not token:
        return None, ("No credentials provided", 401)

    auth_svc_address = os.environ.get("AUTH_SVC_ADDRESS")

    print(f"Sending request to {
          auth_svc_address}/validate with token: {token}")

    response = requests.post(
        f"http://{auth_svc_address}/validate",
        headers={"Authorization": token}
    )

    if response.status_code == 200:
        print("Token validation successful")
        return response.text, None
    else:
        print(f"Token validation failed with status code: {
              response.status_code}")
        return None, (response.text, response.status_code)
