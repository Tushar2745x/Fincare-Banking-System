import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import AboutUs from "./page/AboutUs";
import ContactUs from "./page/ContactUs";
import Header from "./NavbarComponent/Header";
import HomePage from "./page/HomePage";
import UserRegister from "./UserComponent/UserRegister";
import UserLoginForm from "./UserComponent/UserLoginForm";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import CustomerRegisterForm from "./UserComponent/CustomerRegisterForm";
import AddBankForm from "./BankComponent/AddBankForm";
import ViewAllBanks from "./BankComponent/ViewAllBanks";
import ViewBankManagers from "./UserComponent/ViewBankManagers";
import ViewAllBankCustomers from "./UserComponent/ViewAllBankCustomers";
import ViewBankAccount from "./BankAccountComponent/ViewBankAccount";
import ViewBankCustomers from "./UserComponent/ViewBankCustomers";
import ViewAllBankAccounts from "./BankAccountComponent/ViewAllBankAccounts";
import ViewBankAccounts from "./BankAccountComponent/ViewBankAccounts";
import AddBankAccount from "./BankAccountComponent/AddBankAccount";
import ViewBankAllTransactions from "./BankTransactionComponent/ViewBankAllTransactions";
import ViewCustomerTransactions from "./BankTransactionComponent/ViewCustomerTransactions";
import ViewAllBankTransactions from "./BankTransactionComponent/ViewAllBankTransactions";
import CustomerAccountFundTransfer from "./BankTransactionComponent/CustomerAccountFundTransfer";
import Footer from "./page/Footer";
import LoanPage from "./page/LoanPage";
import CardsPage from "./page/CardsPage";
import AccountsPage from "./page/AccountsPage";
import LoanApplicationPage from "./page/LoanApplicationPage";
import LoanStatusDashboard from "./page/LoanStatusDashboard";
import BankLoanApprovalDashboard from "./page/BankLoanApprovalDashboard";
import CardApplicationPage from "./page/CardApplicationPage";
import CardApplyPage from "./page/CardApplyPage";
import BankCardApprovalDashboard from "./page/BankCardApprovalDashboard";
import CardStatusDashboard from "./page/CardStatusDashboard";
import CardDetailsPage from "./page/CardDetailsPage";

function App() {
  const location = useLocation();

  // ✅ Routes where footer should be hidden (UPDATED ONLY HERE)
  const hideFooterRoutes = [
    "/user/login",
    "/user/admin/register",
    "/customer/account/transfer",
   "/customer/bank/account/detail",
   "/customer/bank/account/statement" // ✅ added
  ];

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/home/all/hotel/location" element={<HomePage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/loans" element={<LoanPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route path="/loan/apply" element={<LoanApplicationPage />} />
        <Route path="/customer/loan/status" element={<LoanStatusDashboard />} />
        <Route path="/customer/card/status" element={<CardStatusDashboard />} />
        <Route path="/customer/card/details" element={<CardDetailsPage />} />
        <Route path="/card/apply" element={<CardApplyPage />} />
        <Route path="/user/customer/register" element={<CustomerRegisterForm />} />
        <Route path="/user/bank/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/admin/bank/register" element={<AddBankForm />} />
        <Route path="/admin/bank/all" element={<ViewAllBanks />} />
        <Route path="/admin/bank/managers" element={<ViewBankManagers />} />
        <Route
          path="/admin/all/bank/customers"
          element={<ViewAllBankCustomers />}
        />
        <Route path="/bank/customer/all" element={<ViewBankCustomers />} />
        <Route
          path="/customer/bank/account/detail"
          element={<ViewBankAccount />}
        />
        <Route
          path="/admin/bank/account/all"
          element={<ViewAllBankAccounts />}
        />
        <Route path="/bank/account/all" element={<ViewBankAccounts />} />
        <Route path="/bank/customer/account/add" element={<AddBankAccount />} />
        <Route
          path="/bank/customer/account/transactions"
          element={<ViewBankAllTransactions />}
        />
        <Route
          path="/bank/loan/applications"
          element={<BankLoanApprovalDashboard />}
        />
        <Route
          path="/bank/card/applications"
          element={<BankCardApprovalDashboard />}
        />
        <Route
          path="/customer/bank/account/statement"
          element={<ViewCustomerTransactions />}
        />
        <Route
          path="/admin/bank/customer/transaction/all"
          element={<ViewAllBankTransactions />}
        />
        <Route
          path="/customer/account/transfer"
          element={<CustomerAccountFundTransfer />}
        />
      </Routes>

      {/* ✅ Footer condition (unchanged) */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default App;
