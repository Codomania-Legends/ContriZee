import { useState } from "react";
import Add_Members from "./Components/Add_Members";


function App({ user, members, setMembers }) {


  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Section 1: Adding People */}
      <Add_Members user={user} members={members} setMembers={setMembers} />
      
    </div>
  );
}

export default App;