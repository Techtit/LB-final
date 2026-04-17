import { useUser, useClerk } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  MapPin, 
  Package, 
  Settings, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Home,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false
  });

  const addresses = useQuery(api.profile.getAddresses);
  const orders = useQuery(api.profile.getOrders);
  const deleteAddress = useMutation(api.profile.deleteAddress);
  const addAddress = useMutation(api.profile.addAddress);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <a href="/auth">Sign In</a>
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

  return (
    <div className="min-h-screen bg-stone-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-stone-200 pt-16 pb-12">
        <div className="container max-w-5xl">
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
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Settings className="text-white w-6 h-6" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif text-stone-800 mb-1">{user.fullName}</h1>
              <p className="text-stone-500 font-sans tracking-tight mb-4">{user.primaryEmailAddress?.emailAddress}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button variant="outline" size="sm" className="bg-white hover:bg-stone-50 text-stone-700 border-stone-200">
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-destructive hover:text-destructive hover:bg-destructive/5 capitalize flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-5xl mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar Menu (Desktop) */}
        <div className="hidden lg:block space-y-2">
          <nav className="sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4 px-4">Account Overview</h3>
            {[
              { label: "Dashboard", icon: Home, active: true },
              { label: "My Orders", icon: Package },
              { label: "Addresses", icon: MapPin },
              { label: "Preferences", icon: Settings },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  item.active ? "bg-[#b18146] text-white shadow-md shadow-amber-900/10" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-sans font-medium text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Recent Orders Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-serif text-stone-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" /> Recent Orders
              </h2>
              <Button variant="link" className="text-amber-700 font-medium text-sm p-0 h-auto">View All</Button>
            </div>
            
            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.orderId} className="border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-stone-500 uppercase">Order #{order.orderId}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-stone-400 text-xs font-sans">{order.date}</p>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto">
                          <div className="text-right">
                            <p className="text-xs text-stone-400 uppercase font-bold mb-0.5">Total</p>
                            <p className="font-sans font-bold text-lg text-stone-800">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="text-stone-400 hover:text-amber-700">
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 bg-transparent border-stone-200">
                <CardContent className="py-12 flex flex-col items-center justify-center space-y-3">
                  <Clock className="w-10 h-10 text-stone-300" />
                  <p className="text-stone-400 font-sans text-sm italic">You haven't placed any orders yet.</p>
                  <Button variant="outline" className="mt-2 border-stone-200 hover:bg-stone-50">Start Shopping</Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Saved Addresses Section */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
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
                          <input 
                            placeholder="Full Name / Label"
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            required
                            value={addressForm.name}
                            onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                          />
                          <input 
                            placeholder="Street Address"
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            required
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                          />
                          <input 
                            placeholder="City"
                            className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                            required
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <input 
                              placeholder="State"
                              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                              required
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                            />
                            <input 
                              placeholder="ZIP Code"
                              className="w-full px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                              required
                              value={addressForm.zip}
                              onChange={(e) => setAddressForm({...addressForm, zip: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <label className="flex items-center gap-2 text-xs font-bold text-stone-500 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded text-amber-600 border-stone-300"
                              checked={addressForm.isDefault}
                              onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                            />
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
                        <button 
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-destructive transition-all p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-stone-800 font-sans">{addr.name}</p>
                        <p className="text-sm text-stone-500 leading-relaxed font-sans">{addr.street}</p>
                        <p className="text-sm text-stone-500 font-sans">{addr.city}, {addr.state} {addr.zip}</p>
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

          {/* Account Security Tip */}
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-100/50 flex gap-4 items-start shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="text-amber-900 font-bold text-sm tracking-tight">Security Tip</h4>
              <p className="text-amber-800/80 text-xs leading-relaxed font-sans">
                Make sure your primary email is verified. This ensures you receive important order updates and can recover your account easily. You can manage more security settings in your profile editor.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
