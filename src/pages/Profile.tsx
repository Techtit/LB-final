import { useUser, useClerk } from "@clerk/clerk-react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  MapPin, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Home,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  X,
  RefreshCw,
  ShoppingBag,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type TabType = "dashboard" | "orders" | "addresses" | "preferences";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "", street: "", city: "", state: "", zip: "", isDefault: false
  });

  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [trackingUrl, setTrackingUrl] = useState<string | null>(null);

  // Convex existing mutations/queries
  const addresses = useQuery(api.profile.getAddresses);
  const deleteAddress = useMutation(api.profile.deleteAddress);
  const addAddress = useMutation(api.profile.addAddress);

  // Shopify Orders via Action
  const getCustomerOrders = useAction(api.shopify.getCustomerOrders);
  const [orders, setOrders] = useState<any[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        setIsFetchingOrders(true);
        const res = await getCustomerOrders();
        const parsed = JSON.parse(res);
        if (mounted && parsed?.data?.orders?.edges) {
          setOrders(parsed.data.orders.edges.map((e: any) => e.node));
        }
      } catch (err) {
        console.error("Failed to fetch shopify orders", err);
      } finally {
        if (mounted) setIsFetchingOrders(false);
      }
    })();
    return () => { mounted = false; };
  }, [user, getCustomerOrders]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-24 text-center">
        <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-serif mb-2">Please Sign In</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  const handleDeleteAddress = async (id: any) => {
    try {
      await deleteAddress({ id });
      toast.success("Address deleted successfully");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress(addressForm);
      setIsAddingAddress(false);
      setAddressForm({ name: "", street: "", city: "", state: "", zip: "", isDefault: false });
      toast.success("Address saved successfully");
    } catch (err) {
      toast.error("Failed to save address");
    }
  };

  const openTracking = (url: string) => {
    setTrackingUrl(url);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", { 
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  // Sections
  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:border-amber-200 transition-colors cursor-pointer shadow-sm" onClick={() => setActiveTab("orders")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-stone-800">My Orders</p>
              <p className="text-sm font-sans text-stone-500">{orders.length} total orders</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:border-amber-200 transition-colors cursor-pointer shadow-sm" onClick={() => setActiveTab("addresses")}>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-stone-800">Addresses</p>
              <p className="text-sm font-sans text-stone-500">{addresses?.length || 0} saved addresses</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-amber-50 rounded-xl p-6 border border-amber-100/50 flex gap-4 items-start shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <h4 className="text-amber-900 font-bold text-sm tracking-tight">Security Tip</h4>
          <p className="text-amber-800/80 text-xs leading-relaxed font-sans">
            Make sure your primary email is verified. This ensures you receive important order updates and can recover your account easily.
          </p>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-serif text-stone-800 flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-600" /> Order History
        </h2>
        {isFetchingOrders && <RefreshCw className="w-4 h-4 text-stone-400 animate-spin" />}
      </div>

      {!isFetchingOrders && orders.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent border-stone-200">
          <CardContent className="py-16 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-stone-300" />
            </div>
            <div className="text-center">
              <p className="text-stone-800 font-serif text-lg font-medium">No orders yet</p>
              <p className="text-stone-500 font-sans text-sm mt-1 mb-4">You haven't placed any orders yet.</p>
              <Button asChild className="bg-stone-800 hover:bg-stone-900 text-white rounded-full px-8">
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.id;
          const status = order.displayFulfillmentStatus || "UNFULFILLED";
          const trackingInfo = order.fulfillments?.edges?.[0]?.node?.trackingInfo?.[0] || order.fulfillments?.[0]?.trackingInfo?.[0]; 

          return (
            <Card key={order.id} className="border-stone-200 shadow-sm overflow-hidden">
              <div 
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-stone-700 font-sans">Order {order.name}</span>
                    <span className={cn(
                      "text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider",
                      status.includes('FULFILLED') || status.includes('DELIVERED') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-stone-500 text-xs font-sans tracking-wide">{formatDate(order.createdAt)}</p>
                </div>
                
                <div className="flex items-center justify-between gap-6 md:w-auto">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-0.5">Total Amount</p>
                    <p className="font-sans font-bold text-base text-stone-800">
                      {order.totalPriceSet.shopMoney.currencyCode === 'INR' ? '₹' : order.totalPriceSet.shopMoney.currencyCode}
                      {parseFloat(order.totalPriceSet.shopMoney.amount).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-stone-400 pointer-events-none">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-stone-100 bg-stone-50/30"
                  >
                    <div className="p-5">
                      {/* Line Items */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Items Ordered</h4>
                        {order.lineItems.edges.map((line: any, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-white rounded-md border border-stone-200 overflow-hidden shrink-0">
                              {line.node.image ? (
                                <img src={line.node.image.url} alt={line.node.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                  <Package className="w-6 h-6 text-stone-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-stone-800 font-sans truncate">{line.node.title}</p>
                              <p className="text-xs text-stone-500 font-sans mt-0.5">Qty: {line.node.quantity} {line.node.variantTitle && line.node.variantTitle !== "Default Title" ? `| ${line.node.variantTitle}` : ''}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Section */}
                      {trackingInfo && trackingInfo.url ? (
                        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                              <Truck className="w-4 h-4 text-primary" /> Track Your Package
                            </p>
                            <p className="text-xs text-stone-500 font-sans mt-1">
                              Via {trackingInfo.company} (Tracking: {trackingInfo.number})
                            </p>
                          </div>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); openTracking(trackingInfo.url); }}
                            className="bg-[#b18146] hover:bg-amber-700 text-white rounded-full w-full sm:w-auto font-sans"
                          >
                            Track Order
                          </Button>
                        </div>
                      ) : (
                         <div className="pt-4 border-t border-stone-200 flex items-center gap-2 text-sm text-stone-500 italic font-sans">
                            <Truck className="w-4 h-4 opacity-50" /> Tracking will be available soon
                         </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderAddresses = () => (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-serif text-stone-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-600" /> Saved Addresses
        </h2>
        <Button onClick={() => setIsAddingAddress(!isAddingAddress)} size="sm" className="bg-[#b18146] hover:bg-amber-700 text-white flex items-center gap-1.5 h-8 px-3 text-xs font-bold rounded-full">
          {isAddingAddress ? "CANCEL" : <><Plus className="w-3.5 h-3.5" /> ADD NEW</>}
        </Button>
      </div>

      <AnimatePresence>
        {isAddingAddress && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card className="border-amber-100 bg-amber-50/20">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-500">New Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Full Name / Label" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" required value={addressForm.name} onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} />
                    <input placeholder="Street Address" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" required value={addressForm.street} onChange={(e) => setAddressForm({...addressForm, street: e.target.value})} />
                    <input placeholder="City" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" required value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="State" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" required value={addressForm.state} onChange={(e) => setAddressForm({...addressForm, state: e.target.value})} />
                      <input placeholder="ZIP Code" className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" required value={addressForm.zip} onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-500 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded text-amber-600 border-stone-300" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} />
                      SET AS DEFAULT
                    </label>
                    <Button type="submit" size="sm" className="bg-[#b18146] hover:bg-amber-700 text-white px-6">SAVE ADDRESS</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((addr) => (
            <Card key={addr._id} className="border-stone-200/60 shadow-sm relative group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-1.5 rounded-md ${addr.isDefault ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'}`}>
                    <Home className="w-4 h-4" />
                  </div>
                  <button onClick={() => handleDeleteAddress(addr._id)} className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-destructive transition-all p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1 text-sans text-sm">
                  <p className="font-bold text-stone-800 font-sans text-base">{addr.name}</p>
                  <p className="text-stone-500 leading-relaxed font-sans">{addr.street}</p>
                  <p className="text-stone-500 font-sans">{addr.city}, {addr.state} {addr.zip}</p>
                </div>
                {addr.isDefault && (
                  <div className="mt-4 flex items-center gap-1.5 text-[#b18146] text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-3 h-3" /> Default Address
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-dashed border-2 bg-transparent border-stone-200">
            <CardContent className="py-12 flex flex-col items-center justify-center space-y-3">
              <MapPin className="w-10 h-10 text-stone-300" />
              <p className="text-stone-400 font-sans text-sm italic">Your address book is empty.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-serif text-stone-800 flex items-center gap-2 px-1">
        <Settings className="w-5 h-5 text-amber-600" /> Preferences
      </h2>
      <Card className="border-stone-200">
         <CardContent className="p-6 text-center">
            <Settings className="w-10 h-10 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 font-sans text-sm">Notification and security preferences will appear here soon.</p>
         </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
            onClick={() => setTrackingUrl(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden relative shadow-2xl flex flex-col border border-stone-200"
            >
              <div className="p-4 md:p-5 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div className="flex items-center gap-3 text-stone-800">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                     <Truck className="w-4 h-4 text-amber-700" />
                  </div>
                  <h2 className="font-serif text-xl font-medium">Track Order</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setTrackingUrl(null)} className="rounded-full hover:bg-stone-200">
                  <X className="w-5 h-5 opacity-70" />
                </Button>
              </div>
              <div className="flex-1 w-full bg-stone-100/50 relative overflow-hidden">
                {/* Loader showing while iframe implies loading */}
                <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-white">
                   <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-4" />
                   <p className="text-stone-500 font-sans text-sm">Loading tracking details securely...</p>
                </div>
                {/* Embed iframe */}
                <iframe src={trackingUrl} className="w-full h-full border-none z-10 bg-transparent" allow="geolocation" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="bg-white border-b border-stone-200 pt-16 pb-12">
        <div className="container max-w-5xl md:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className="relative group">
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "User"} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-1">{user.fullName}</h1>
              <p className="text-stone-500 font-sans tracking-tight mb-4">{user.primaryEmailAddress?.emailAddress}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button variant="outline" size="sm" className="bg-white hover:bg-stone-50 text-stone-700 border-stone-200 font-sans">
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-destructive hover:text-destructive hover:bg-destructive/5 font-sans flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-5xl md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12 pl-4 pr-4">
        {/* Left Sidebar Menu (Desktop) */}
        <div className="hidden lg:block col-span-1">
          <nav className="sticky top-28 space-y-1.5">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4 px-4">Account Overview</h3>
            {[
              { label: "Dashboard", id: "dashboard", icon: Home },
              { label: "My Orders", id: "orders", icon: Package },
              { label: "Addresses", id: "addresses", icon: MapPin },
              { label: "Preferences", id: "preferences", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id ? "bg-stone-900 text-white shadow-md" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span className="font-sans font-medium text-sm">{item.label}</span>
                </div>
                {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation Dropdown/Tabs */}
        <div className="lg:hidden flex overflow-x-auto space-x-2 pb-2 scrollbar-hide border-b border-stone-200">
           {[
              { label: "Dashboard", id: "dashboard" },
              { label: "My Orders", id: "orders" },
              { label: "Addresses", id: "addresses" },
              { label: "Preferences", id: "preferences" },
            ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as TabType)}
                 className={`whitespace-nowrap px-4 py-2 text-sm font-sans font-medium rounded-full transition-colors ${
                   activeTab === item.id ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600"
                 }`}
               >
                 {item.label}
               </button>
            ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboard" && renderDashboard()}
              {activeTab === "orders" && renderOrders()}
              {activeTab === "addresses" && renderAddresses()}
              {activeTab === "preferences" && renderPreferences()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
