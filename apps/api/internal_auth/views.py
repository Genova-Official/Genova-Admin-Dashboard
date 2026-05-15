import random
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django_otp.plugins.otp_email.models import EmailDevice
from django.utils.timezone import now

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)
        if user:
            # Create or get EmailDevice for OTP
            device, created = EmailDevice.objects.get_or_create(user=user, name='default')
            device.email = settings.INTERNAL_OTP_EMAIL
            device.generate_challenge()
            
            # Note: django-otp-email sends to device.email by default when generate_challenge is called? 
            # Actually, we might need to send it manually if we want custom formatting.
            otp = device.token
            
            send_mail(
                'Genova Console - Login OTP',
                f'Your login OTP is: {otp}. It will expire in 5 minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [settings.INTERNAL_OTP_EMAIL],
                fail_silently=False,
            )
            
            return Response({
                'message': 'OTP sent to authorized email.',
                'email': email, # To track who is logging in
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(email=email)
            device = EmailDevice.objects.get(user=user, name='default')
            
            if device.verify_token(otp):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user': {
                        'email': user.email,
                        'is_staff': user.is_staff
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_401_UNAUTHORIZED)
        except (User.DoesNotExist, EmailDevice.DoesNotExist):
            return Response({'error': 'Invalid request'}, status=status.HTTP_400_BAD_REQUEST)
