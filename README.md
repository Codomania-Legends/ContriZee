<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=250&section=header&text=ContriZee&fontSize=90&fontAlignY=35&desc=Your%20Ultimate%20Smart%20Expense%20Splitter%20%26%20Trip%20Manager&descAlignY=55&descAlign=50" alt="ContriZee Header Banner" />
</div>

<div align="center">
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Firebase](https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  
  <br />
  <br />

  [Explore Docs](#-outstanding-features) · [Report Bug](https://github.com/yourusername/ContriZee/issues) · [Request Feature](https://github.com/yourusername/ContriZee/issues)

</div>

---

<br />

> 🌍 **ContriZee** makes splitting group expenses frictionless, smart, and fun. Whether you are on a weekend getaway to Goa or a backpacking trip across Europe, log expenses in multiple currencies, calculate smart settlements to minimize transactions, and instantly generate **UPI QR codes** to pay your friends back. Plus, use our AI Oracle to send hilariously passive-aggressive reminder texts! 💸🤝

<br />

## 🚀 Live Demo

[![See it in Action](https://img.shields.io/badge/Live_Demo-Watch_Now-blue?style=for-the-badge&logo=vercel)](https://your-live-demo-link.com) 
**(Replace with your Vercel, Netlify, or Firebase hosting link)*

##Visuals
<img width="1919" height="1026" alt="image" src="https://github.com/user-attachments/assets/5ab0d5aa-fb81-4b9b-93a0-48bbcfe85d85" /></br>
<img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/543d7f97-4a5a-4d4c-85db-e4e83158b633" />
<img width="1919" height="1025" alt="image" src="https://github.com/user-attachments/assets/06efafce-9661-40f4-9d4c-d2eba5c77c9c" />
<img width="1919" height="1023" alt="image" src="https://github.com/user-attachments/assets/77b1e336-d41a-4ecf-9513-d894a8da19ec" />
<img width="1915" height="1008" alt="image" src="https://github.com/user-attachments/assets/a9bba81d-9666-4b9d-b0f8-a004b6dd16e4" />
<img width="1918" height="872" alt="image" src="https://github.com/user-attachments/assets/e96398f5-e257-4c26-99e2-d47770b5efe1" />


---

## ✨ Outstanding Features

| Feature | Description |
| ------- | ----------- |
| 👥 **Seamless Group Management** | Create trips and easily add friends to your travel group. |
| 💳 **Lightning-Fast Expense Logging**| Categorize spends (🍔 Food, 🏨 Stay, 🚕 Travel) with a beautiful, intuitive UI. |
| 💱 **Built-in Currency Converter** | Traveling abroad? Log expenses in **USD, EUR, or GBP**, and auto-convert them to **INR** on the fly! |
| 🧠 **AI-Optimized Smart Settlement**| Uses a greedy algorithm to minimize the total number of transactions between friends. Less math, more relaxing! |
| 📲 **Instant UPI QR Codes** | No more asking for numbers. Generate a scannable UPI QR code to instantly pay back the exact amount owed. |
| 🤖 **AI Debt Reminders** | Powered by OpenRouter, generate funny, dynamic text messages to politely (or passively-aggressively) ask your friends for your money back. |
| 💾 **Realtime Sync** | Powered by Firebase Realtime Database. All your friends see the same expenses updated instantly. |
| 🍪 **Persistent Sessions** | Safely keeps you logged into your active trip even if you refresh the page. |

---

## 📸 Sneak Peek

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Login/Signup</b></td>
      <td align="center"><b>Add Expense</b></td>
      <td align="center"><b>Expense Summary</b></td>
      <td align="center"><b>Smart Settlement</b></td>
    </tr>
    <tr>
      <td><img src="https://via.placeholder.com/250x500.png?text=Login/Signup" alt="Login Screen" width="250"></td>
      <td><img src="https://via.placeholder.com/250x500.png?text=Add+Expense" alt="Add Expense" width="250"></td>
      <td><img src="https://via.placeholder.com/250x500.png?text=Summary" alt="Expense Summary" width="250"></td>
      <td><img src="https://via.placeholder.com/250x500.png?text=Smart+Settlement" alt="Smart Settlement" width="250"></td>
    </tr>
  </table>
  <br/>
  <i>(Replace these placeholder links with actual screenshots of your app!)</i>
</div>

---

## 🛠️ Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,firebase,js&perline=5" alt="Tech Stack Icons" />
</div>

<br/>

- **Frontend:** React (Vite), React Router v6
- **Styling:** Tailwind CSS (Responsive, Mobile-First Design)
- **Backend & Auth:** Firebase Realtime Database
- **AI Integration:** OpenRouter API (LLM Generation)
- **Utilities:** `js-cookie` (Session Management), `qrcode` (UPI Generation), `sileo` (Beautiful Toast Notifications), `react-xarrows` (Visual Dependency Graphs)

---

## ⚙️ Local Setup & Installation

Get your local environment up and running in minutes.

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/ContriZee.git
cd ContriZee
```

### 2️⃣ Install Dependencies
```bash
npm install
# or
yarn install
```

### 3️⃣ Setup Environment Variables
Create a `.env` file in the root of your project and add your API keys:
```env
# Your OpenRouter API Key for the AI Text Generator
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Your Firebase Config Variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4️⃣ Run the Development Server
```bash
npm run dev
# or
yarn dev
```

> **Note:** Open [http://localhost:5173](http://localhost:5173) in your browser to see the app! ✨

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/ContriZee/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <h3>Made with ❤️ and a lot of ☕ for stress-free traveling.</h3>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" alt="Footer Banner" />
</div>
