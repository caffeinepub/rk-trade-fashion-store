import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Iter "mo:core/Iter";

import Order "mo:core/Order";
import Time "mo:core/Time";
import List "mo:core/List";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";


actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type Category = {
    #men;
    #women;
    #kids;
    #newArrivals;
    #sale;
  };

  public type Product = {
    id : Text;
    name : Text;
    price : Nat; // Price in cents
    category : Category;
    sizes : [Text];
    description : Text;
    stock : Nat;
    featured : Bool;
    image : Storage.ExternalBlob;
    thumbnail : Storage.ExternalBlob;
  };

  public type CartItem = {
    id : Text;
    quantity : Nat;
    price : Nat;
    size : Text;
  };

  public type Cart = {
    id : Text;
    items : [CartItem];
  };

  public type OrderItem = {
    id : Text;
    quantity : Nat;
    price : Nat;
    size : Text;
  };

  public type OrderStatus = {
    #pending;
    #shipped;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : Text;
    items : [OrderItem];
    total : Nat;
    status : OrderStatus;
    timestamp : Int;
  };

  public type ProductEditDTO = {
    name : Text;
    price : Nat;
    category : Category;
    sizes : [Text];
    description : Text;
    stock : Nat;
    featured : Bool;
    image : Storage.ExternalBlob;
    thumbnail : Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  // Stores
  let products = Map.empty<Text, Product>();
  let userCarts = Map.empty<Principal, Cart>();
  let userOrders = Map.empty<Principal, List.List<Order>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var productIdCounter : Nat = 0;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Query Functions (Public - no auth required)

  public query ({ caller }) func queryProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func queryProduct(id : Text) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product for id " # id # " does not exist") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func listProductsByCategory(category : Category) : async [Product] {
    products.values().filter(func(p : Product) : Bool { p.category == category }).toArray();
  };

  public query ({ caller }) func searchProductsByName(searchTerm : Text) : async [Product] {
    products.values().filter(func(p : Product) : Bool {
      p.name.toLower().contains(#text (searchTerm.toLower()));
    }).toArray();
  };

  public query ({ caller }) func getFeaturedProducts() : async [Product] {
    products.values().filter(func(p : Product) : Bool { p.featured }).toArray();
  };

  // Admin Product Functions

  public shared ({ caller }) func addProduct(productData : ProductEditDTO) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };

    productIdCounter += 1;
    let productId = productIdCounter.toText();

    let newProduct : Product = {
      id = productId;
      name = productData.name;
      price = productData.price;
      category = productData.category;
      sizes = productData.sizes;
      description = productData.description;
      stock = productData.stock;
      featured = productData.featured;
      image = productData.image;
      thumbnail = productData.thumbnail;
    };

    products.add(productId, newProduct);
    productId;
  };

  public shared ({ caller }) func updateProduct(id : Text, productData : ProductEditDTO) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product for id " # id # " does not exist") };
      case (?existingProduct) {
        let updatedProduct : Product = {
          id = existingProduct.id;
          name = productData.name;
          price = productData.price;
          category = productData.category;
          sizes = productData.sizes;
          description = productData.description;
          stock = productData.stock;
          featured = productData.featured;
          image = productData.image;
          thumbnail = productData.thumbnail;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product for id " # id # " does not exist") };
      case (?_) { products.remove(id) };
    };
  };

  // Cart Helper Functions
  func getCartForUser(caller : Principal) : Cart {
    switch (userCarts.get(caller)) {
      case (null) {
        let newCart : Cart = { id = caller.toText(); items = [] };
        userCarts.add(caller, newCart);
        newCart;
      };
      case (?cart) { cart };
    };
  };

  // Cart Operations (User-only)

  public query ({ caller }) func getCart() : async Cart {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view carts");
    };
    getCartForUser(caller);
  };

  public shared ({ caller }) func addItemToCart(id : Text, size : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manipulate carts");
    };

    let cart = getCartForUser(caller);
    let product = switch (products.get(id)) {
      case (null) { Runtime.trap("Trying to add product to cart that does not exist") };
      case (?product) { product };
    };

    switch (cart.items.find(func(item) { item.id == id and item.size == size })) {
      case (null) {
        let newCartItem : CartItem = {
          id = id;
          quantity;
          price = product.price;
          size;
        };

        let itemsList = List.empty<CartItem>();
        for (item in cart.items.values()) { itemsList.add(item) };
        itemsList.add(newCartItem);

        let newCart : Cart = {
          cart with
          items = itemsList.toArray();
        };

        userCarts.add(caller, newCart);
      };
      case (?cartItem) {
        let updatedItems = cart.items.map(
          func(item) { if (item.id == cartItem.id and item.size == cartItem.size) { { item with quantity = item.quantity + quantity } } else { item } }
        );
        let updatedCart : Cart = {
          cart with
          items = updatedItems;
        };
        userCarts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func updateCartItemQuantity(productId : Text, size : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manipulate carts");
    };

    let cart = getCartForUser(caller);

    let updatedCart : Cart = {
      cart with
      items = cart.items.map<CartItem, CartItem>(func(item) { if (item.id == productId and item.size == size) { { item with quantity = quantity } } else { item } });
    };

    userCarts.add(caller, updatedCart);
  };

  public shared ({ caller }) func removeItemFromCart(productId : Text, size : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manipulate carts");
    };

    let cart = getCartForUser(caller);

    let itemsList = List.empty<CartItem>();
    for (item in cart.items.values()) {
      if (item.id != productId or item.size != size) {
        itemsList.add(item);
      };
    };

    let newCart : Cart = {
      cart with
      items = itemsList.toArray();
    };

    userCarts.add(caller, newCart);
  };

  public shared ({ caller }) func clearCart() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manipulate carts");
    };

    let cart = getCartForUser(caller);
    let emptyCart = {
      cart with
      items = [];
    };

    userCarts.add(caller, emptyCart);
  };

  // Order Helper Functions
  func calculateCartTotal(cart : Cart) : Nat {
    var total = 0;
    for (item in cart.items.values()) {
      total += item.price * item.quantity;
    };
    total;
  };

  // Order Functions (User-only)

  public shared ({ caller }) func placeOrder() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };

    let cart = getCartForUser(caller);

    if (cart.items.size() == 0) {
      Runtime.trap("Cannot place order with empty cart");
    };

    let cartItems = cart.items.map(
      func(cartItem) : OrderItem {
        {
          id = cartItem.id;
          quantity = cartItem.quantity;
          price = cartItem.price;
          size = cartItem.size;
        };
      }
    );

    let newOrder : Order = {
      id = caller.toText() # "-" # Time.now().toText();
      items = cartItems;
      total = calculateCartTotal(cart);
      status = #pending;
      timestamp = Time.now();
    };

    let orders = switch (userOrders.get(caller)) {
      case (null) {
        let orders = List.empty<Order>();
        orders.add(newOrder);
        orders;
      };
      case (?orders) { orders.add(newOrder); orders };
    };

    userOrders.add(caller, orders);

    // Clear cart after placing order
    let emptyCart = {
      cart with
      items = [];
    };
    userCarts.add(caller, emptyCart);
  };

  public query ({ caller }) func viewOrderHistory() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view order history");
    };

    switch (userOrders.get(caller)) {
      case (null) { [] };
      case (?orders) { orders.toArray() };
    };
  };

  // Admin Order Functions

  public shared ({ caller }) func updateOrderStatus(userId : Principal, orderId : Text, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (userOrders.get(userId)) {
      case (null) { Runtime.trap("No orders found for user") };
      case (?orders) {
        let updatedOrders = List.empty<Order>();
        var found = false;

        for (order in orders.values()) {
          if (order.id == orderId) {
            updatedOrders.add({ order with status = newStatus });
            found := true;
          } else {
            updatedOrders.add(order);
          };
        };

        if (not found) {
          Runtime.trap("Order not found");
        };

        userOrders.add(userId, updatedOrders);
      };
    };
  };

  public query ({ caller }) func listAllOrders() : async [(Principal, [Order])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };

    userOrders.entries().toArray().map(
      func((principal, orderList)) {
        (principal, orderList.toArray());
      }
    );
  };
};

