export default function ({ store, redirect, req }) {
  const { strategies, isAuthenticated } = store.getters;
  if (!isAuthenticated) {
    if (strategies.length > 1) {
      return redirect("/signin");
    } else if (strategies.length === 1) {
      const origin = (process.server) ? req.headers.host : window.location.origin;
      return redirect(301, `${origin}/auth/${strategies[0]}`);
    } else {
      return redirect("/");
    }
  }
  return null;
}
