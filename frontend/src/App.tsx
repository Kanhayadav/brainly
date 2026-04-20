import { Dashboard } from "./pages/Dashboard"
import { Login } from "./pages/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { SharedPage } from "./pages/SharedPage"
import { ProtectedRoute } from './auth/ProtectedRoute'
import { PublicRoute } from './auth/PublicRoute'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>}></Route>

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>}></Route >

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/*incapsulate the dashbaord compoment in the protected route*/}
        <Route path="/share/:hash" element={<SharedPage />}></Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App
