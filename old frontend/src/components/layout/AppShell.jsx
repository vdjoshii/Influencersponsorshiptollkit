import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ToastContainer from "../ui/Toast";

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}