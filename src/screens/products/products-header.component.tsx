import Image from "next/image";
import { Header, Flex } from "@/src/layout/container.layout";
import { Text } from "@/src/layout/text.layout";
import { IconButton } from "@/src/layout/icon-button.layout";
import { useAuth } from "@/src/context/auth.context";
import { useToast } from "@/src/layout/toast.layout";

export default function ProductsHeader() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await logout();
    showToast("Logged out successfully", "info");
  };

  return (
    <Header>
      <Flex gap="md" align="center">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={30}
          height={30}
          priority
        />
        <Text variant="h3" color="accent-blue">
          My Products
        </Text>
      </Flex>
      <Flex gap="md" align="center">
        <Text variant="caption" color="accent-blue">
          {user?.email}
        </Text>
        <IconButton icon="logout" onClick={handleLogout} title="Logout" />
      </Flex>
    </Header>
  );
}
