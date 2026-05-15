from django.db import models

class ProductionBase(models.Model):
    class Meta:
        managed = False
        abstract = True

class AccountUser(ProductionBase):
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    is_active = models.BooleanField()
    is_verified = models.BooleanField()
    is_staff = models.BooleanField()
    user_status = models.CharField(max_length=20)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField()
    last_login = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey('self', on_delete=models.DO_NOTHING, blank=True, null=True, related_name='created_users')

    class Meta(ProductionBase.Meta):
        db_table = 'Account_user'

    def __str__(self):
        return self.email

class AccountLocation(ProductionBase):
    id = models.CharField(primary_key=True, max_length=20)
    business_admin = models.ForeignKey(AccountUser, on_delete=models.DO_NOTHING, related_name='locations')
    location_name = models.CharField(max_length=255)
    is_main_location = models.BooleanField()
    status = models.CharField(max_length=20)
    created_at = models.DateTimeField()

    class Meta(ProductionBase.Meta):
        db_table = 'Account_location'

class SalesSales(ProductionBase):
    id = models.CharField(primary_key=True, max_length=10)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    payment_status = models.CharField(max_length=20)
    vat_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField()
    owner = models.ForeignKey(AccountUser, on_delete=models.DO_NOTHING, related_name='sales')
    location = models.ForeignKey(AccountLocation, on_delete=models.DO_NOTHING, related_name='sales')

    class Meta(ProductionBase.Meta):
        db_table = 'Sales_sales'

class InventoryInventory(ProductionBase):
    id = models.CharField(primary_key=True, max_length=20)
    product_name = models.CharField(max_length=255)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    owner = models.ForeignKey(AccountUser, on_delete=models.DO_NOTHING, related_name='inventory')
    location = models.ForeignKey(AccountLocation, on_delete=models.DO_NOTHING, related_name='inventory')

    class Meta(ProductionBase.Meta):
        db_table = 'Inventory_inventory'

class LogExpense(ProductionBase):
    id = models.CharField(primary_key=True, max_length=20)
    product_name = models.CharField(max_length=255)
    product_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    created_at = models.DateTimeField()
    user = models.ForeignKey(AccountUser, on_delete=models.DO_NOTHING, related_name='expenses')
    location = models.ForeignKey(AccountLocation, on_delete=models.DO_NOTHING, related_name='expenses')

    class Meta(ProductionBase.Meta):
        db_table = 'Log_expense'
