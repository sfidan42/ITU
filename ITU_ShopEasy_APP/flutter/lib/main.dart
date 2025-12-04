import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MainApp());
}

class MainApp extends StatefulWidget {
  const MainApp({super.key});

  @override
  State<MainApp> createState() => _MainAppState();
}

class _MainAppState extends State<MainApp> {
  List<dynamic> stores = [];
  List<dynamic> items = [];
  List<dynamic> storeItems = [];

  List<Map<String, dynamic>> selectedItems = [];
  String? selectedStore;

  bool isLoading = true;
  String errorMessage = '';

  final String baseUrl = 'http://10.0.2.2:8000/api';

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    setState(() {
      isLoading = true;
      errorMessage = '';
    });

    try {
      final storeResponse = await http.get(Uri.parse('$baseUrl/stores/'));
      final itemResponse = await http.get(Uri.parse('$baseUrl/items/'));
      final storeItemResponse =
          await http.get(Uri.parse('$baseUrl/store-items/'));

      if (storeResponse.statusCode == 200 &&
          itemResponse.statusCode == 200 &&
          storeItemResponse.statusCode == 200) {
        stores = json.decode(storeResponse.body);
        items = json.decode(itemResponse.body);
        storeItems = json.decode(storeItemResponse.body);

        // Debug: print all data
        debugPrint('Stores: $stores');
        debugPrint('Items: $items');
        debugPrint('StoreItems: $storeItems');

        setState(() {
          isLoading = false;
        });
      } else {
        setState(() {
          errorMessage =
              'Failed to fetch data (Stores: ${storeResponse.statusCode}, Items: ${itemResponse.statusCode}, StoreItems: ${storeItemResponse.statusCode})';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        errorMessage = 'Error fetching data: $e';
        isLoading = false;
      });
    }
  }

  void selectStore(String storeName) {
    setState(() {
      selectedStore = storeName;
      selectedItems.clear();
    });
  }

  void addItem(Map<String, dynamic> item) {
    if (selectedStore == null) {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Select a store first!')));
      return;
    }

    setState(() {
      final index = selectedItems.indexWhere(
          (e) => e['item']['item_name'] == item['item_name'] && e['store'] == selectedStore);
      if (index != -1) {
        selectedItems[index]['count']++;
      } else {
        selectedItems.add({'item': item, 'store': selectedStore, 'count': 1});
      }
    });
  }

  double calculateTotalCost() {
    return selectedItems.fold(
      0.0,
      (sum, entry) => sum + entry['count'] * (entry['item']['price'] ?? 0.0),
    );
  }

  /// Join StoreItems → Items → Stores in Flutter
  List<dynamic> get filteredProducts {
    if (selectedStore == null) return [];

    // Find store id
    final storeObj = stores.firstWhere(
        (store) => store['store_name'] == selectedStore,
        orElse: () => null);
    if (storeObj == null) return [];

    final storeId = storeObj['id'];

    // Filter StoreItems for selected store
    final storeItemList =
        storeItems.where((si) => si['store'] == storeId).toList();

    // Map storeItem to real item details
    return storeItemList.map((si) {
      final itemObj = items.firstWhere(
        (i) => i['id'] == si['item'],
        orElse: () => {'item_name': 'Unknown', 'description': ''},
      );

      // Convert stock_quantity to double
      final stockQuantity = double.tryParse(si['stock_quantity'].toString()) ?? 0.0;

      // Cast itemObj to Map<String, dynamic>
      final itemMap = Map<String, dynamic>.from(itemObj);

      return {
        ...itemMap,
        'stock_quantity': stockQuantity,
      };
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Store & Product Selector'),
          backgroundColor: Colors.blueGrey,
          actions: [IconButton(icon: const Icon(Icons.refresh), onPressed: fetchData)],
        ),
        body: isLoading
            ? const Center(child: CircularProgressIndicator())
            : errorMessage.isNotEmpty
                ? Center(child: Text(errorMessage))
                : Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Stores
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Stores',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18)),
                                  const SizedBox(height: 6),
                                  ...stores.map((store) {
                                    final isSelected =
                                        store['store_name'] == selectedStore;
                                    return Card(
                                      color:
                                          isSelected ? Colors.blue[100] : null,
                                      child: ListTile(
                                        title: Text(store['store_name']),
                                        subtitle: Text(store['location']),
                                        onTap: () =>
                                            selectStore(store['store_name']),
                                      ),
                                    );
                                  }),
                                ],
                              ),
                            ),

                            const SizedBox(width: 12),

                            // Products
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Products',
                                      style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18)),
                                  const SizedBox(height: 6),
                                  if (selectedStore == null)
                                    const Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Text(
                                        'Select a store from left side',
                                        style: TextStyle(
                                            fontSize: 16,
                                            fontStyle: FontStyle.italic),
                                      ),
                                    )
                                  else if (filteredProducts.isEmpty)
                                    const Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Text(
                                        'No products available in this store',
                                        style: TextStyle(
                                            fontSize: 16,
                                            fontStyle: FontStyle.italic),
                                      ),
                                    )
                                  else
                                    ...filteredProducts.map((item) {
                                      return Card(
                                        child: ListTile(
                                          title: Text(item['item_name']),
                                          subtitle: Text(item['description'] ?? ''),
                                          trailing: IconButton(
                                            icon: const Icon(Icons.add_shopping_cart),
                                            onPressed: item['stock_quantity'] > 0
                                                ? () => addItem(item)
                                                : null,
                                          ),
                                        ),
                                      );
                                    }),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const Divider(),

                        // Selected items
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Selected Items',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18)),
                              const SizedBox(height: 6),
                              Expanded(
                                child: ListView.builder(
                                  itemCount: selectedItems.length,
                                  itemBuilder: (context, index) {
                                    final entry = selectedItems[index];
                                    return ListTile(
                                      title: Text(entry['item']['item_name']),
                                      subtitle: Text('Store: ${entry['store']}'),
                                      trailing: Text(
                                          '${entry['count']} × ${(entry['item']['price'] ?? 0).toStringAsFixed(2)} ₺'),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Total cost
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Text(
                            'Total Cost: ${calculateTotalCost().toStringAsFixed(2)} ₺',
                            style: const TextStyle(
                                fontSize: 20, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }
}
