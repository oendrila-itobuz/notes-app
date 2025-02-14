import React, { useState, useEffect } from "react";

export default function Footer() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // to get realtime
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer bg-gray-100 fixed bottom-0 left-0 w-full">
      <hr className="border-gray-200 sm:mx-auto" />
      <div className="justify-center text-sm py-2 flex flex-col md:flex-row items-center gap-2">
        <div className="w-40">© {currentTime.toLocaleString()}</div>
        <div>WriteD. All rights reserved.</div>
      </div>
    </footer>
  );
}
