import "./../app/app.css";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentAuthUser, getCurrentUserFiles } from "@/utils/amplify-utils";
import FileUpload from "@/components/FileUpload";

export default async function App() {
  const currentUser = await getCurrentAuthUser();
  const filesItems = (await getCurrentUserFiles())?.items;
  let files: string[] = []

  if  (filesItems) {
    files = Array.from(filesItems).map(item => item.path);
  }

  return (
    <main>
      <h1>Hi {currentUser?.userAttributes?.preferred_username}</h1>
      <FileUpload files={files} />
    </main>
  );
}
