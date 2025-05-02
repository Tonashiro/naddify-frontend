import { useMutation, UseMutationResult } from "@tanstack/react-query";

interface IDiscordAuthResponse {
  url: string;
}

export const useConnectDiscord = (): UseMutationResult<
  IDiscordAuthResponse,
  Error,
  void,
  unknown
> => {
  return useMutation<IDiscordAuthResponse, Error, void>({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/discord`
      );

      if (!res.ok) {
        throw new Error("Failed to get Discord auth URL");
      }

      return res.json();
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
};
