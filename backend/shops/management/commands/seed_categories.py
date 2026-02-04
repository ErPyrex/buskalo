from django.core.management.base import BaseCommand
from shops.models import Category

class Command(BaseCommand):
    help = 'Populates initial categories'

    def handle(self, *args, **kwargs):
        categories = [
            'Electrónica',
            'Ropa y Moda',
            'Hogar y Jardín',
            'Deportes',
            'Juguetes y Juegos',
            'Salud y Belleza',
            'Automóviles',
            'Libros y Papelería',
            'Alimentos y Bebidas',
            'Mascotas'
        ]
        
        for name in categories:
            obj, created = Category.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Successfully created category "{name}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Category "{name}" already exists'))
