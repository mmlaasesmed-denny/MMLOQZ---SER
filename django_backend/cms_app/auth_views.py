from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def api_login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        
        # We need to find the user by email, since username might not be email in standard Django
        users = User.objects.filter(email=email)
        if not users.exists():
            # Fallback to username for "admin" login
            users = User.objects.filter(username=email)
            if not users.exists():
                return JsonResponse({'error': 'Ugyldig e-mail eller adgangskode.'}, status=401)
                
        user = authenticate(request, username=users.first().username, password=password)
        
        if user is not None:
            django_login(request, user)
            return JsonResponse({
                'id': user.id,
                'email': user.email,
                'name': user.first_name or user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            })
        else:
            return JsonResponse({'error': 'Ugyldig e-mail eller adgangskode.'}, status=401)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_logout(request):
    django_logout(request)
    return JsonResponse({'success': True})

@csrf_exempt
def api_register(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        password = data.get('password', '')
        name = data.get('name', '')
        
        if not email or not password:
            return JsonResponse({'error': 'E-mail og adgangskode er påkrævet.'}, status=400)
            
        if User.objects.filter(email=email).exists() or User.objects.filter(username=email).exists():
            return JsonResponse({'error': 'E-mailen er allerede i brug.'}, status=400)
            
        user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
        
        # Log them in automatically
        django_login(request, user)
        return JsonResponse({
            'id': user.id,
            'email': user.email,
            'name': user.first_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse({
            'id': request.user.id,
            'email': request.user.email,
            'name': request.user.first_name or request.user.username,
            'is_staff': request.user.is_staff,
            'is_superuser': request.user.is_superuser
        })
    return JsonResponse({'error': 'Not authenticated'}, status=401)

@csrf_exempt
def api_password_reset(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        
        # For security, we don't reveal if the user exists, we just say "sent".
        # But for this setup, we'll actually check and log a mock link
        user = User.objects.filter(email=email).first()
        if user:
            print(f"MOCK PASSWORD RESET EMAIL SENT TO: {email}")
            print(f"Reset Link: https://mmlaasesmed.dk/#shop/reset?email={email}")
            
        return JsonResponse({'success': True, 'message': 'Hvis e-mailen findes, har vi sendt et link til at nulstille din adgangskode.'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def api_password_reset_confirm(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email', '')
        new_password = data.get('password', '')
        
        user = User.objects.filter(email=email).first()
        if user:
            user.set_password(new_password)
            user.save()
            return JsonResponse({'success': True, 'message': 'Adgangskoden er nu opdateret.'})
        else:
            return JsonResponse({'error': 'Ugyldig anmodning.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
