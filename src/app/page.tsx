import { IProject } from "@/app/api/projects/route";
import { Hero } from "@/components/Hero";
import { Projects } from "@/components/Projects";

export default async function Home() {
  // Mock data for 10 projects
  const projects: IProject[] = [
    {
      id: "1",
      name: "World Capital Markets",
      description:
        "The marketplace for spot, perps, and lending - all CLOBs, all cross-margined, fully onchain.",
      website: "https://example.com",
      twitter: "https://twitter.com/wcm_inc",
      discord: "https://discord.com/invite/example",
      github: "https://docs.example.com",
      status: "TRUSTABLE",
      votes_for: 1398,
      votes_against: 157,
      created_by: { username: "monad_admin", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-defi", name: "DeFi" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Project Alpha",
      description: "A revolutionary platform for decentralized finance.",
      website: "https://alpha.com",
      twitter: "https://twitter.com/project_alpha",
      discord: "https://discord.com/invite/alpha",
      github: "https://docs.alpha.com",
      status: "TRUSTABLE",
      votes_for: 1200,
      votes_against: 100,
      created_by: { username: "alpha_builder", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-blockchain", name: "Blockchain" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Beta Finance",
      description: "Empowering users with decentralized financial tools.",
      website: "https://beta.com",
      twitter: "https://twitter.com/beta_finance",
      discord: "https://discord.com/invite/beta",
      github: "https://docs.beta.com",
      status: "PENDING",
      votes_for: 980,
      votes_against: 50,
      created_by: { username: "beta_user", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-finance", name: "Finance" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Gamma Protocol",
      description: "A next-gen protocol for secure transactions.",
      website: "https://gamma.com",
      twitter: "https://twitter.com/gamma_protocol",
      discord: "https://discord.com/invite/gamma",
      github: "https://docs.gamma.com",
      status: "TRUSTABLE",
      votes_for: 800,
      votes_against: 30,
      created_by: { username: "gamma_dev", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-protocol", name: "Protocol" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      name: "Delta Exchange",
      description: "The future of decentralized trading.",
      website: "https://delta.com",
      twitter: "https://twitter.com/delta_exchange",
      discord: "https://discord.com/invite/delta",
      github: "https://docs.delta.com",
      status: "SCAM",
      votes_for: 1500,
      votes_against: 200,
      created_by: { username: "delta_team", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-exchange", name: "Exchange" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Epsilon Network",
      description: "A decentralized network for global connectivity.",
      website: "https://epsilon.com",
      twitter: "https://twitter.com/epsilon_network",
      discord: "https://discord.com/invite/epsilon",
      github: "https://docs.epsilon.com",
      status: "PENDING",
      votes_for: 700,
      votes_against: 20,
      created_by: { username: "epsi_dev", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-network", name: "Network" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "7",
      name: "Zeta Labs",
      description: "Innovating the future of blockchain technology.",
      website: "https://zeta.com",
      twitter: "https://twitter.com/zeta_labs",
      discord: "https://discord.com/invite/zeta",
      github: "https://docs.zeta.com",
      status: "TRUSTABLE",
      votes_for: 600,
      votes_against: 10,
      created_by: { username: "zeta_admin", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-labs", name: "Labs" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "8",
      name: "Theta DAO",
      description: "A decentralized autonomous organization for governance.",
      website: "https://theta.com",
      twitter: "https://twitter.com/theta_dao",
      discord: "https://discord.com/invite/theta",
      github: "https://docs.theta.com",
      status: "RUG",
      votes_for: 1100,
      votes_against: 90,
      created_by: { username: "theta_user", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-dao", name: "DAO" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "9",
      name: "Lambda Finance",
      description: "Simplifying decentralized finance for everyone.",
      website: "https://lambda.com",
      twitter: "https://twitter.com/lambda_finance",
      discord: "https://discord.com/invite/lambda",
      github: "https://docs.lambda.com",
      status: "TRUSTABLE",
      votes_for: 900,
      votes_against: 40,
      created_by: { username: "lambda_mod", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-finance", name: "Finance" }],
      created_at: new Date().toISOString(),
    },
    {
      id: "10",
      name: "Omega Protocol",
      description: "The ultimate protocol for secure and fast transactions.",
      website: "https://omega.com",
      twitter: "https://twitter.com/omega_protocol",
      discord: "https://discord.com/invite/omega",
      github: "https://docs.omega.com",
      status: "TRUSTABLE",
      votes_for: 1300,
      votes_against: 70,
      created_by: { username: "omega_builder", avatar: "/images/monad.webp" },
      categories: [{ id: "cat-protocol", name: "Protocol" }],
      created_at: new Date().toISOString(),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col mx-auto w-full px-[5%] max-w-[1920px] text-text-primary">
      <Hero />
      {projects.map((project, index) => (
        <Projects key={index} projects={projects} />
      ))}
    </div>
  );
}

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { IProject } from "@/app/api/projects/route";
// import { Hero } from "@/components/Hero";
// import { Projects } from "@/components/Projects";

// export default function Home() {
//   const { data, isLoading } = useQuery<{
//     projects: IProject[];
//   }>({
//     queryKey: ["projects"],
//     queryFn: async () => {
//       const res = await fetch(`/api/projects`, {
//         credentials: "include",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch projects");
//       }

//       return res.json();
//     },
//     refetchOnWindowFocus: true,
//     retry: 1,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center w-full h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col mx-auto w-full px-[5%] max-w-[1920px] text-text-primary">
//       <Hero />
//       <Projects projects={data?.projects ?? []} />
//     </div>
//   );
// }
