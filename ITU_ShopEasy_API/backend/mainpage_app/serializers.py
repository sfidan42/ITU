from rest_framework import serializers
from .models import (
    Users, ItemUnits, Items, Stores, StoreItems,
    Transactions, ProductsExchanged, TotalBalance
)

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'


class ItemUnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemUnits
        fields = '__all__'


class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'


class StoresSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stores
        fields = '__all__'


class StoreItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreItems
        fields = '__all__'


class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = '__all__'


class ProductsExchangedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductsExchanged
        fields = '__all__'


class TotalBalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TotalBalance
        fields = '__all__'
