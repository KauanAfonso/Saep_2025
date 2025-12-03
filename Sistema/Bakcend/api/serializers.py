from rest_framework import serializers
from .models import User, Product, Stock, Log
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
               
        return token
    
    def validate(self, attrs):
            data = super().validate(attrs)
            # Add custom data to the response if needed
            # data['user_id'] = self.user.id
            data = {
                'token': data,
                'user': {
                    'id': self.user.id,
                    'username': self.user.username,
                    'email': self.user.email,
                }
            }
            return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user 

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'cod', 'description']
        
class StockSerializer(serializers.ModelSerializer):
    product = ProductSerializer(source='id_product', read_only=True)
    class Meta:
        model = Stock
        fields = ['id', 'id_product', 'quantity', 'min_quantity', "is_below_min", "product"]
        

class LogSerializer(serializers.ModelSerializer):
    id_user = UserSerializer(read_only=True)
    id_product = ProductSerializer(read_only=True)
    class Meta:
        model = Log
        fields = ['id', 'id_product', 'status', 'timestamp', 'id_user' , "id_user", "id_product"]