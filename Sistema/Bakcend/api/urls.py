from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import UserView, ProductView, StockView, LogView, LoginView

router = DefaultRouter()
router.register("users", UserView)
router.register("products", ProductView)
router.register("stocks", StockView)
router.register("logs", LogView)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
]

urlpatterns += router.urls
