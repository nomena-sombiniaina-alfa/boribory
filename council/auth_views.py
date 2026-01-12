from django.contrib.auth import authenticate, get_user_model
from django.db import IntegrityError
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

User = get_user_model()


def _user_payload(user, token: str | None = None) -> dict:
    data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }
    if token is not None:
        data["token"] = token
    return data


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    username = (request.data.get("username") or "").strip()
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""

    if not username or not password:
        return Response(
            {"detail": "username et password requis"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if len(password) < 8:
        return Response(
            {"detail": "mot de passe trop court (8 caractères minimum)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.create_user(
            username=username, email=email, password=password
        )
    except IntegrityError:
        return Response(
            {"detail": "ce nom d'utilisateur existe déjà"},
            status=status.HTTP_409_CONFLICT,
        )

    token, _ = Token.objects.get_or_create(user=user)
    return Response(
        _user_payload(user, token.key), status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    user = authenticate(username=username, password=password)
    if user is None:
        return Response(
            {"detail": "identifiants invalides"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    token, _ = Token.objects.get_or_create(user=user)
    return Response(_user_payload(user, token.key))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    return Response(_user_payload(request.user))
