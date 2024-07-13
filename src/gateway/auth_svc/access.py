import os
import requests


def login(request):
    auth = request.authorization
    print("auth:", auth)
    if not auth:
        return None, ("No credentials provided", 401)

    basic_auth = (auth.username, auth.password)
    auth_svc_address = os.environ.get("AUTH_SVC_ADDRESS")
    response = requests.post(
        f"http://{auth_svc_address}/login",
        auth=basic_auth
    )
    print("response:", response)

    if response.status_code == 200:
        return response.text, None
    else:
        print("login failed access")
        return None, (response.text, response.status_code)
