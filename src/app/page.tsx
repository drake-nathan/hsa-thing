import { Suspense } from "react";

import { Header } from "@/components/header";
import { HSADashboard } from "@/components/hsa-dashboard";
import { api, HydrateClient } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Home = () => {
  void api.hsaTransaction.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-6">
          <Header />
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
