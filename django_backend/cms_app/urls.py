from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteLayoutViewSet, CMSPageViewSet, test_connection_ping, send_newsletter_email, get_shipmondo_delivery_options, deploy_status

router = DefaultRouter()
router.register(r'layouts', WebsiteLayoutViewSet, basename='layout')
router.register(r'cms-pages', CMSPageViewSet, basename='cms-page')

urlpatterns = [
    path('', include(router.urls)),
    path('visual-builder-test/', test_connection_ping, name='connection_ping'),
    path('send-newsletter-email/', send_newsletter_email, name='send_newsletter_email'),
    path('shipmondo-delivery-options/', get_shipmondo_delivery_options, name='shipmondo_delivery_options'),
    path('deploy-status/', deploy_status, name='deploy_status'),
]

