from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UserSerializer, ProductSerializer, StockSerializer, LogSerializer, MyTokenObtainPairSerializer
from .models import User, Product, Stock, Log
from rest_framework_simplejwt.views import TokenObtainPairView
# Create your views here.

class LoginView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
class UserView(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class ProductView(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        product_name = self.request.query_params.get("name")
        queryset = Product.objects.all().order_by('name')
        if product_name:
            queryset = queryset.filter(name=product_name)
            return queryset
        # Retorna todos os objetos Produto, ordenados alfabeticamente pelo campo 'nome'
        return Product.objects.all().order_by('name')
    
class StockView(viewsets.ModelViewSet):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    
class LogView(viewsets.ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer