from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet
from . import auth_views

router = DefaultRouter()
router.register("conversations", ConversationViewSet, basename="conversation")

urlpatterns = [
    path("auth/register/", auth_views.register, name="auth-register"),
    path("auth/login/", auth_views.login, name="auth-login"),
    path("auth/logout/", auth_views.logout, name="auth-logout"),
    path("auth/me/", auth_views.me, name="auth-me"),
    path("", include(router.urls)),
]
