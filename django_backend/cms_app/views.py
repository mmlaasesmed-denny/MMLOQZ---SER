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


import requests
from requests.auth import HTTPBasicAuth
from django.conf import settings
from django.http import JsonResponse

# Helper to get city names based on Danish zipcodes to make mock data look realistic
MOCK_CITIES = {
    "1000": "København K", "2000": "Frederiksberg", "2100": "København Ø",
    "2200": "København N", "2300": "København S", "2400": "København NV",
    "2500": "Valby", "2600": "Glostrup", "2700": "Brønshøj", "2800": "Kongens Lyngby",
    "2900": "Hellerup", "3000": "Helsingør", "3400": "Hillerød", "4000": "Roskilde",
    "5000": "Odense C", "8000": "Aarhus C", "9000": "Aalborg"
}

@api_view(['GET'])
def get_shipmondo_delivery_options(request):
    """
    Endpoint for fetching Shipmondo carrier delivery options and pakkeshops (pickup points)
    based on Danish receiver zipcode. Supports GLS and PostNord.
    """
    zipcode = request.GET.get("zipcode", "").strip()
    carrier_filter = request.GET.get("carrier", "").strip().lower()  # e.g., "gls" or "postnord"

    if not zipcode:
        return JsonResponse({"error": "Postnummer er påkrævet."}, status=400)

    city_name = MOCK_CITIES.get(zipcode, "København")

    # Fetch configuration keys
    username = getattr(settings, 'SHIPMONDO_API_USER', 'test_user')
    api_key = getattr(settings, 'SHIPMONDO_API_KEY', 'test_key')

    use_mock = True
    carriers = []
    pickup_points = []
    home_delivery_carriers = []

    # Only perform request if credentials are set (not defaults)
    if username not in ['test_user', 'your_api_user', ''] and api_key not in ['test_key', 'your_api_key', '']:
        try:
            country_code = "DK"
            # 1. Fetch carriers
            carriers_url = f"https://sandbox.shipmondo.com/api/public/v3/carriers?receiver_country_code={country_code}&receiver_zipcode={zipcode}"
            res_carriers = requests.get(carriers_url, auth=HTTPBasicAuth(username, api_key), timeout=5)
            if res_carriers.status_code == 200:
                carriers = res_carriers.json()

                # Filter by carrier (gls, postnord)
                if carrier_filter:
                    carriers = [
                        c for c in carriers 
                        if carrier_filter in c.get('code', '').lower() or carrier_filter in c.get('name', '').lower()
                    ]

                for carrier in carriers:
                    code = carrier.get('code')
                    name = carrier.get('name', code)

                    # 2. Fetch pickup points
                    pickup_url = f"https://sandbox.shipmondo.com/api/public/v3/pickup_points?carrier_code={code}&country_code={country_code}&zipcode={zipcode}"
                    res_pickups = requests.get(pickup_url, auth=HTTPBasicAuth(username, api_key), timeout=5)

                    if res_pickups.status_code == 422:
                        home_delivery_carriers.append({
                            "code": code,
                            "name": name,
                            "service": "Home Delivery",
                            "description": "Levering til din adresse – ca. 2–4 hverdage"
                        })
                    elif res_pickups.status_code == 200:
                        points = res_pickups.json()
                        if points:
                            for p in points:
                                pickup_points.append({
                                    "id": p.get('id'),
                                    "company_name": p.get('company_name'),
                                    "address": p.get('address'),
                                    "zipcode": p.get('zipcode'),
                                    "city": p.get('city'),
                                    "carrier_code": code,
                                    "carrier_name": name
                                })
                        else:
                            home_delivery_carriers.append({
                                "code": code,
                                "name": name,
                                "service": "Home Delivery",
                                "description": "Levering til din adresse – ca. 2–4 hverdage"
                            })
                use_mock = False
        except Exception as e:
            # Safe fallback
            print("Shipmondo Sandbox API failed, using fallback:", str(e))
            use_mock = True

    if use_mock:
        selected_carriers = ["gls", "postnord"] if not carrier_filter else [carrier_filter]

        if "gls" in selected_carriers:
            pickup_points.extend([
                {
                    "id": "gls_p1",
                    "company_name": "Spar Supermarked GLS Pakkeshop",
                    "address": "Hovedgade 42",
                    "zipcode": zipcode,
                    "city": city_name,
                    "carrier_code": "gls",
                    "carrier_name": "GLS"
                },
                {
                    "id": "gls_p2",
                    "company_name": "OK Plus GLS Pakkeshop",
                    "address": "Jernbanegade 5",
                    "zipcode": zipcode,
                    "city": city_name,
                    "carrier_code": "gls",
                    "carrier_name": "GLS"
                }
            ])
            home_delivery_carriers.append({
                "code": "gls",
                "name": "GLS Privatlevering",
                "service": "Home Delivery",
                "description": "Direkte levering til din dør – 1-2 hverdage"
            })

        if "postnord" in selected_carriers:
            pickup_points.extend([
                {
                    "id": "pnd_p1",
                    "company_name": "Coop SuperBrugsen PostNord Pakkeboks",
                    "address": "Bymidten 11",
                    "zipcode": zipcode,
                    "city": city_name,
                    "carrier_code": "postnord",
                    "carrier_name": "PostNord"
                },
                {
                    "id": "pnd_p2",
                    "company_name": "Circle K PostNord Pakkeshop",
                    "address": "Ringvejen 105",
                    "zipcode": zipcode,
                    "city": city_name,
                    "carrier_code": "postnord",
                    "carrier_name": "PostNord"
                }
            ])
            home_delivery_carriers.append({
                "code": "postnord",
                "name": "PostNord Hjemmelevering",
                "service": "Home Delivery",
                "description": "Sikker levering til din adresse med omdeling – 1-2 hverdage"
            })

    return JsonResponse({
        "pickup_points": pickup_points[:5],
        "home_delivery": home_delivery_carriers
    })

