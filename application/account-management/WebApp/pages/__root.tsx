import { createRootRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { ErrorPage } from "./-components/ErrorPage";
import { NotFound } from "./-components/NotFoundPage";
import { AuthenticationProvider } from "@repo/infrastructure/auth/AuthenticationProvider";
import { ReactAriaRouterProvider } from "@repo/infrastructure/router/ReactAriaRouterProvider";
import { ThemeModeProvider } from "@repo/infrastructure/themeMode/useThemeMode";

export const Route = createRootRoute({
  component: Root,
  errorComponent: ErrorPage,
  notFoundComponent: NotFound
});

function Root() {
  const navigate = useNavigate();
  return (
    <ThemeModeProvider>
      <ReactAriaRouterProvider>
        <AuthenticationProvider navigate={(options) => navigate(options)} afterSignIn="/admin/users" afterSignOut="/">
          <Outlet />
        </AuthenticationProvider>
      </ReactAriaRouterProvider>
    </ThemeModeProvider>
  );
}
