# ⚛️ Frontend Application (Next.js)

This directory contains the Next.js application, which serves as the user interface for the U-Reg Exchange Rate Application. It communicates with the **Backend API** to display the latest and historical exchange rates, along with administrative functionalities.

## 🛠️ Tech Stack

* **Framework**: Next.js 16.0.3 (App Router)
* **Language**: JavaScript / JSX
* **Styling**: Tailwind CSS
* **Components**: ShaCdn / Radix UI for accessible components
* **Data Fetching**: Axios
* **State Management**: React Context / Redux (if used)

## 📂 Architecture and Structure

The application follows the **Next.js App Router** structure:

* **`src/app`**: Route-based pages (`/page.jsx`)
* **`(route)`**: Route groups for structuring, containing `admin` and `user` main pages
* **`layout.js`**: Global layout wrapper
* **`src/components`**: Reusable UI components
* **`src/ui`**: Custom Radix UI components styled with Tailwind (e.g., `button.jsx`, `input.jsx`)
* **`src/services`**: API call logic separated into `api.js`, `adminAPI.js`, `userAPI.js` for modularity
* **`src/lib`**: Utility functions, constants, and helper methods

## 💻 Local Development (Without Docker)

Ensure the **Backend API is running at `http://localhost:5000`** before starting the frontend.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be accessible at `http://localhost:3000`.

## 🌐 Environment Variables

Configure the API URL via an environment variable:

| Variable Name         | Description                  | Default Value           |
| :-------------------- | :--------------------------- | :---------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | `http://localhost:5000` |

## 🚀 Available Pages / Routes

| Route      | Description                                                   |
| :--------- | :------------------------------------------------------------ |
| `/`        | Home page – shows latest exchange rates                       |
| `/history` | Historical exchange rates page                                |
| `/admin`   | Admin dashboard for managing currencies and rates (protected) |

## 🧩 Notes

* Ensure the backend is running and accessible before starting the frontend.
* Tailwind CSS is configured globally, but you can extend it via `tailwind.config.js`.
* API services are modularized in `src/services` for easy maintenance.
