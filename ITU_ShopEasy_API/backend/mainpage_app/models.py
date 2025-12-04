# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove ` ` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from datetime import datetime
from rest_framework import serializers

class Users(models.Model):
	password = models.CharField()
	last_login = models.DateTimeField(blank=True, null=True)
	username = models.CharField()
	first_name = models.CharField(blank=False, null=False, default="Didn't provide")
	last_name = models.CharField(blank=False, null=False, default="Didn't provide")
	email = models.CharField(blank=False, null=False, default="Didn't provide")
	is_active = models.BooleanField(blank=False, null=False, default=False)
	date_joined = models.DateTimeField(blank=True, null=False, default=datetime.now)
	balance = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=False, default=0)

	def __str__(self):
		return self.first_name + " " + self.last_name

	class Meta:
		verbose_name_plural = "Users"
		db_table = 'users'

class ItemUnits(models.Model):
	name = models.CharField(max_length=20, blank=True, null=True)

	def __str__(self):
		return self.name

	class Meta:
		verbose_name_plural = "ItemUnits"	   
		db_table = 'item_units'


class Items(models.Model):
	item_name = models.CharField(max_length=255, blank=True, null=True)
	description = models.TextField(blank=True, null=True)
	unit = models.ForeignKey(ItemUnits, models.DO_NOTHING, db_column='unit_id', blank=False, null=False, default = 0)
	
	def __str__(self):
		return self.item_name
	
	class Meta:
		verbose_name_plural = "Items"
		db_table = 'items'


class Stores(models.Model):
	store_name = models.CharField()
	location = models.CharField(max_length=255, blank=True, null=True)
	contact_email = models.CharField(max_length=100, blank=True, null=True)

	def __str__(self):
		return self.store_name

	class Meta:
		verbose_name_plural = "Stores"  
		db_table = 'stores'


class StoreItems(models.Model):
	store = models.ForeignKey(Stores, models.DO_NOTHING)
	item = models.ForeignKey(Items, models.DO_NOTHING)
	stock_quantity = models.DecimalField(max_digits=10, decimal_places=2)

	def __str__(self):
		return self.store.store_name + "'s " + self.item.item_name

	class Meta:
		verbose_name_plural = "Store_Items"   
		db_table = 'store_items'


class Transactions(models.Model):
	transaction_date = models.DateTimeField(blank=True, null=False, default=datetime.now)
	total_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=False, default = 0)
	customer = models.ForeignKey(Users, models.DO_NOTHING, blank=False, null=False, default = 0)

	class Meta:
		verbose_name_plural = "Transactions"
		db_table = 'transactions'


class ProductsExchanged(models.Model):
	transaction = models.ForeignKey('Transactions', models.DO_NOTHING)
	store_items = models.ForeignKey('StoreItems', models.DO_NOTHING)
	item_quantity = models.IntegerField()
	item_price = models.DecimalField(max_digits=10, decimal_places=2)

	class Meta:
		verbose_name_plural = "Prodcuts Exchanged"
		verbose_name = "Product Exchanged" 
		db_table = 'products_exchanged'


class TotalBalance(models.Model):
	id = models.IntegerField(primary_key=True)
	balance = models.DecimalField(max_digits=10, decimal_places=2)
	latest_withdrawal_date = models.DateTimeField(null=False, default=datetime.now)
	last_withdrawer = models.IntegerField(blank=True, null=False, default=0)

	class Meta:	  
		db_table = 'total_balance'


# serializers.py
class ItemUnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemUnits
        fields = '__all__'  # Or list specific fields like ['name', 'description']