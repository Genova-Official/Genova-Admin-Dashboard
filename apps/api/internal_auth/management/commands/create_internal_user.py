from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates an initial internal user for the Genova Console'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, required=True)
        parser.add_argument('--password', type=str, required=True)

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        if User.objects.filter(username=email).exists():
            self.stdout.write(self.style.WARNING(f'User {email} already exists'))
            return

        user = User.objects.create_superuser(
            username=email,
            email=email,
            password=password
        )
        self.stdout.write(self.style.SUCCESS(f'Successfully created internal user: {email}'))
