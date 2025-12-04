from mainpage_app.models import Users, ItemUnits, Items, Stores, StoreItems

# --- USERS ---
users_data = [
    {'username': 'hasancelik', 'password': 'hasanpass', 'first_name': 'Hasan', 'last_name': 'Celik', 'email': 'hasan.celik@mycompany.com'},
    {'username': 'huseyinyilmaz', 'password': 'huseyinpass', 'first_name': 'Huseyin', 'last_name': 'Yilmaz', 'email': 'huseyin.yilmaz@mycompany.com'},
    {'username': 'alisahin', 'password': 'alipass', 'first_name': 'Ali', 'last_name': 'Sahin', 'email': 'ali.sahin@mycompany.com'},
    {'username': 'zeynepyildirim', 'password': 'zeyneppass', 'first_name': 'Zeynep', 'last_name': 'Yildirim', 'email': 'zeynep.yildirim@mycompany.com'},
    {'username': 'fatmaaydin', 'password': 'fatmapass', 'first_name': 'Fatma', 'last_name': 'Aydin', 'email': 'fatma.aydin@mycompany.com'},
]

for data in users_data:
    Users.objects.get_or_create(
        username=data['username'],
        defaults={
            'password': data['password'],
            'first_name': data['first_name'],
            'last_name': data['last_name'],
            'email': data['email'],
            'is_active': True,
            'balance': 0.00
        }
    )


# --- ITEM UNITS ---
unit_names = ['kilograms', 'liters', 'each', 'packs']
for name in unit_names:
    ItemUnits.objects.get_or_create(name=name)


# --- ITEMS ---
items_data = [
    {'item_name': 'Elma', 'description': 'Yerli amasya elmasi', 'unit__name': 'kilograms'},
    {'item_name': 'Muz', 'description': 'Taze ithal muz', 'unit__name': 'kilograms'},
    {'item_name': 'Ekmek', 'description': 'Gunluk tas firin ekmegi', 'unit__name': 'each'},
]

for data in items_data:
    unit = ItemUnits.objects.get(name=data['unit__name'])
    Items.objects.get_or_create(
        item_name=data['item_name'],
        defaults={
            'description': data['description'],
            'unit': unit
        }
    )


# --- STORES ---
stores_data = [
    {'store_name': 'Benzin Istasyonu', 'location': 'Petrol Sokak No 1, Besiktas, Istanbul', 'contact_email': 'contact@benzinci.com'},
    {'store_name': 'Teknoloji Dukkani', 'location': 'Teknoloji Sokak No 2, Sariyer, Istanbul', 'contact_email': 'contact@techmarket.com'},
    {'store_name': 'Telefon Operatoru', 'location': 'Iletisim Sokak No 60, Etiler, Istanbul', 'contact_email': 'contact@telefoncell.com'},
    {'store_name': 'Internet Servis Saglayici', 'location': 'Ucuzasat Sokak No 63, Besiktas, Istanbul', 'contact_email': 'info@hizlikablolar.com'},
    {'store_name': 'Supermarket', 'location': 'Ucuzasat Sokak No 63, Besiktas, Istanbul', 'contact_email': 'support@supermarket.com'},
]

for data in stores_data:
    Stores.objects.get_or_create(
        store_name=data['store_name'],
        defaults={
            'location': data['location'],
            'contact_email': data['contact_email']
        }
    )


# --- STORE ITEMS ---
store_item_data = [
    {'store_name': 'Supermarket', 'item_name': 'Elma', 'stock_quantity': 750.00},
    {'store_name': 'Supermarket', 'item_name': 'Muz', 'stock_quantity': 500.00},
    {'store_name': 'Supermarket', 'item_name': 'Ekmek', 'stock_quantity': 110.00},
]

for data in store_item_data:
    store = Stores.objects.get(store_name=data['store_name'])
    item = Items.objects.get(item_name=data['item_name'])
    StoreItems.objects.get_or_create(
        store=store,
        item=item,
        defaults={'stock_quantity': data['stock_quantity']}
    )
