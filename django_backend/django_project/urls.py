from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.split if hasattr(admin.site, 'split') else admin.site.urls),
    path('api/', include('cms_app.urls')),
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
