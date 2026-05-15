from django.urls import path
from .views import DashboardStatsView, BusinessListView, BusinessDetailView, AnalyticsView, ActivityMonitorView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('businesses/', BusinessListView.as_view(), name='business-list'),
    path('businesses/<int:pk>/', BusinessDetailView.as_view(), name='business-detail'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('activity/', ActivityMonitorView.as_view(), name='activity-monitor'),
]
