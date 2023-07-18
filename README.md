# E-Commerce App (MERN Stack)

Welcome to our **E-Commerce App** built using the MERN (MongoDB, Express, React, Node.js) stack! This app provides a seamless online shopping experience with features like registration, login, product browsing, cart management, checkout, and a user dashboard.

🌐 **Website Link:** [https://white-mussel-hose.cyclic.app/](https://white-mussel-hose.cyclic.app/)

## Features

- **Register/Login**: Create an account or log in to access shopping features.
- **Product Browsing**: Explore a wide range of products by category.
- **Shopping Cart**: Add, update, and remove items in your cart.
- **Checkout**: Finalize purchases with billing and shipping details.
- **User Dashboard**: View order history and manage account settings.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shazzzank/ecommerce.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ecommerce
   ```

3. Install server and client dependencies:
   ```bash
   npm install
   cd client
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following constants to the `.env` file:

   ```
   BT_MERCHANTID=your_braintree_merchant_id
   BT_PUBLICKEY=your_braintree_public_key
   BT_PRIVATEKEY=your_braintree_private_key
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   JWT_SIGN=your_jwt_secret
   MONGO_URL=your_mongodb_connection_string
   ```

5. Build the React app:
   ```bash
   npm run build
   ```

6. Start the server and the app:
   ```bash
   npm start
   ```

## Usage

1. Open the app: [https://white-mussel-hose.cyclic.app/](https://white-mussel-hose.cyclic.app/).
2. Register/Login to access shopping features.
3. Browse products and click to view details.
4. Add items to your cart and manage the cart.
5. Complete checkout with billing and shipping info.
6. Access the user dashboard to view orders and settings.

## Contributing

We welcome your contributions! Feel free to open issues or pull requests.

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.

🛍️ Happy Shopping! 🛍️

## Dependencies

### Backend (Server)

- bcrypt: ^5.1.0
- braintree: ^3.16.0
- concurrently: ^8.2.0
- cors: ^2.8.5
- dotenv: ^16.3.1
- express: ^4.18.2
- jsonwebtoken: ^9.0.0
- mongoose: ^7.3.1
- nodemailer: ^6.9.3
- nodemon: ^2.0.22
- slugify: ^1.6.6

### Frontend (Client)

- @testing-library/jest-dom: ^5.16.5
- @testing-library/react: ^13.4.0
- @testing-library/user-event: ^13.5.0
- axios: ^1.4.0
- braintree-web-drop-in-react: ^1.2.1
- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.14.0
- react-scripts: 5.0.1
- web-vitals: ^2.1.4

Note: Ensure all dependencies are installed before running the app.