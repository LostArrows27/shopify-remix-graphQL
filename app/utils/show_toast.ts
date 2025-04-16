type ToastType = {
  duration?: number;
  isError?: boolean;
};

export const showToast = (message: string, option?: ToastType) => {
  shopify.toast.show(message, {
    duration: option?.duration || 2000,
    isError: option?.isError || false,
  });
};
