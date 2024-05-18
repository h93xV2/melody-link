import "@aws-amplify/ui-react/styles.css";
import { getCurrentAuthUser, getCurrentUserFiles } from "@/utils/amplify-utils";
import Library from "@/components/FileLibrary";
import { ListPaginateWithPathOutput } from "aws-amplify/storage";

export default async function App() {
  const currentUser = await getCurrentAuthUser();

  return (
    <main>
      <h1 className="title is-size-1 has-text-centered">
        Hi {currentUser?.userAttributes?.preferred_username} 👋
      </h1>
      <Library />
    </main>
  );
}
