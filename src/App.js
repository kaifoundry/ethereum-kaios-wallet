import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NewUser from "./pages/NewUser/NewUser";
import CreatePassword from "./pages/CreatePassword/CreatePassword";
import ImportWallet from "./pages/ImportWallet/ImportWallet";
import { Wallet } from "./pages/Wallet/Wallet";
import Mnemonic from "./pages/Mnemonic/Mnemonic";
import MnemonicVerification from "./pages/MnemonicVerification/MnemonicVerification";
import Setting from "./pages/Setting/Setting";
import Receive from "./pages/Receive/Receive";
import QRShare from "./pages/QRShare/QRShare";
import Export from "./pages/Export/Export";
import Send from "./pages/Send/Send";
import Transaction from "./pages/Transaction/Transaction";
import Details from "./pages/Details/Details";
import MultiWalletScreen from "./pages/MultiWalletScreen/MultiWalletScreen";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/*" element={<Home />} />
        <Route exact path="/new-user/*" element={<NewUser />} />
        <Route exact path="/create-password/:importStatus" element={<CreatePassword />} />
        <Route exact path="/mnmonic" element={<Mnemonic />} />
        <Route exact path="/verification" element={<MnemonicVerification />} />
        <Route exact path="/wallet" element={<Wallet />} />
        <Route exact path="/import-wallet" element={<ImportWallet />} />
        <Route exact path="/setting/*" element={<Setting />} />

        <Route exact path="/send" element={<Send />} />
        <Route exact path="/receive/*" element={<Receive />} />
        <Route exact path="/all-wallet" element={<MultiWalletScreen />} />
        <Route exact path="/export" element={<Export />} />
        <Route exact path="/qrcode/:address" element={<QRShare />} />

        <Route exact path="/transactions" element={<Transaction />} />
        <Route exact path="/details/:messageid" element={<Details />} />
      </Routes>
    </div>
  );
}




export default App;
