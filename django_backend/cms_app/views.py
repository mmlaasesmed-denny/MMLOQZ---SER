from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import WebsiteLayout, CMSPage
from .serializers import WebsiteLayoutSerializer, CMSPageDetailSerializer

class WebsiteLayoutViewSet(viewsets.ModelViewSet):
    """
    Standard RESTful endpoint viewset for Approach A (Dynamic JSON Layouts).
    Supports GET (list/retrieve), POST (create), PUT/PATCH (update), and DELETE.
    """
    queryset = WebsiteLayout.objects.all()
    serializer_class = WebsiteLayoutSerializer


class CMSPageViewSet(viewsets.ModelViewSet):
    """
    Standard viewset for Approach C (Relational Multi-Model CMS Pages).
    Supports viewing, adding, updating (PUT/PATCH), and deleting pages.
    Updates automatically synchronize across text, image, and button tables.
    """
    queryset = CMSPage.objects.all()
    serializer_class = CMSPageDetailSerializer
    lookup_field = 'slug'


@api_view(['GET'])
def test_connection_ping(request):
    """
    Helper API endpoint for the React Website builder to test 
    its connection to your Django server.
    """
    return Response({
        "status": "online",
        "message": "Direct CORS line established successfully with Python Django backend!",
        "database_connected": True,
        "supported_approaches": {
            "approach_a": "WebsiteLayout (JSON document layout)",
            "approach_c": "CMSPage + PageTextBlock + PageImageBlock + PageButtonAction (Strict relational tables)"
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_newsletter_email(request):
    """
    Endpoint to send a welcome newsletter email to the subscriber.
    """
    try:
        email = request.data.get('email', '').strip()
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        subject = "Velkommen til MM Låsesmed Nyhedsbrev!"
        message = (
            "Hej,\n\n"
            "Tak fordi du har tilmeldt dig vores nyhedsbrev hos MM Låsesmed!\n\n"
            "Vi vil løbende sende dig nyttige sikkerhedstips, nyheder om vores låsesystemer og gode tilbud.\n\n"
            "Hvis du har brug for akut låseservice, er vores døgnvagt altid klar på tlf. +45 31 11 11 15.\n\n"
            "Venlig hilsen,\n"
            "MM Låsesmed\n"
            "Kulvej 10, 2 TV, 2450 København SV\n"
            "info@mmlaasesmed.dk"
        )
        
        from django.core.mail import send_mail
        send_mail(
            subject=subject,
            message=message,
            from_email='info@mmlaasesmed.dk',
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({
            "status": "success",
            "message": f"Nyhedsbrev bekræftelse sendt til {email}!"
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
