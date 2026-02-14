# E-Commerce Printing Press Website

A modern, responsive e-commerce web application designed for a printing press business. Built with **Angular 19**, this platform offers a seamless user experience for browsing products, customizing designs, and placing orders.

## 🚀 Features

- **Dynamic Product Showcase**: Browse a wide range of printing products with detailed descriptions.
- **Interactive Customize Studio**: A dedicated feature allowing users to customize their print designs directly on the website.
- **Greeting Cards Layout**: Specialized section for browsing and selecting greeting cards.
- **Responsive Design**: Fully responsive layout ensuring a great experience on desktops, tablets, and mobile devices.
- **Smooth Animations**: Enhanced user interface with scroll-reveal and parallax effects for a premium feel.
- **Direct Communication**: Integrated WhatsApp floating action button for quick customer support.
- **Contact Management**: Easy-to-use contact form for inquiries.

## 🛠️ Tech Stack

- **Framework**: [Angular 19](https://angular.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [SCSS](https://sass-lang.com/) (Modular stylesheets with variables and mixins)
- **State Management & Async**: [RxJS](https://rxjs.dev/)
- **Routing**: Angular Router with View Transitions

## 📂 Project Structure

The project follows a modular architecture for scalability and maintainability.

```
src/
├── app/
│   ├── core/                 # Singleton services and global components
│   │   ├── components/       # (Navbar, Footer, Toast, WhatsApp Fab)
│   │   └── services/         # (Scroll, Theme, Toast Services)
│   ├── features/             # Feature modules (Pages)
│   │   ├── contact/
│   │   ├── customize-studio/
│   │   ├── greeting-cards/
│   │   ├── home/
│   │   └── products/
│   ├── shared/               # Reusable code across the app
│   │   ├── directives/       # (Parallax, Scroll Reveal)
│   │   └── interfaces/       # (Data models/Types)
│   ├── app.config.ts         # Application configuration
│   ├── app.routes.ts         # Main routing configuration
│   └── app.ts                # Root component
├── assets/                   # Static assets (images, fonts, icons)
├── styles.scss               # Global styles
└── main.ts                   # Application entry point
```

## 🔧 Installation & Setup

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)

### Steps

1.  **Clone the repository**

    ```bash
    git clone <repository-url>
    cd E-Commerce-Printing-Press-Website
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run the development server**

    ```bash
    npm start
    ```

    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

4.  **Build for production**
    ```bash
    npm run build
    ```
    The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeatureName`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed with ❤️ by [papaicr7](https://github.com/papaicr7)**
