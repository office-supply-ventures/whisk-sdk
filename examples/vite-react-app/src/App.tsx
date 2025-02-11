import "./App.css";
import { Avatar, Name } from "@paperclip-labs/whisk-sdk/identity";

function App() {
  const address = "0x3380A055844CF74E7704E6dddDd44E9D09D2694C";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <Avatar address={address} size={32} />
        <Name address={address} />
      </div>
      {/* <Profile address={address} /> */}
    </div>
  );
}

export default App;
