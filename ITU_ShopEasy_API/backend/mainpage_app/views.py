from rest_framework.generics import ListCreateAPIView
from .models import (
    Users, ItemUnits, Items, Stores, StoreItems,
    Transactions, ProductsExchanged, TotalBalance
)
from .serializers import (
    UsersSerializer, ItemUnitsSerializer, ItemsSerializer,
    StoresSerializer, StoreItemsSerializer, TransactionsSerializer,
    ProductsExchangedSerializer, TotalBalanceSerializer
)

# --- USERS ---
class UsersListCreateView(ListCreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer


# --- ITEM UNITS ---
class ItemUnitsListCreateView(ListCreateAPIView):
    queryset = ItemUnits.objects.all()
    serializer_class = ItemUnitsSerializer


# --- ITEMS ---
class ItemsListCreateView(ListCreateAPIView):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer


# --- STORES ---
class StoresListCreateView(ListCreateAPIView):
    queryset = Stores.objects.all()
    serializer_class = StoresSerializer


# --- STORE ITEMS ---
class StoreItemsListCreateView(ListCreateAPIView):
    queryset = StoreItems.objects.all()
    serializer_class = StoreItemsSerializer


# --- TRANSACTIONS ---
class TransactionsListCreateView(ListCreateAPIView):
    queryset = Transactions.objects.all()
    serializer_class = TransactionsSerializer


# --- PRODUCTS EXCHANGED ---
class ProductsExchangedListCreateView(ListCreateAPIView):
    queryset = ProductsExchanged.objects.all()
    serializer_class = ProductsExchangedSerializer


# --- TOTAL BALANCE ---
class TotalBalanceListCreateView(ListCreateAPIView):
    queryset = TotalBalance.objects.all()
    serializer_class = TotalBalanceSerializer
