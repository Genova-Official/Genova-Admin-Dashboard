from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import AccountUser, AccountLocation, SalesSales, InventoryInventory, LogExpense
from django.db.models import Count, Sum, Q, F
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Using real data from production DB
        db = 'production'
        today = timezone.now().date()
        month_start = today.replace(day=1)
        
        # Real Business Count (Users who own at least one location)
        business_owner_ids = AccountLocation.objects.using(db).values_list('business_admin_id', flat=True).distinct()
        total_businesses = AccountUser.objects.using(db).filter(id__in=business_owner_ids).count()
        
        # Total Inflow (All Platform Sales)
        total_inflow = SalesSales.objects.using(db).aggregate(total=Sum('total_price'))['total'] or 0
        
        # Total Outflow (All Platform Expenses)
        # Note: LogExpense table has product_price and quantity.
        total_outflow = LogExpense.objects.using(db).aggregate(
            total=Sum(F('product_price') * F('quantity'))
        )['total'] or 0
        
        # Active Businesses Today
        active_today = SalesSales.objects.using(db).filter(created_at__date=today).values('owner').distinct().count()
        
        return Response({
            'total_businesses': total_businesses,
            'total_inflow': total_inflow,
            'total_outflow': total_outflow,
            'active_businesses_today': active_today,
            'total_platform_sales': total_inflow,
            'system_status': 'Operational',
            'uptime': '99.98%'
        })

class BusinessListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        db = 'production'
        search = request.query_params.get('search', '')
        
        # Filter for Main Business Accounts (those who own locations)
        business_owner_ids = AccountLocation.objects.using(db).values_list('business_admin_id', flat=True).distinct()
        
        query = Q(id__in=business_owner_ids)
        if search:
            query &= (Q(email__icontains=search) | Q(name__icontains=search))
            
        users = AccountUser.objects.using(db).filter(query).order_by('-created_at')[:100]
        
        data = []
        for user in users:
            locations = AccountLocation.objects.using(db).filter(business_admin=user)
            staff_count = AccountUser.objects.using(db).filter(created_by=user).count()
            
            data.append({
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'status': user.user_status,
                'is_verified': user.is_verified,
                'created_at': user.created_at,
                'location_count': locations.count(),
                'staff_count': staff_count
            })
            
        return Response(data)

class BusinessDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        db = 'production'
        try:
            user = AccountUser.objects.using(db).get(pk=pk)
            locations = AccountLocation.objects.using(db).filter(business_admin=user)
            staff = AccountUser.objects.using(db).filter(created_by=user)
            
            sales_summary = SalesSales.objects.using(db).filter(owner=user).aggregate(
                total_sales=Sum('total_price'),
                count=Count('id')
            )
            
            return Response({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'name': user.name,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'status': user.user_status,
                    'is_verified': user.is_verified,
                    'created_at': user.created_at,
                    'last_login': user.last_login,
                },
                'locations': [{
                    'id': loc.id,
                    'name': loc.location_name,
                    'is_main': loc.is_main_location,
                    'status': loc.status,
                    'created_at': loc.created_at
                } for loc in locations],
                'staff': [{
                    'id': s.id,
                    'email': s.email,
                    'name': s.name,
                    'status': s.user_status,
                    'last_login': s.last_login
                } for s in staff],
                'stats': {
                    'total_sales': sales_summary['total_sales'] or 0,
                    'sales_count': sales_summary['count'],
                }
            })
        except AccountUser.DoesNotExist:
            return Response({'error': 'Business not found'}, status=404)

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        db = 'production'
        # Group sales by day for the last 30 days
        thirty_days_ago = timezone.now() - timedelta(days=30)
        daily_sales = SalesSales.objects.using(db).filter(
            created_at__gte=thirty_days_ago
        ).extra(select={'day': "date(created_at)"}).values('day').annotate(
            total=Sum('total_price'),
            count=Count('id')
        ).order_by('day')
        
        return Response({
            'daily_sales': list(daily_sales),
            'top_businesses': [] # To be implemented
        })

class ActivityMonitorView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        db = 'production'
        # Recent sales across the entire platform
        recent_sales = SalesSales.objects.using(db).select_related('owner', 'location').order_by('-created_at')[:20]
        
        activities = []
        for sale in recent_sales:
            activities.append({
                'id': sale.id,
                'type': 'sale',
                'business': sale.owner.name if sale.owner else 'Unknown',
                'location': sale.location.location_name if sale.location else 'Unknown',
                'amount': sale.total_price,
                'time': sale.created_at,
                'status': sale.payment_status
            })
            
        return Response(activities)
