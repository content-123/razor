import './App.css';
import BookList from './BookList';
import AddBook from './AddBook';
import axios from 'axios';
import { useState, useEffect } from 'react';

function App() {
  
  const [cart, setCart] = useState([]);
  const [amount, setAmount] = useState(0);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get('http://localhost:5000/books');
    setBooks(response.data);
  };

  const addToCart = (book) => {
    setCart([...cart, book]);
    setAmount(amount + parseFloat(book.price));
  };
  const removeFromCart = (index) => {
    const bookToRemove = cart[index];
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    setAmount(amount - parseFloat(bookToRemove.price));
  };

  const handlePayment = async () => {
    const response = await axios.post('http://localhost:5000/create-order', { amount });
    const { id, currency, amount: orderAmount } = response.data;

    const options = {
      key: 'rzp_live_dCm4R9MkI9xyxZ', // Replace with your Razorpay Key ID
      amount: orderAmount,
      currency,
      order_id: id,
      handler: async function (response) {
        const paymentData = {
          order_id: response.razorpay_order_id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };
        const result = await axios.post('http://localhost:5000/verify-payment', paymentData);
        alert(result.data.status === 'success' ? 'Payment Successful' : 'Payment Failed');
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div className="App">
      <h1>Book Shop</h1>
      <AddBook fetchBooks={fetchBooks} />
      <BookList books={books} addToCart={addToCart} fetchBooks={fetchBooks} />
      <div>
        <h2>Cart</h2>
        <ul>
          {cart.map((book, index) => (
            <li key={index}>
              {book.title} by {book.author} - ${book.price}
              <button onClick={() => removeFromCart(index)}>Remove</button>
            </li>
          ))}
        </ul>
        {cart.length > 0 && (
          <div>
            <h3>Total Amount:₹{amount}</h3>
            <button onClick={handlePayment}>Pay with Razorpay</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
