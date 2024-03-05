import { CustomProvider } from "rsuite";
import FullPage from "./Pages/FullPage";

function App() {
  return (
    <CustomProvider theme="dark">
      <FullPage />
    </CustomProvider>
  );
}

export default App;
