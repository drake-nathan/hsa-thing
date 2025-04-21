import { HSADashboard } from "@/components/hsa-dashboard";
import { LoginButton } from "@/components/login-button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const Home = () => {
  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                HSA Thing
              </h1>
              <p className="text-muted-foreground">
                Manage your health savings account
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LoginButton />
              <ThemeModeToggle />
            </div>
          </header>
          <main>
            <Suspense
              fallback={
                <div className="flex h-[80vh] items-center justify-center">
                  Loading dashboard...
                </div>
              }
            >
              <HSADashboard />
            </Suspense>
          </main>
          <footer className="mt-16 py-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} HSA Thing. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </HydrateClient>
  );
};

export default Home;
