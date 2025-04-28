import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/user';
import { orderReducer } from './reducers/order';
import { productReducer } from './reducers/product';
import { eventReducer } from './reducers/event';
import { cartReducer } from './reducers/cart';
import { wishlistReducer } from './reducers/wishlist';
import { sellerReducer } from './reducers/seller';


const Store = configureStore({
    reducer: {
        user: userReducer,
        order: orderReducer,
        seller: sellerReducer,
        products: productReducer,
        events: eventReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
    }
});

export default Store;