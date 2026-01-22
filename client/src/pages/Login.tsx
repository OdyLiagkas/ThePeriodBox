import { useEffect } from "react";

export default function Login() {
  useEffect(() => {
    // drop demo cookie and bounce to account
    document.cookie =
      "demo_user=%7B%22id%22%3A%221%22%2C%22name%22%3A%22Demo%20User%22%2C%22email%22%3A%22demo%40periodbox.com%22%7D; path=/";
    window.location.replace("/account");
  }, []);
  return <p className="p-8">Signing you in…</p>;
}