"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IUser, useUserContext } from "@/contexts/userContext";
import { toast } from "react-toastify";
import { Spinner } from "@/components/Spinner";
import { isAddress } from "viem";
import Image from "next/image";

interface IFormValues {
  wallet_address: string;
}

interface IBetaUserModal {
  isModalOpen?: boolean;
  setIsModalOpen?: Dispatch<SetStateAction<boolean>>;
}

export const BetaUserModal: React.FC<IBetaUserModal> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { user, setUser } = useUserContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<IFormValues>({
    defaultValues: {
      wallet_address: user?.wallet_address ?? "",
    },
  });

  const handleSubmit = async (data: IFormValues) => {
    try {
      setIsPending(true);
      const response = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ wallet_address: data.wallet_address }),
      });

      if (!response.ok) {
        const error = await response.json();
        setIsPending(false);
        throw new Error(error.message || "Failed to submit wallet address");
      }

      const updatedUser: IUser = await response.json();
      setUser(updatedUser);

      toast.success("Wallet address submitted successfully!");
      setIsOpen(false);
      setIsPending(false);

      if (setIsModalOpen) {
        setIsModalOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "An unexpected error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open && user?.wallet_address && isModalOpen === undefined) {
      toast.info(
        "You already submitted your wallet address. If you want to change it, head to your profile and click on 'Change Wallet Address'."
      );
      return;
    }

    if (setIsModalOpen) {
      setIsModalOpen(open);
    } else {
      setIsOpen(open);
    }
  };

  const isModalOpenState = isModalOpen ?? isOpen;

  return (
    <Dialog open={isModalOpenState} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isModalOpen === undefined && setIsModalOpen === undefined ? (
          <Image
            src="/images/beta_user.webp"
            alt="Beta user badge"
            width={80}
            height={100}
            className="cursor-pointer hover:scale-105 transition-transform duration-300"
          />
        ) : null}
      </DialogTrigger>
      <DialogContent>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xs bg-black/30 z-50">
            <Spinner />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Beta User</DialogTitle>
          <DialogDescription>
            Congratulations, you are a beta user! Add your wallet below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              name="wallet_address"
              control={form.control}
              rules={{
                required: "Wallet address is required",
                validate: (value) =>
                  isAddress(value) || "Invalid wallet address format",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Enter your wallet address"
                      className="w-full px-3 py-2 outline rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all cursor-pointer"
                disabled={isPending}
              >
                Submit
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all cursor-pointer"
                  disabled={isPending}
                >
                  Cancel
                </button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
