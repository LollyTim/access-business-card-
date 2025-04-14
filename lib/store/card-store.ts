import { create } from "zustand";

interface FormData {
  fullName: string;
  position: string;
  phone: string;
  email: string;
  image: string | null;
}

interface CardStore {
  formData: FormData;
  qrCodeUrl: string | null;
  isGenerating: boolean;
  username: string;
  setFormData: (data: FormData) => void;
  setQrCodeUrl: (url: string | null) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setUsername: (username: string) => void;
  reset: () => void;
}

const initialFormData: FormData = {
  fullName: "",
  position: "",
  phone: "",
  email: "",
  image: null,
};

export const useCardStore = create<CardStore>((set) => ({
  formData: initialFormData,
  qrCodeUrl: null,
  isGenerating: false,
  username: "",
  setFormData: (data) => set({ formData: data }),
  setQrCodeUrl: (url) => set({ qrCodeUrl: url }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setUsername: (username) => set({ username }),
  reset: () =>
    set({ formData: initialFormData, qrCodeUrl: null, username: "" }),
}));
