from django.contrib import admin


# Register your models here.
from .models import Users,Stores,ItemUnits,Items,StoreItems, Transactions

admin.site.register(Users)
admin.site.register(Stores)
admin.site.register(ItemUnits)
admin.site.register(Items)
admin.site.register(StoreItems)