from django.contrib.auth import get_user_model
from .models import Product, Stock, Log


'''

Rode no terminal o comando abaixo para popular o banco de dados com dados iniciais:

python manage.py shell

from api.seed import run
run()
exit()


'''

User = get_user_model()

def run():
    print("🔄 Resetando dados...")

    Log.objects.all().delete()
    Stock.objects.all().delete()
    Product.objects.all().delete()
    User.objects.all().exclude(is_superuser=True).delete()

    print("📌 Inserindo usuários...")
    user1 = User.objects.create_user(username="admin1", email="admin1@email.com", password="123")
    user2 = User.objects.create_user(username="joao", email="joao@email.com", password="123")
    user3 = User.objects.create_user(username="maria", email="maria@email.com", password="123")

    print("📦 Inserindo produtos...")
    p1 = Product.objects.create(name="Caderno", cod="P001", description="Caderno grande 200 folhas")
    p2 = Product.objects.create(name="Caneta Azul", cod="P002", description="Esferográfica azul")
    p3 = Product.objects.create(name="Borracha", cod="P003", description="Borracha branca escolar")

    print("📦 Inserindo estoque...")
    s1 = Stock.objects.create(id_product=p1, quantity=50, min_quantity=10)
    s2 = Stock.objects.create(id_product=p2, quantity=120, min_quantity=30)
    s3 = Stock.objects.create(id_product=p3, quantity=5, min_quantity=5)

    print("📝 Criando logs...")
    Log.objects.create(id_product=p1, status="Entrada", id_user=user1)
    Log.objects.create(id_product=p2, status="Entrada", id_user=user2)
    Log.objects.create(id_product=p3, status="Saida", id_user=user3)

    print("✅ Banco populado com sucesso!")
