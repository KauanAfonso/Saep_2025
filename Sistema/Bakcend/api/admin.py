from django.contrib import admin
from .models import User, Product, Stock, Log
# Register your models here.
admin.site.register(User)
admin.site.register(Product)
admin.site.register(Stock)
admin.site.register(Log)