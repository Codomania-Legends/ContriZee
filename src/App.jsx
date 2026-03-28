import Signup from "./Components/Signup"
import Login from "./Components/Login"
import Settlement from "./Components/Settlement"

function App() {
  const usernames = ["Anshul", "Vidhi", "Anjali", "Mohini"]
  return (
    <>
      <Settlement usernames={usernames} />
    </>
  )
}

export default App;