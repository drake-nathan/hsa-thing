import { LatestPost } from "@/app/_components/post";
import { api, HydrateClient } from "@/trpc/server";

const Home = async () => {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <p className="text-2xl text-white">{hello.greeting}</p>
          <LatestPost />
        </div>
      </main>
    </HydrateClient>
  );
};

export default Home;
