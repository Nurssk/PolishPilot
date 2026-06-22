import { redirect } from "next/navigation";

export const metadata = {
  title: "Authorize Extension"
};

export default function Page() {
  redirect("/extension/authorize");
}
