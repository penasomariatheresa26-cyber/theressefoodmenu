import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { MenuItem, CartItem, Order, WalletTransaction } from './types';

const defaultMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Platter',
    description: 'Tender grilled chicken breast served with roasted vegetables, garlic mashed potatoes, and our signature herb sauce.',
    price: 12.99,
    image: '/images/food-1.jpg',
    category: 'meals',
    available: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Classic Beef Burger',
    description: 'Juicy Angus beef patty with lettuce, tomato, pickles, and special sauce on a toasted brioche bun. Served with crispy fries.',
    price: 10.99,
    image: '/images/food-2.jpg',
    category: 'meals',
    available: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Pasta Pomodoro',
    description: 'Al dente spaghetti tossed in a rich tomato basil sauce with fresh parmesan cheese and aromatic Italian herbs.',
    price: 9.99,
    image: '/images/food-3.jpg',
    category: 'meals',
    available: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, topped with fresh berries and a dusting of powdered sugar. Served with vanilla ice cream.',
    price: 7.99,
    image: '/images/food-4.jpg',
    category: 'desserts',
    available: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Avocado Shrimp Salad',
    description: 'Fresh mixed greens with grilled shrimp, ripe avocado, cherry tomatoes, and citrus vinaigrette dressing.',
    price: 11.49,
    image: '/images/food-5.jpg',
    category: 'meals',
    available: true,
  },
  {
    id: '6',
    name: 'Iced Coffee Frappe',
    description: 'Blended iced coffee with milk, caramel drizzle, and whipped cream. A perfect refreshing beverage.',
    price: 5.49,
    image: '/images/food-6.jpg',
    category: 'drinks',
    available: true,
  },
  {
    id: '7',
    name: 'Mango Smoothie',
    description: 'Fresh mango blended with yogurt, honey, and ice. Naturally sweet and incredibly refreshing.',
    price: 4.99,
    image: '/images/food-6.jpg',
    category: 'drinks',
    available: true,
  },
  {
    id: '8',
    name: 'Garlic Bread Basket',
    description: 'Warm garlic bread toasted to perfection with butter, garlic, and fresh parsley. Perfect as a starter.',
    price: 3.99,
    image: '/images/food-2.jpg',
    category: 'sides',
    available: true,
  },
  {
    id: '9',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of espresso-soaked ladyfingers, mascarpone cream, and cocoa powder.',
    price: 6.99,
    image: '/images/food-4.jpg',
    category: 'desserts',
    available: true,
  },
  {
    id: '10',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with parmesan cheese, croutons, and creamy Caesar dressing.',
    price: 8.49,
    image: '/images/food-5.jpg',
    category: 'sides',
    available: true,
  },
  {
    id: '11',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemonade with a hint of mint. Served ice cold for maximum refreshment.',
    price: 3.49,
    image: '/images/food-6.jpg',
    category: 'drinks',
    available: true,
  },
  {
    id: '12',
    name: 'BBQ Ribs',
    description: 'Slow-cooked baby back ribs glazed with our house-made BBQ sauce, served with coleslaw and cornbread.',
    price: 15.99,
    image: '/images/food-1.jpg',
    category: 'meals',
    available: true,
  },
];

interface AppState {
  menuItems: MenuItem[];
  cart: CartItem[];
  orders: Order[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  userName: string;
}

type Action =
  | { type: 'ADD_TO_CART'; payload: MenuItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_MENU_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_MENU_ITEM'; payload: MenuItem }
  | { type: 'DELETE_MENU_ITEM'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'TOGGLE_ADMIN' }
  | { type: 'TOP_UP_WALLET'; payload: number }
  | { type: 'DEDUCT_WALLET'; payload: { amount: number; description: string } }
  | { type: 'LOGIN'; payload: { name: string; isAdmin: boolean } }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  menuItems: defaultMenuItems,
  cart: [],
  orders: [],
  walletBalance: 50.00,
  walletTransactions: [
    { id: 'txn-1', type: 'topup', amount: 50.00, description: 'Initial top-up', date: new Date().toISOString() },
  ],
  isAdmin: false,
  isLoggedIn: false,
  userName: '',
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.menuItem.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.menuItem.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { menuItem: action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.menuItem.id !== action.payload) };
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return { ...state, cart: state.cart.filter(item => item.menuItem.id !== action.payload.id) };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.menuItem.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_MENU_ITEM':
      return { ...state, menuItems: [...state.menuItems, action.payload] };
    case 'UPDATE_MENU_ITEM':
      return {
        ...state,
        menuItems: state.menuItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_MENU_ITEM':
      return { ...state, menuItems: state.menuItems.filter(item => item.id !== action.payload) };
    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.id ? { ...order, status: action.payload.status } : order
        ),
      };
    case 'TOGGLE_ADMIN':
      return { ...state, isAdmin: !state.isAdmin };
    case 'TOP_UP_WALLET': {
      const txn: WalletTransaction = {
        id: `txn-${Date.now()}`,
        type: 'topup',
        amount: action.payload,
        description: 'Wallet top-up',
        date: new Date().toISOString(),
      };
      return {
        ...state,
        walletBalance: state.walletBalance + action.payload,
        walletTransactions: [txn, ...state.walletTransactions],
      };
    }
    case 'DEDUCT_WALLET': {
      const txn: WalletTransaction = {
        id: `txn-${Date.now()}`,
        type: 'payment',
        amount: action.payload.amount,
        description: action.payload.description,
        date: new Date().toISOString(),
      };
      return {
        ...state,
        walletBalance: state.walletBalance - action.payload.amount,
        walletTransactions: [txn, ...state.walletTransactions],
      };
    }
    case 'LOGIN':
      return { ...state, isLoggedIn: true, userName: action.payload.name, isAdmin: action.payload.isAdmin };
    case 'LOGOUT':
      return { ...state, isLoggedIn: false, userName: '', isAdmin: false, cart: [] };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
