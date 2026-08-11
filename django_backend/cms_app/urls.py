from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WebsiteLayoutViewSet, CMSPageViewSet, test_connection_ping, send_newsletter_email, get_shipmondo_delivery_options, deploy_status
from .auth_views import api_login, api_logout, api_register, api_me, api_password_reset, api_password_reset_confirm

router = DefaultRouter()
router.register(r'layouts', WebsiteLayoutViewSet, basename='layout')
router.register(r'cms-pages', CMSPageViewSet, basename='cms-page')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', api_login, name='api_login'),
    path('auth/logout/', api_logout, name='api_logout'),
    path('auth/register/', api_register, name='api_register'),
    path('auth/me/', api_me, name='api_me'),
    path('auth/password_reset/', api_password_reset, name='api_password_reset'),
    path('auth/password_reset_confirm/', api_password_reset_confirm, name='api_password_reset_confirm'),
    path('visual-builder-test/', test_connection_ping, name='connection_ping'),
    path('send-newsletter-email/', send_newsletter_email, name='send_newsletter_email'),
    path('shipmondo-delivery-options/', get_shipmondo_delivery_options, name='shipmondo_delivery_options'),
    path('deploy-status/', deploy_status, name='deploy_status'),
]

