from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class User(AbstractUser):
    REQUIRED_FIELDS = ['email', 'password']
    
    def str__(self):
        return self.username
    
class Product(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    cod = models.CharField(max_length=50, unique=True, null=False, blank=False)
    description = models.TextField(blank=True)
    
    def str__(self):
        return self.name
    
class Stock(models.Model):
    id_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stocks', unique=True)
    quantity = models.IntegerField(null=False, blank=False)  
    min_quantity = models.IntegerField(null=False, blank=False)
    is_below_min = models.BooleanField(default=False)
    
    def str__(self):
        return f"Stock of {self.id_product.name}: {self.quantity}"
        
class Log(models.Model):
    id_product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='logs')
    status = models.CharField(choices=[('Entrada', 'Entrada'), ('Saida', 'Saida')], max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    id_user = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False)
    
    def str(self):
        return f"Log for {self.id_product.name} at {self.timestamp}"