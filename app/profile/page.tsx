import "@aws-amplify/ui-react/styles.css";
import { getCurrentAuthUser } from "@/utils/amplify-utils";
import ProfileTabs from "@/components/ProfileTabs";

export default async function App() {
  const currentUser = await getCurrentAuthUser();
  const userName = currentUser?.userAttributes?.preferred_username;

  if (!userName) {
    throw new Error("No username defined");
  }

  return (
    <main>
      <h1 className="title is-size-1 has-text-centered">
        Hi {currentUser?.userAttributes?.preferred_username} 👋
      </h1>
      <ProfileTabs userName={userName} />
    </main>
  );
}
