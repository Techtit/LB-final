import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

interface WishlistStore {
  items: string[];
  toggleItem: (handle: string) => void;
  isWishlisted: (handle: string) => boolean;
  clearWishlist: () => void;
  syncFromDb: (userId: string) => Promise<void>;
  syncToDb: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (handle) => {
        const { items } = get();
        if (items.includes(handle)) {
          set({ items: items.filter(h => h !== handle) });
        } else {
          set({ items: [...items, handle] });
        }
      },

      isWishlisted: (handle) => get().items.includes(handle),

      clearWishlist: () => set({ items: [] }),

      syncFromDb: async (userId: string) => {
        const { data, error } = await supabase
          .from('wishlists')
          .select('product_handle')
          .eq('user_id', userId);

        if (!error && data) {
          const dbHandles = data.map(r => r.product_handle);
          const localHandles = get().items;
          const merged = [...new Set([...localHandles, ...dbHandles])];
          set({ items: merged });

          const localOnly = merged.filter(h => !dbHandles.includes(h));
          if (localOnly.length > 0) {
            await supabase.from('wishlists').upsert(
              localOnly.map(h => ({ user_id: userId, product_handle: h })),
              { onConflict: 'user_id,product_handle' }
            );
          }
        }
      },

      syncToDb: async (userId: string) => {
        const { items } = get();
        const { data: dbItems } = await supabase
          .from('wishlists')
          .select('product_handle')
          .eq('user_id', userId);

        const dbHandles = dbItems?.map(r => r.product_handle) || [];

        const toAdd = items.filter(h => !dbHandles.includes(h));
        if (toAdd.length > 0) {
          await supabase.from('wishlists').upsert(
            toAdd.map(h => ({ user_id: userId, product_handle: h })),
            { onConflict: 'user_id,product_handle' }
          );
        }

        const toRemove = dbHandles.filter(h => !items.includes(h));
        if (toRemove.length > 0) {
          await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .in('product_handle', toRemove);
        }
      },
    }),
    {
      name: 'lalisa-belle-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
