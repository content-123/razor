import React, { useState } from 'react';
import axios from 'axios';

const AddBook = ({ fetchBooks }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');

  const addBook = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/books', { title, author, price });
    setTitle('');
    setAuthor('');
    setPrice('');
    fetchBooks();
  };

  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={addBook}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddBook;
