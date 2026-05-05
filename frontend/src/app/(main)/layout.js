import AuthGuard from "../../utils/AuthGuard";

export default function ProtectedLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}