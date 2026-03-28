import { useState } from "react";
import Add_Members from "./Components/Add_Members";


function App({ members, setMembers }) {


  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Section 1: Adding People */}
      <Add_Members members={members} setMembers={setMembers} />
      
    </div>
  );
}

export default App;