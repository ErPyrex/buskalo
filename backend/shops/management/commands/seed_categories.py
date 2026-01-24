from django.core.management.base import BaseCommand
from shops.models import Category

class Command(BaseCommand):
    help = 'Seeds initial categories'

    def handle(self, *args, **options):
        categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Comida', 'Belleza', 'Otros']
        for name in categories:
            Category.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Successfully seeded categories'))
