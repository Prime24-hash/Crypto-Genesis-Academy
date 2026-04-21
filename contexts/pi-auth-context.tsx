"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { PI_NETWORK_CONFIG } from "@/lib/system-config";
import { PI_APP_CONFIG } from "@/lib/pi-app-config";
import type {
  Product,
  SDKLiteInstance,
  UserPurchaseBalance,
} from "@/lib/sdklite-types";

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  sdk: SDKLiteInstance | null;
  products: Product[] | null;
  restoredPurchases: UserPurchaseBalance[] | null;
  userData: {
    username: string | null;
    avatar: string | null;
  };
  reinitialize: () => Promise<void>;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.Pi !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_URL) {
      reject(new Error("SDK URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_URL;
    script.async = true;

    script.onload = () => {
      console.log("Pi SDK script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load Pi SDK script");
      reject(new Error("Failed to load Pi SDK script"));
    };

    document.head.appendChild(script);
  });
};

const loadSDKLite = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window.SDKLite !== "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    if (!PI_NETWORK_CONFIG.SDK_LITE_URL) {
      reject(new Error("SDKLite URL is not set"));
      return;
    }
    script.src = PI_NETWORK_CONFIG.SDK_LITE_URL;
    script.async = true;

    script.onload = () => {
      console.log("SDKLite script loaded successfully");
      resolve();
    };

    script.onerror = () => {
      console.error("Failed to load SDKLite script");
      reject(new Error("Failed to load SDKLite script"));
    };

    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("Initializing Pi Network...");
  const [hasError, setHasError] = useState(false);
  const [sdk, setSdk] = useState<SDKLiteInstance | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [restoredPurchases, setRestoredPurchases] = useState<
    UserPurchaseBalance[] | null
  >(null);
  const [userData, setUserData] = useState<{
    username: string | null;
    avatar: string | null;
  }>({
    username: null,
    avatar: null,
  });

  const fetchProducts = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const { products } = await sdkInstance.state.products();
      setProducts(products);
    } catch (e) {
      console.error("Failed to load products:", e);
      setProducts([]);
    }
  };

  const fetchUserData = async (sdkInstance: SDKLiteInstance): Promise<void> => {
    try {
      const user = await sdkInstance.me();
      if (user) {
        setUserData({
          username: user.username || null,
          avatar: user.avatar || null,
        });
        console.log("[PiAuth] User data loaded:", { username: user.username, avatar: user.avatar });
      }
    } catch (e) {
      console.error("Failed to load user data:", e);
      setUserData({
        username: null,
        avatar: null,
      });
    }
  };

  const initialize = async () => {
    setHasError(false);
    setRestoredPurchases(null);
    try {
      setAuthMessage("Loading Pi SDK...");
      await loadPiSDK();
      
      setAuthMessage("Initializing Pi Network...");
      console.log("[PiAuth] Initializing Pi with appId:", PI_APP_CONFIG.appId);
      await window.Pi.init({
        version: PI_APP_CONFIG.version,
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
        appId: PI_APP_CONFIG.appId,
      });
      
      setAuthMessage("Loading SDKLite...");
      await loadSDKLite();

      setAuthMessage("Initializing SDKLite...");
      console.log("[PiAuth] Initializing SDKLite with appId:", PI_APP_CONFIG.appId);
      const sdkInstance = await window.SDKLite.init({
        appId: PI_APP_CONFIG.appId,
        version: PI_APP_CONFIG.version,
        sandbox: PI_NETWORK_CONFIG.SANDBOX,
      });
      
      setAuthMessage("Logging in...");
      const success = await sdkInstance.login();
      if (!success) {
        throw new Error("Login failed. Please try again.");
      }

      setSdk(sdkInstance);
      setIsAuthenticated(true);
      await fetchProducts(sdkInstance);
      await fetchUserData(sdkInstance);

      try {
        const { purchases } = await sdkInstance.state.restore();
        setRestoredPurchases(purchases);
        console.log("[PiAuth] Purchases restored", purchases);
      } catch (e) {
        console.error("[PiAuth] Failed to restore purchases:", e);
        setRestoredPurchases([]);
      }
    } catch (err) {
      console.error("[PiAuth] Initialization failed:", err);
      setHasError(true);
      setAuthMessage(
        err instanceof Error
          ? err.message
          : "Authentication failed. Please try again.",
      );
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const value: PiAuthContextType = {
    isAuthenticated,
    authMessage,
    hasError,
    sdk,
    products,
    restoredPurchases,
    userData,
    reinitialize: initialize,
  };

  return (
    <PiAuthContext.Provider value={value}>{children}</PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (context === undefined) {
    throw new Error("usePiAuth must be used within a PiAuthProvider");
  }
  return context;
}
