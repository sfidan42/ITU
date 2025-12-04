from django.urls import path
from . import views

urlpatterns = [
    path('api/users/', views.UsersListCreateView.as_view(), name='users-list-create'),
    path('api/item-units/', views.ItemUnitsListCreateView.as_view(), name='itemunits-list-create'),
    path('api/items/', views.ItemsListCreateView.as_view(), name='items-list-create'),
    path('api/stores/', views.StoresListCreateView.as_view(), name='stores-list-create'),
    path('api/store-items/', views.StoreItemsListCreateView.as_view(), name='storeitems-list-create'),
    path('api/transactions/', views.TransactionsListCreateView.as_view(), name='transactions-list-create'),
    path('api/products-exchanged/', views.ProductsExchangedListCreateView.as_view(), name='productsexchanged-list-create'),
    path('api/total-balance/', views.TotalBalanceListCreateView.as_view(), name='totalbalance-list-create'),
]
