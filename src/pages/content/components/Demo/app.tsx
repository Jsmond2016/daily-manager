import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  return null;
  return <div className="content-view">content view</div>;
}
